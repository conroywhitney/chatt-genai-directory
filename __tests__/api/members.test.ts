/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

// Create the mock inline to avoid hoisting issues
jest.mock('@/lib/supabase', () => {
  const mockChain = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    order: jest.fn(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  }
  
  return {
    supabase: mockChain,
    MEMBERS_TABLE: 'members',
  }
})

// Import after mocking
import { GET, POST, PUT, DELETE } from '@/app/api/members/route'
import { supabase } from '@/lib/supabase'

// Type the mock properly
const mockSupabase = supabase as any

const mockMember = {
  id: '1',
  name: 'John Doe',
  role: 'Software Engineer',
  interest: 'Machine Learning',
  twitter: 'johndoe',
  linkedin: 'johndoe',
  discord: 'johndoe#1234',
  github: 'johndoe',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

describe('/api/members', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('successfully fetches members', async () => {
      mockSupabase.order.mockResolvedValue({
        data: [mockMember],
        error: null,
      })

      const request = new NextRequest('http://localhost/api/members')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.data).toEqual([mockMember])
      expect(mockSupabase.from).toHaveBeenCalledWith('members')
      expect(mockSupabase.select).toHaveBeenCalledWith('*')
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false })
    })

    it('handles Supabase errors', async () => {
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const request = new NextRequest('http://localhost/api/members')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe('Failed to fetch members')
    })

    it('handles unexpected errors', async () => {
      mockSupabase.order.mockRejectedValue(new Error('Network error'))

      const request = new NextRequest('http://localhost/api/members')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe('Internal server error')
    })
  })

  describe('POST', () => {
    it('successfully creates a new member', async () => {
      const newMember = {
        name: 'Jane Smith',
        role: 'Data Scientist',
        interest: 'Deep Learning',
      }

      mockSupabase.single.mockResolvedValue({
        data: { ...newMember, id: '2', created_at: '2024-01-01T00:00:00Z' },
        error: null,
      })

      const request = new NextRequest('http://localhost/api/members', {
        method: 'POST',
        body: JSON.stringify(newMember),
      })
      
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.data.name).toBe(newMember.name)
      expect(mockSupabase.insert).toHaveBeenCalledWith([newMember])
    })

    it('validates required fields', async () => {
      const invalidMember = {
        name: 'Jane Smith',
        // Missing role and interest
      }

      const request = new NextRequest('http://localhost/api/members', {
        method: 'POST',
        body: JSON.stringify(invalidMember),
      })
      
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.error).toBe('Name, role, and interest are required')
    })

    it('handles Supabase creation errors', async () => {
      const newMember = {
        name: 'Jane Smith',
        role: 'Data Scientist',
        interest: 'Deep Learning',
      }

      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Constraint violation' },
      })

      const request = new NextRequest('http://localhost/api/members', {
        method: 'POST',
        body: JSON.stringify(newMember),
      })
      
      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe('Failed to save member')
    })
  })

  describe('PUT', () => {
    it('successfully updates a member', async () => {
      const updateData = {
        id: '1',
        name: 'John Updated',
        role: 'Senior Software Engineer',
        interest: 'AI/ML',
      }

      mockSupabase.single.mockResolvedValue({
        data: { ...mockMember, ...updateData },
        error: null,
      })

      const request = new NextRequest('http://localhost/api/members', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      
      const response = await PUT(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.data.name).toBe('John Updated')
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
    })

    it('validates ID is required', async () => {
      const updateData = {
        name: 'John Updated',
        // Missing ID
      }

      const request = new NextRequest('http://localhost/api/members', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      
      const response = await PUT(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.error).toBe('ID is required for updates')
    })
  })

  describe('DELETE', () => {
    it('successfully deletes a member', async () => {
      mockSupabase.eq.mockResolvedValue({
        error: null,
      })

      const request = new NextRequest('http://localhost/api/members?id=1', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
    })

    it('validates ID is required', async () => {
      const request = new NextRequest('http://localhost/api/members', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.error).toBe('ID is required for deletion')
    })

    it('handles deletion errors', async () => {
      mockSupabase.eq.mockResolvedValue({
        error: { message: 'Member not found' },
      })

      const request = new NextRequest('http://localhost/api/members?id=999', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe('Failed to delete member')
    })
  })
})
