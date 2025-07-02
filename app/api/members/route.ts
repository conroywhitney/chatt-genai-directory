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
    
    if (!body.name || !body.role || !body.interest) {
      return NextResponse.json(
        { error: 'Name, role, and interest are required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .insert([body])
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
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required for updates' },
        { status: 400 }
      )
    }
    
    const updateData: Partial<Member> = {}
    if (body.name) updateData.name = body.name
    if (body.role) updateData.role = body.role
    if (body.interest) updateData.interest = body.interest
    if (body.twitter !== undefined) updateData.twitter = body.twitter
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin
    if (body.discord !== undefined) updateData.discord = body.discord
    if (body.github !== undefined) updateData.github = body.github
    
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
