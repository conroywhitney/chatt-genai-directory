/**
 * @jest-environment node
 */

// Set environment variables before import
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  })),
}))

describe('Supabase Configuration', () => {
  it('exports the correct table name', async () => {
    const { MEMBERS_TABLE } = await import('@/lib/supabase')
    expect(MEMBERS_TABLE).toBe('members')
  })

  it('creates a working client', async () => {
    const { supabase } = await import('@/lib/supabase')
    expect(supabase).toBeDefined()
    expect(typeof supabase.from).toBe('function')
  })

  it('can chain Supabase operations', async () => {
    const { supabase, MEMBERS_TABLE } = await import('@/lib/supabase')
    const query = supabase.from(MEMBERS_TABLE).select('*')
    expect(query).toBeDefined()
  })
})
