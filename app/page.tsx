"use client"

import React, { useEffect } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { BroadcastButton } from "@/components/broadcast-button"
import { TokenUsageDisplay } from "@/components/token-usage"
import { MessageControls } from "@/components/message-controls"
import { TextInput } from "@/components/text-input"
import { DebateForm } from "@/components/debate-form"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { tools } from "@/lib/tools"

const App: React.FC = () => {
  // Use the WebRTC hook with built-in debate form functionality
  const {
    status,
    isSessionActive,
    handleStartStopClick,
    registerFunction,
    msgs,
    conversation,
    sendTextMessage,
    showForm,
    debateInfo,
    handleDebateFormSubmit,
    timer,
    showSummary,
    resetAndStartNewDebate,
    stopSession
  } = useWebRTCAudioSession(tools);

  // Register tool functions
  useEffect(() => {
    // Register the end_debate function
    registerFunction("end_debate", ({
      reason,
      explanation
    }: {
      reason: string;
      explanation?: string;
    }) => {
      console.log("AI called end_debate:", { reason, explanation });

      // Add a small delay before ending the debate to allow message to be displayed
      setTimeout(() => {
        stopSession();
      }, 2000);

      return { success: true, message: "Debate ended" };
    });

    // Register the time_warning function
    registerFunction("time_warning", ({
      remaining_seconds,
      message
    }: {
      remaining_seconds: number;
      message?: string;
    }) => {
      console.log("AI issued time warning:", { remaining_seconds, message });

      return {
        success: true,
        message: "Time warning issued",
        remaining_seconds
      };
    });
  }, [registerFunction, stopSession]);

  return (
    <main className="h-full flex items-center justify-center">
      {showForm ? (
        <div className="w-full max-w-xl bg-card text-card-foreground rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-center mb-4">Debate Practice</h2>
          <DebateForm onSubmit={handleDebateFormSubmit} />
        </div>
      ) : showSummary ? (
        <div className="w-full max-w-3xl bg-card text-card-foreground rounded-xl border shadow-sm p-6 space-y-4">
          <div className="mb-4">
            {/* Debate Info Section */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Debate Summary</h2>
              <div className="text-right">
                <div className="text-xl font-mono font-bold">{timer}</div>
                <p className="text-xs text-muted-foreground">Total Duration</p>
              </div>
            </div>

            {debateInfo && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <h3 className="font-medium">Topic: {debateInfo.topic}</h3>
                <p className="text-sm">
                  {debateInfo.username}'s stance: {debateInfo.stance}
                </p>
              </div>
            )}

            <div className="mb-4 grid grid-cols-2 gap-4">
              <TokenUsageDisplay messages={msgs} />
            </div>
          </div>

          {/* Transcription Section */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Transcript</h3>
            <div className="max-h-80 overflow-y-auto p-3 border rounded-md">
              {conversation.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <p className="text-sm font-semibold">
                    {msg.role === "user" ? debateInfo?.username || "You" : "AI"}:
                  </p>
                  <p className="pl-2 border-l-2 border-primary">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={resetAndStartNewDebate}
            className="w-full"
          >
            Start New Debate
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-card text-card-foreground rounded-xl border shadow-sm p-6 space-y-4">
          {/* Debate Info & Controls Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-left">
                {debateInfo && (
                  <div>
                    <h3 className="font-medium">Debating: {debateInfo.topic}</h3>
                    <p className="text-sm text-muted-foreground">
                      Your stance: {debateInfo.stance}
                    </p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-mono font-bold">{timer}</div>
                <p className="text-xs text-muted-foreground">Time Elapsed</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 mb-4">
              <BroadcastButton
                isSessionActive={isSessionActive}
                onClick={handleStartStopClick}
              />
            </div>
          </div>

          {/* Transcription Section */}
          {status && (
            <div className="w-full">
              <MessageControls conversation={conversation} msgs={msgs} />
              {/* Text input is hidden as requested */}
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default App;