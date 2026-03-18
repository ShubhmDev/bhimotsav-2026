'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function identifyUser(formData: FormData) {
  const name = formData.get('name') as string
  const phoneNumber = formData.get('phoneNumber') as string

  if (!name || !phoneNumber) {
    throw new Error('Name and phone number are required')
  }

  // Generate a random token
  const token = crypto.randomUUID()

  try {
    // Check if phoneNumber already exists
    let user = await prisma.user.findUnique({
      where: { phoneNumber }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          phoneNumber,
          user_token: token
        }
      })
    } else {
      user = await prisma.user.update({
        where: { phoneNumber },
        data: { user_token: token }
      })
    }

    // Await cookies before setting, next 15+ async cookies
    const cookieStore = await cookies()
    cookieStore.set('user_token', user.user_token, {
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

import { unstable_cache } from 'next/cache'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_token')?.value

  if (!token) return null

  // Cache user data to prevent hitting the DB on every page load
  const getCachedUser = unstable_cache(
    async (userToken: string) => {
      return await prisma.user.findUnique({
        where: { user_token: userToken }
      })
    },
    ['current-user'],
    { tags: ['user'], revalidate: 60 } // Revalidate every 60 seconds
  )

  return getCachedUser(token)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('user_token')
  redirect('/')
}

import { revalidatePath } from 'next/cache'

export async function registerEvent(eventId: string, details: { phoneNumber: string, teamName?: string, hostelName?: string, teamMembers?: Array<{name: string, isCaptain?: boolean}> }) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  try {
    await prisma.registration.create({
      data: {
        userId: user.id,
        eventId: eventId,
        phoneNumber: details.phoneNumber,
        teamName: details.teamName || null,
        hostelName: details.hostelName || null,
        teamMembers: details.teamMembers ? {
           create: details.teamMembers
        } : undefined
      }
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
  if (!user) throw new Error('Not authenticated')

  try {
    // Ensure the registration belongs to user
    const reg = await prisma.registration.findUnique({ where: { id: registrationId }})
    if (reg?.userId !== user.id) throw new Error('Unauthorized')

    await prisma.registration.delete({
      where: { id: registrationId }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to unregister:', error)
    return { error: 'Failed to cancel registration' }
  }
}

