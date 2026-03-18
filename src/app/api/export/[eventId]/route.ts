import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import * as xlsx from 'xlsx'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  
  // Verify Admin
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        include: {
          user: true,
          teamMembers: true
        },
        orderBy: { registeredAt: 'desc' }
      }
    }
  })

  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Flatten Data
  const rowData: any[] = []

  for (const reg of event.registrations) {
    const isTeam = event.isTeamEvent && reg.teamName
    
    // Add Captain / Solo Registration
    rowData.push({
      'Reg ID': reg.id,
      'Registration Type': isTeam ? 'Team' : 'Individual',
      'Team Name': isTeam ? reg.teamName : 'N/A',
      'Participant Name': reg.user.name,
      'Role': isTeam ? 'Captain' : 'Solo',
      'Phone Number': reg.phoneNumber || 'N/A',
      'Participant Phone': reg.user.phoneNumber,
      'Registered At': new Date(reg.registeredAt).toLocaleString()
    })

    // Add Team Members if any
    if (isTeam && reg.teamMembers.length > 0) {
      for (const member of reg.teamMembers) {
        rowData.push({
          'Reg ID': reg.id,
          'Registration Type': 'Team',
          'Team Name': reg.teamName,
          'Participant Name': member.name,
          'Role': 'Member',
          'Phone Number': reg.phoneNumber || 'N/A', // fallback to captain
          'Registered At': new Date(reg.registeredAt).toLocaleString()
        })
      }
    }
  }

  // Create Excel Book
  const worksheet = xlsx.utils.json_to_sheet(rowData)
  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Participants')

  // Generate Base64 to safely convert to a Buffer for Next.js Response
  const base64 = xlsx.write(workbook, { type: 'base64', bookType: 'xlsx' })
  const buffer = Buffer.from(base64, 'base64')

  // Clean filename to prevent browser stripping extensions
  const cleanName = event.eventName.replace(/[^a-zA-Z0-9_]/g, '_')

  // Return as downloadable file
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename="${cleanName}_Participants.xlsx"`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  })
}
