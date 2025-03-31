"use client"

import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BroadcastButton({
    isSessionActive,
    onClick,
}: {
    isSessionActive: 'active' | 'inactive' | 'connecting'
    onClick: () => void
}) {
    return (
        <Button
            onClick={onClick}
            size="lg"
            className={`flex items-center gap-2 transition-all duration-300 px-4 py-2 h-auto rounded-md shadow-sm 
                                    text-base ${isSessionActive === 'active'
                    ? "bg-destructive hover:bg-destructive/90 text-white"
                    : "bg-[#333] hover:bg-[#222] text-white"
                }`}
            disabled={isSessionActive !== 'active'}
        >
            {isSessionActive === 'active' ? (
                <>
                    <MicOff className="h-5 w-5" />
                    <span>Stop Debate</span>
                </>
            ) : (
                <>
                    <Mic className="h-5 w-5" />
                    <span>Starting Debate...</span>
                </>
            )}
        </Button>
    )
} 