import { NextRequest, NextResponse } from 'next/server'
import { supabase, Member, MEMBERS_TABLE } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Member, 'id' | 'created_at' | 'updated_at'> = await request.json()
    
    // Strict validation
    if (
      !body.name || typeof body.name !== 'string' || body.name.trim().length < 2 ||
      !body.role || typeof body.role !== 'string' || body.role.trim().length < 1 ||
      !body.interest || typeof body.interest !== 'string' || body.interest.trim().length < 1
    ) {
      return NextResponse.json(
        { error: 'Name, role, and interest are required' },
        { status: 400 }
      )
    }

    // Trim whitespace from inputs
    const cleanedBody = {
      ...body,
      name: body.name.trim(),
      role: body.role.trim(),
      interest: body.interest.trim(),
      twitter: body.twitter?.trim() || undefined,
      linkedin: body.linkedin?.trim() || undefined,
      discord: body.discord?.trim() || undefined,
      github: body.github?.trim() || undefined,
    }
    
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .insert([cleanedBody])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save member' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Member & { id: string } = await request.json()
    
    if (!body.id || typeof body.id !== 'string') {
      return NextResponse.json(
        { error: 'ID is required for updates' },
        { status: 400 }
      )
    }

    // Validate required fields if they're being updated
    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length < 2)) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      )
    }
    if (body.role !== undefined && (typeof body.role !== 'string' || body.role.trim().length < 1)) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }
    if (body.interest !== undefined && (typeof body.interest !== 'string' || body.interest.trim().length < 1)) {
      return NextResponse.json(
        { error: 'Interest is required' },
        { status: 400 }
      )
    }
    
    const updateData: Partial<Member> = {}
    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.role !== undefined) updateData.role = body.role.trim()
    if (body.interest !== undefined) updateData.interest = body.interest.trim()
    if (body.twitter !== undefined) updateData.twitter = body.twitter?.trim() || undefined
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin?.trim() || undefined
    if (body.discord !== undefined) updateData.discord = body.discord?.trim() || undefined
    if (body.github !== undefined) updateData.github = body.github?.trim() || undefined

    // Check if member exists first
    const { data: existingMember, error: findError } = await supabase
      .from(MEMBERS_TABLE)
      .select('id')
      .eq('id', body.id)
      .single()

    if (findError || !existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }
    
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update member' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for deletion' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from(MEMBERS_TABLE)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete member' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
