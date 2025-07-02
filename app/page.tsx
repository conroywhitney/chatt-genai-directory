"use client"

import { useState, useEffect, useRef } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useSupabaseMembers } from "@/hooks/use-supabase-members"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Twitter, Linkedin, User, Briefcase, BrainCircuit, Github } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginView } from "@/components/login-view"
import { ProfileView } from "@/components/profile-view"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DiscordIcon } from "@/components/icons/discord-icon"
import { Member } from "@/lib/supabase"

export default function MemberDirectoryPage() {
  // Use Supabase for members data
  const { members, loading, error, addMember, updateMember, deleteMember } = useSupabaseMembers()
  
  // Keep currentUserId in localStorage for session persistence
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>("chattgenai-currentUser", null)
  const [newMemberId, setNewMemberId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [showInitialAnimation, setShowInitialAnimation] = useState(true)

  const currentUser = members.find((m) => m.id === currentUserId)

  useEffect(() => {
    // Prevent hydration flash by marking component as mounted
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // After members load and animations finish, disable initial animations
    if (members.length > 0 && showInitialAnimation) {
      const totalAnimationTime = members.length * 75 + 500 // 75ms stagger + 400ms animation + buffer
      const timer = setTimeout(() => {
        setShowInitialAnimation(false)
      }, totalAnimationTime)
      return () => clearTimeout(timer)
    }
  }, [members.length, showInitialAnimation])

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
    } catch (err) {
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
    } catch (err) {
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
            {error ? (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Database Connection Error
              </div>
            ) : loading ? (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Connecting to Database...
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Connected to Supabase Database ({members.length} members)
              </div>
            )}
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            {currentUser ? (
              <ProfileView 
                member={currentUser as any} // Type assertion for demo - in production, align types
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
            
            {members.length > 0 && isMounted ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, index) => {
                  let animationClass = ""
                  if (member.id === newMemberId) {
                    // Specific animation for a brand new member
                    animationClass = "new-member-card"
                  } else if (showInitialAnimation) {
                    // Staggered animation for the initial page load only
                    animationClass = "animate-card-enter"
                  }

                  return (
                    <div key={member.id} className="group">
                      <Card
                        className={`flex flex-col h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg dark:group-hover:shadow-black/25 ${animationClass}`}
                        style={{
                          // Only apply stagger delay for the initial load animation
                          animationDelay: animationClass === "animate-card-enter" ? `${index * 75}ms` : undefined,
                          animationFillMode: animationClass ? "backwards" : undefined,
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-xl">{member.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                          {member.discord && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <DiscordIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{member.discord}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{member.role}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <BrainCircuit className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{member.interest}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex space-x-3">
                            {member.github && (
                              <a
                                href={`https://github.com/${member.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`GitHub: ${member.github}`}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <Github className="w-5 h-5" />
                                <span className="sr-only">GitHub</span>
                              </a>
                            )}
                            {member.twitter && (
                              <a
                                href={`https://twitter.com/${member.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                              >
                                <Twitter className="w-5 h-5" />
                                <span className="sr-only">Twitter</span>
                              </a>
                            )}
                            {member.linkedin && (
                              <a
                                href={`https://linkedin.com/in/${member.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500"
                              >
                                <Linkedin className="w-5 h-5" />
                                <span className="sr-only">LinkedIn</span>
                              </a>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  )
                })}
              </div>
            ) : !isMounted || loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Loading skeleton cards */}
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="flex flex-col h-full animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-3">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No members yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Be the first to join the directory!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
