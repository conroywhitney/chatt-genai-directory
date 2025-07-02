import { useState, useEffect } from 'react'
import { Member } from '@/lib/supabase'

interface UseSupabaseMembersResult {
  members: Member[]
  loading: boolean
  error: string | null
  addMember: (member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => Promise<Member>
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  refreshMembers: () => Promise<void>
}

export function useSupabaseMembers(): UseSupabaseMembersResult {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/members')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch members')
      }
      
      setMembers(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching members:', err)
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (member: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<Member> => {
    try {
      setError(null)
      
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add member')
      }
      
      // Add the new member to the beginning of the array
      setMembers(prev => [result.data, ...prev])
      return result.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error adding member:', err)
      throw err
    }
  }

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      setError(null)
      
      const response = await fetch('/api/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update member')
      }
      
      // Update the member in the array
      setMembers(prev => prev.map(member => 
        member.id === id ? result.data : member
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error updating member:', err)
      throw err
    }
  }

  const deleteMember = async (id: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/members?id=${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete member')
      }
      
      // Remove the member from the array
      setMembers(prev => prev.filter(member => member.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error deleting member:', err)
      throw err
    }
  }

  const refreshMembers = async () => {
    await fetchMembers()
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    deleteMember,
    refreshMembers,
  }
}
