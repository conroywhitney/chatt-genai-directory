/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSupabaseMembers } from '@/hooks/use-supabase-members'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

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

describe('useSupabaseMembers hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('fetchMembers (initial load)', () => {
    it('successfully fetches members on mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [mockMember] }),
      })

      const { result } = renderHook(() => useSupabaseMembers())

      expect(result.current.loading).toBe(true)
      expect(result.current.members).toEqual([])
      expect(result.current.error).toBe(null)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.members).toEqual([mockMember])
      expect(result.current.error).toBe(null)
      expect(mockFetch).toHaveBeenCalledWith('/api/members')
    })

    it('handles fetch errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Database error' }),
      })

      const { result } = renderHook(() => useSupabaseMembers())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.members).toEqual([])
      expect(result.current.error).toBe('Database error')
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSupabaseMembers())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.members).toEqual([])
      expect(result.current.error).toBe('Network error')
    })
  })

  describe('addMember', () => {
    it('successfully adds a new member', async () => {
      const newMember = {
        name: 'Jane Smith',
        role: 'Data Scientist',
        interest: 'Deep Learning',
      }

      const createdMember = {
        ...newMember,
        id: '2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      // Mock initial fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [mockMember] }),
      })

      // Mock add member
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: createdMember }),
      })

      const { result } = renderHook(() => useSupabaseMembers())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      let addedMember
      await act(async () => {
        addedMember = await result.current.addMember(newMember)
      })

      expect(addedMember).toEqual(createdMember)
      expect(result.current.members).toHaveLength(2)
      expect(result.current.members[0]).toEqual(createdMember) // New member should be first
      expect(result.current.error).toBe(null)

      expect(mockFetch).toHaveBeenLastCalledWith('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      })
    })

    it('handles add member errors', async () => {
      // Mock initial fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [mockMember] }),
      })

      // Mock add member error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Validation error' }),
      })

      const { result } = renderHook(() => useSupabaseMembers())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        try {
          await result.current.addMember({
            name: 'Invalid',
            role: '',
            interest: '',
          })
        } catch (error) {
          expect((error as Error).message).toBe('Validation error')
        }
      })

      expect(result.current.error).toBe('Validation error')
      expect(result.current.members).toHaveLength(1) // Should remain unchanged
    })
  })

  describe('updateMember', () => {
    it('successfully updates a member', async () => {
      const updatedMember = {
        ...mockMember,
        name: 'John Updated',
        role: 'Senior Software Engineer',
      }

      // Mock initial fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [mockMember] }),
      })

      // Mock update member
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: updatedMember }),
      })

      const { result } = renderHook(() => useSupabaseMembers())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.updateMember('1', {
          name: 'John Updated',
          role: 'Senior Software Engineer',
        })
      })

      expect(result.current.members[0]).toEqual(updatedMember)
      expect(result.current.error).toBe(null)

      expect(mockFetch).toHaveBeenLastCalledWith('/api/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '1',
          name: 'John Updated',
          role: 'Senior Software Engineer',
        }),
      })
    })
  })

  describe('deleteMember', () => {
    it('successfully deletes a member', async () => {
      // Mock initial fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [mockMember] }),
      })

      // Mock delete member
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const { result } = renderHook(() => useSupabaseMembers())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.members).toHaveLength(1)

      await act(async () => {
        await result.current.deleteMember('1')
      })

      expect(result.current.members).toHaveLength(0)
      expect(result.current.error).toBe(null)

      expect(mockFetch).toHaveBeenLastCalledWith('/api/members?id=1', {
        method: 'DELETE',
      })
    })
  })

  describe('refreshMembers', () => {
    it('successfully refreshes the members list', async () => {
      const updatedMembers = [
        mockMember,
        {
          ...mockMember,
          id: '2',
          name: 'Jane Smith',
        }
      ]

      // Mock initial fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [mockMember] }),
      })

      // Mock refresh fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: updatedMembers }),
      })

      const { result } = renderHook(() => useSupabaseMembers())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.members).toHaveLength(1)

      await act(async () => {
        await result.current.refreshMembers()
      })

      expect(result.current.members).toHaveLength(2)
      expect(result.current.error).toBe(null)
    })
  })
})
