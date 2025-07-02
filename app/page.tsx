"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useSupabaseMembers } from "@/hooks/use-supabase-members"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginView } from "@/components/login-view"
import { ProfileView } from "@/components/profile-view"
import { DatabaseStatus } from "@/components/database-status"
import { MemberGrid } from "@/components/member-grid"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Member } from "@/lib/supabase"

export default function MemberDirectoryPage() {
  // Use Supabase for members data
  const { members, loading, error, addMember, updateMember } = useSupabaseMembers()
  
  // Keep currentUserId in localStorage for session persistence
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>("chattgenai-currentUser", null)
  const [newMemberId, setNewMemberId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const currentUser = members.find((m) => m.id === currentUserId)

  useEffect(() => {
    // Prevent hydration flash by marking component as mounted
    setIsMounted(true)
  }, [])

  const handleLogin = async () => {
    try {
      const newMember = await addMember({
        name: "New Member",
        role: "AI Enthusiast",
        interest: "Exploring GenAI",
      })
      
      setCurrentUserId(newMember.id!)
      setNewMemberId(newMember.id!)
      setTimeout(() => setNewMemberId(null), 1000)
      
      toast({
        title: "Welcome!",
        description: "Please complete your profile.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const handleUpdateProfile = async (updatedMember: Member) => {
    try {
      if (!updatedMember.id) {
        throw new Error("Member ID is required for updates")
      }
      
      await updateMember(updatedMember.id, updatedMember)
      
      toast({
        title: "Profile Updated",
        description: "Your information has been saved.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster />
      <main className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="absolute top-8 right-4 md:top-12 md:right-8">
          <ThemeToggle />
        </div>
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            Chatt<span className="text-blue-600">GenAI</span> Working Group
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The official member directory. Connect with fellow AI enthusiasts and professionals.
          </p>
          
          {/* Database Status Indicator for Demo */}
          <div className="mt-4 flex justify-center">
            <DatabaseStatus 
              loading={loading} 
              error={error} 
              memberCount={members.length} 
            />
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            {currentUser ? (
              <ProfileView 
                member={currentUser as Required<Member>} 
                onUpdate={handleUpdateProfile} 
                onLogout={handleLogout} 
              />
            ) : (
              <LoginView onLogin={handleLogin} />
            )}
          </div>

          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Members {loading && (
                <span className="inline-flex items-center text-sm text-gray-500 ml-2">
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                  Loading...
                </span>
              )}
            </h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  Error loading members: {error}
                </p>
              </div>
            )}
            
            <MemberGrid 
              members={members}
              loading={loading}
              isMounted={isMounted}
              newMemberId={newMemberId}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
