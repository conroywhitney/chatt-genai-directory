import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Twitter, Linkedin, Briefcase, BrainCircuit, Github } from "lucide-react"
import { DiscordIcon } from "@/components/icons/discord-icon"
import { Member } from "@/lib/supabase"

interface MemberCardProps {
  member: Member
  index: number
  animationClass?: string
  onAnimationEnd?: () => void
}

export function MemberCard({ member, index, animationClass = "", onAnimationEnd }: MemberCardProps) {
  return (
    <div className="group">
      <Card
        className={`flex flex-col h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg dark:group-hover:shadow-black/25 ${animationClass}`}
        style={{
          // Only apply stagger delay for the initial load animation
          animationDelay: animationClass === "animate-card-enter" ? `${index * 75}ms` : undefined,
          animationFillMode: animationClass ? "backwards" : undefined,
        }}
        onAnimationEnd={onAnimationEnd}
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
}
