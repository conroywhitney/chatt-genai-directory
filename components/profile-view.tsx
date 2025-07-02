"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Member {
  id: string
  name: string
  role: string
  interest: string
  twitter?: string
  linkedin?: string
  discord?: string
  github?: string
}

interface ProfileViewProps {
  member: Member
  onUpdate: (updatedMember: Member) => void
  onLogout: () => void
}

export function ProfileView({ member, onUpdate, onLogout }: ProfileViewProps) {
  const [name, setName] = useState(member.name)
  const [role, setRole] = useState(member.role)
  const [interest, setInterest] = useState(member.interest)
  const [twitter, setTwitter] = useState(member.twitter || "")
  const [linkedin, setLinkedin] = useState(member.linkedin || "")
  const [discord, setDiscord] = useState(member.discord || "")
  const [github, setGithub] = useState(member.github || "")

  useEffect(() => {
    setName(member.name)
    setRole(member.role)
    setInterest(member.interest)
    setTwitter(member.twitter || "")
    setLinkedin(member.linkedin || "")
    setDiscord(member.discord || "")
    setGithub(member.github || "")
  }, [member])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onUpdate({
      ...member,
      name,
      role,
      interest,
      twitter: twitter || undefined,
      linkedin: linkedin || undefined,
      discord: discord || undefined,
      github: github || undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role / Title</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest">Area of AI Interest</Label>
            <Input id="interest" value={interest} onChange={(e) => setInterest(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discord">Discord Handle (Optional)</Label>
            <Input
              id="discord"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="e.g. ada_lovelace#1234"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter Username (Optional)</Label>
            <Input
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="e.g. ada_lovelace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Username (Optional)</Label>
            <Input
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="e.g. adalovelace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub Username (Optional)</Label>
            <Input
              id="github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="e.g. adalovelace"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-grow">
              Update Profile
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
