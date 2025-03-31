"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { debateTopics } from "@/lib/debate-topics"
import { Shuffle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@/contexts/user-context"

interface DebateFormProps {
  onSubmit: (values: {
    username: string
    topic: string
    stance: "FOR" | "AGAINST"
  }) => void
}

export function DebateForm({ onSubmit }: DebateFormProps) {
  const { userProfile, loading } = useUser()
  const [username, setUsername] = React.useState(userProfile?.name || "")
  const [topic, setTopic] = React.useState("")
  const [stance, setStance] = React.useState<"FOR" | "AGAINST">("FOR")

  React.useEffect(() => {
    if (userProfile?.name) {
      setUsername(userProfile.name)
    }
  }, [userProfile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ username, topic, stance })
  }
  
  const selectRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * debateTopics.length)
    setTopic(debateTopics[randomIndex])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* <div className="space-y-2">
        <Label htmlFor="username" className="text-foreground">Your Name</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          required
          className="border-secondary focus:border-primary"
          disabled={loading}
        />
      </div> */}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="topic" className="text-foreground">Topic</Label>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={selectRandomTopic}
                  className="flex items-center gap-1 border-secondary hover:bg-secondary/20"
                >
                  <Shuffle className="h-3 w-3" />
                  Random Topic
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose from {debateTopics.length} debate topics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value)
          }}
          placeholder="Enter debate topic"
          required
          className="border-secondary focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-foreground">Your Stance</Label>
        </div>
        <RadioGroup
          value={stance}
          onValueChange={(value) => setStance(value as "FOR" | "AGAINST")}
          className="flex gap-4 my-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FOR" id="for" className="border-secondary text-primary" />
            <Label htmlFor="for" className="font-medium">For</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="AGAINST" id="against" className="border-secondary text-primary" />
            <Label htmlFor="against" className="font-medium">Against</Label>
          </div>
        </RadioGroup>
      </div>

      <Button 
        type="submit" 
        className="w-full py-6 text-lg bg-[#333] hover:bg-[#222] text-white rounded-md"
        disabled={loading}
      >
        Start Debate
      </Button>
    </form>
  )
} 