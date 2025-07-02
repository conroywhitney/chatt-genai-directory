"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from "lucide-react"

interface LoginViewProps {
  onLogin: (provider: "github" | "linkedin" | "twitter") => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  return (
    <div className="relative">
      {/* The faint "wake" behind the glow */}
      <div
        className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-25 blur-lg"
        style={{ animation: `chase 8s linear infinite` }}
      />
      {/* The bright "chasing" glow */}
      <div
        className="absolute -inset-0.5 rounded-lg"
        style={{
          background: `conic-gradient(from var(--chasing-angle), transparent 75%, #ec4899, #a855f7)`,
          animation: `chase 4s linear infinite`,
        }}
      />

      <Card className="relative">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join the Directory</CardTitle>
          <CardDescription>Connect with your favorite social account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full bg-[#333] text-white hover:bg-[#444] dark:bg-gray-200 dark:text-black dark:hover:bg-white"
            onClick={() => onLogin("github")}
          >
            <Github className="mr-2 h-4 w-4" /> Continue with GitHub
          </Button>
          <Button className="w-full bg-[#0A66C2] text-white hover:bg-[#004182]" onClick={() => onLogin("linkedin")}>
            <Linkedin className="mr-2 h-4 w-4" /> Continue with LinkedIn
          </Button>
          <Button
            className="w-full bg-black text-white hover:bg-[#111] dark:bg-white dark:text-black dark:hover:bg-gray-200"
            onClick={() => onLogin("twitter")}
          >
            <Twitter className="mr-2 h-4 w-4" /> Continue with X
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
