'use server'

import { cookies } from 'next/headers'
import { firestoreDB } from '@/lib/firebase'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { revalidatePath } from 'next/cache'

export async function identifyUser(formData: FormData) {
  const name = formData.get('name') as string
  const phoneNumber = formData.get('phoneNumber') as string

  if (!name || !phoneNumber) {
    throw new Error('Name and phone number are required')
  }

  // Generate a random token
  const token = crypto.randomUUID()

  try {
    const usersRef = firestoreDB.collection('users')
    const snapshot = await usersRef.where('phoneNumber', '==', phoneNumber).limit(1).get()

    let userToken = token

    if (snapshot.empty) {
      // Create new user profile
      const docRef = usersRef.doc()
      await docRef.set({
        id: docRef.id,
        name,
        phoneNumber,
        user_token: token,
        createdAt: new Date().toISOString()
      })
    } else {
      // Update existing user profile
      const doc = snapshot.docs[0]
      await doc.ref.update({ user_token: token })
      userToken = token
    }

    // Await cookies before setting, next 15+ async cookies
    const cookieStore = await cookies()
    cookieStore.set('user_token', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/'
    })
  } catch (error) {
    console.error('Error identifying user:', error)
    throw new Error('Failed to create user profile')
  }

  redirect('/dashboard')
}

// Memoize user data per request to prevent hitting the DB multiple times in the same render
const getCachedUser = cache(async (userToken: string) => {
  try {
    const snapshot = await firestoreDB.collection('users')
      .where('user_token', '==', userToken)
      .limit(1)
      .get()

    if (snapshot.empty) return null
    return snapshot.docs[0].data() as any
  } catch (error) {
    console.error('Database lookup failed in getCachedUser:', error)
    return null
  }
})

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_token')?.value

  if (!token) return null

  try {
    return await getCachedUser(token)
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('user_token')
  redirect('/')
}

export async function registerEvent(eventId: string, details: { phoneNumber: string, teamName?: string, hostelName?: string, teamMembers?: Array<{name: string, isCaptain?: boolean}> }) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    const regsRef = firestoreDB.collection('registrations')
    
    // Check for existing registration for user & event combination
    const existingRef = await regsRef
      .where('userId', '==', user.id)
      .where('eventId', '==', eventId)
      .limit(1)
      .get()

    if (!existingRef.empty) {
       return { error: 'Registration failed or already registered' }
    }

    const regDoc = regsRef.doc()
    await regDoc.set({
      id: regDoc.id,
      userId: user.id,
      eventId: eventId,
      phoneNumber: details.phoneNumber,
      teamName: details.teamName || null,
      hostelName: details.hostelName || null,
      teamMembers: details.teamMembers || [],
      registeredAt: new Date().toISOString()
    })
    
    // Invalidate the cache for user's dashboard and my-events so the UI updates
    revalidatePath('/dashboard')
    revalidatePath('/my-events')
    revalidatePath(`/events/${eventId}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Failed to register:', error?.message || error)
    return { error: 'Registration failed or already registered' }
  }
}

export async function unregisterEvent(registrationId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  try {
     const regDoc = await firestoreDB.collection('registrations').doc(registrationId).get()
     
     if (!regDoc.exists) {
       return { error: 'Registration not found' }
     }
     
     const regData = regDoc.data()
     
     // Log for debugging ID mismatches on production
     if (regData?.userId !== user.id) {
       console.error(`Unregister auth mismatch: regUserId=${regData?.userId}, currentUserId=${user.id}`)
       return { error: 'Unauthorized' }
     }

     await regDoc.ref.delete()
     revalidatePath('/my-events')
     return { success: true }
  } catch (error) {
    console.error('Failed to unregister:', error)
    return { error: 'Failed to cancel registration' }
  }
}

export async function submitContact(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const hostelName = formData.get('hostelName') as string | null
  const message = formData.get('message') as string

  if (!fullName || !email || !message) {
    return { error: 'Full name, email, and message are required' }
  }

  try {
    const contactRef = firestoreDB.collection('contacts').doc()
    await contactRef.set({
      id: contactRef.id,
      fullName,
      email,
      hostelName: hostelName || null,
      message,
      createdAt: new Date().toISOString()
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to submit contact form:', error)
    return { error: 'Failed to send message. Please try again later.' }
  }
}
