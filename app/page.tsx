"use client"

import { useState, useRef, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Twitter, Linkedin, User, Briefcase, BrainCircuit, MessageSquare } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginView } from "@/components/login-view"
import { ProfileView } from "@/components/profile-view"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Member {
  id: string
  name: string
  role: string
  interest: string
  twitter?: string
  linkedin?: string
  discord?: string
}

export default function MemberDirectoryPage() {
  const [members, setMembers] = useLocalStorage<Member[]>("chattgenai-members", [])
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>("chattgenai-currentUser", null)
  const [newMemberId, setNewMemberId] = useState<string | null>(null)

  const currentUser = members.find((m) => m.id === currentUserId)

  const isInitialRender = useRef(true)

  useEffect(() => {
    // After the first render, set this to false.
    // A short delay ensures the effect runs after the initial render completes.
    const timer = setTimeout(() => {
      isInitialRender.current = false
    }, 1)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    const newId = Date.now().toString()
    const newMember: Member = {
      id: newId,
      name: "New Member",
      role: "AI Enthusiast",
      interest: "Exploring GenAI",
    }
    setMembers([...members, newMember])
    setCurrentUserId(newId)
    setNewMemberId(newId)
    setTimeout(() => setNewMemberId(null), 1000)
    toast({
      title: "Welcome!",
      description: "Please complete your profile.",
    })
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const handleUpdateProfile = (updatedMember: Member) => {
    setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)))
    toast({
      title: "Profile Updated",
      description: "Your information has been saved.",
    })
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
        </header>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            {currentUser ? (
              <ProfileView member={currentUser} onUpdate={handleUpdateProfile} onLogout={handleLogout} />
            ) : (
              <LoginView onLogin={handleLogin} />
            )}
          </div>

          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Members</h2>
            {members.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, index) => {
                  let animationClass = ""
                  if (member.id === newMemberId) {
                    animationClass = "new-member-card"
                  } else if (isInitialRender.current) {
                    animationClass = "animate-card-enter"
                  }

                  return (
                    <div key={member.id} className="group">
                      <Card
                        className={`flex flex-col h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg dark:group-hover:shadow-black/25 ${animationClass}`}
                        style={{
                          animationDelay: animationClass === "animate-card-enter" ? `${index * 75}ms` : undefined,
                          animationFillMode: animationClass ? "backwards" : undefined,
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-xl">{member.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
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
                            {member.discord && (
                              <a
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                title={`Discord: ${member.discord}`}
                                className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                              >
                                <MessageSquare className="w-5 h-5" />
                                <span className="sr-only">Discord</span>
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
