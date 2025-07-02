import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { User } from "lucide-react"
import { MemberCard } from "./member-card"
import { Member } from "@/lib/supabase"

interface MemberGridProps {
  members: Member[]
  loading: boolean
  isMounted: boolean
  newMemberId: string | null
}

export function MemberGrid({ members, loading, isMounted, newMemberId }: MemberGridProps) {
  const [showInitialAnimation, setShowInitialAnimation] = useState(true)

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

  // Loading skeleton
  if (!isMounted || loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    )
  }

  // Empty state
  if (members.length === 0) {
    return (
      <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No members yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Be the first to join the directory!</p>
      </div>
    )
  }

  // Member cards with animations
  return (
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
          <MemberCard
            key={member.id}
            member={member}
            index={index}
            animationClass={animationClass}
          />
        )
      })}
    </div>
  )
}
