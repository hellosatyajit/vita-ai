"use client"

import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BroadcastButton({
  isSessionActive,
  onClick,
}: {
  isSessionActive: boolean
  onClick: () => void
}) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`flex items-center gap-2 transition-all duration-200 px-6 py-4 h-auto ${
        isSessionActive 
          ? "bg-red-500 hover:bg-red-600" 
          : "bg-primary hover:bg-primary/90"
      }`}
    >
      {isSessionActive ? (
        <>
          <MicOff className="h-5 w-5" />
          <span>Stop Debate</span>
        </>
      ) : (
        <>
          <Mic className="h-5 w-5" />
          <span>Start Debate</span>
        </>
      )}
    </Button>
  )
} 