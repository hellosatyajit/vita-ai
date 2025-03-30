"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { debateTopics } from "@/lib/debate-topics"
import { Shuffle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DebateFormProps {
  onSubmit: (values: {
    username: string
    topic: string
    stance: "FOR" | "AGAINST"
  }) => void
}

export function DebateForm({ onSubmit }: DebateFormProps) {
  const [username, setUsername] = React.useState("Satyajit")
  const [topic, setTopic] = React.useState("Schools should prioritize practical skills over theoretical knowledge.")
  const [stance, setStance] = React.useState<"FOR" | "AGAINST">("FOR")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ username, topic, stance })
  }
  
  const selectRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * debateTopics.length)
    setTopic(debateTopics[randomIndex])
  }
  
  const randomizeDebate = () => {
    // Select random topic
    const randomIndex = Math.floor(Math.random() * debateTopics.length)
    setTopic(debateTopics[randomIndex])
    
    // Select random stance
    const randomStance = Math.random() > 0.5 ? "FOR" : "AGAINST"
    setStance(randomStance)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className="block">Your Name</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="topic">Debate Topic</Label>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={selectRandomTopic}
                  className="flex items-center gap-1"
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
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Your Stance</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={randomizeDebate}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Shuffle className="h-3 w-3" />
            Randomize Everything
          </Button>
        </div>
        <RadioGroup
          value={stance}
          onValueChange={(value) => setStance(value as "FOR" | "AGAINST")}
          className="flex space-x-8 my-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FOR" id="for" className="border-primary" />
            <Label htmlFor="for" className="font-medium">For</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="AGAINST" id="against" className="border-primary" />
            <Label htmlFor="against" className="font-medium">Against</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full py-6 text-lg">Start Debate</Button>
    </form>
  )
} 