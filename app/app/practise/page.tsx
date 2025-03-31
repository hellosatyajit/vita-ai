"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { BroadcastButton } from "@/components/broadcast-button"
import { MessageControls } from "@/components/message-controls"
import { DebateForm } from "@/components/debate-form"
import { Button } from "@/components/ui/button"
import { tools } from "@/lib/tools"
import { generateDebateSummary, saveDebate } from "../actions"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function PracticePage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [savingStage, setSavingStage] = useState<'idle' | 'analyzing' | 'saving'>('idle')

    const {
        status,
        isSessionActive,
        handleStartStopClick,
        registerFunction,
        msgs,
        conversation,
        showForm,
        debateInfo,
        handleDebateFormSubmit,
        timer,
        showSummary,
        resetAndStartNewDebate,
        stopSession
    } = useWebRTCAudioSession(tools);

    const getTimerSeconds = () => {
        if (!timer) return 0;
        const [minutes, seconds] = timer.split(':').map(Number);
        return (minutes * 60) + seconds;
    };

    const handleSaveDebate = async () => {
        if (!debateInfo || isSaving) return;
        const analsisToastId = toast.loading("Analyzing your debate performance...");
        try {
            setIsSaving(true);
            setSavingStage('analyzing');

            const { input_tokens, output_tokens } = msgs
                .filter((msg) => msg.type === 'response.done')
                .slice(-1)[0].response?.usage;

            const debateId = await saveDebate({
                topic: debateInfo.topic,
                stance: debateInfo.stance,
                duration: getTimerSeconds(),
                inputTokens: input_tokens ?? 0,
                outputTokens: output_tokens ?? 0,
                transcript: conversation
            });

            toast.dismiss(analsisToastId);
            const savingToastId = toast.loading("Saving debate and analysis...");
            await generateDebateSummary(debateId);
            toast.dismiss(savingToastId);
            setSavingStage('saving');

            toast.success("Debate saved with detailed analysis");
            router.push(`/app/debate/${debateId}`);
        } catch (error) {
            console.error("Error saving debate:", error);
            toast.error("Failed to save debate");
            setIsSaving(false);
        } finally {
            setSavingStage('idle');
        }
    };

    useEffect(() => {
        registerFunction("end_debate", ({
            reason,
            explanation
        }: {
            reason: string;
            explanation?: string;
        }) => {
            setTimeout(() => {
                stopSession();
            }, 2000);

            return { success: true, message: "Debate ended" };
        });

        registerFunction("time_warning", ({
            remaining_seconds,
            message
        }: {
            remaining_seconds: number;
            message?: string;
        }) => {
            return {
                success: true,
                message: "Time warning issued",
                remaining_seconds
            };
        });
    }, [registerFunction, stopSession, debateInfo, handleSaveDebate]);

    return (
        <main className="h-full flex items-center justify-center bg-background">
            <div className="w-full max-w-xl text-card-foreground border-secondary p-8 space-y-4">
                {showForm ? (
                    <>
                        <h2 className="text-2xl font-bold">Debate Practice</h2>
                        <DebateForm onSubmit={handleDebateFormSubmit} />
                    </>
                ) : showSummary ? (
                    <>
                        <div className="space-y-4">
                            {/* Debate Info Section */}
                            <div className="flex justify-between items-center]">
                                <h2 className="text-2xl font-bold">Debate Summary</h2>
                                <div className="text-right w-max">
                                    <div className="text-xl font-mono font-bold">{timer}</div>
                                    <p className="text-xs text-muted-foreground">Total Duration</p>
                                </div>
                            </div>

                            {debateInfo && (
                                <div className="p-4 bg-secondary/30 rounded-md">
                                    <h3 className="font-medium mb-1">Topic: {debateInfo.topic}</h3>
                                    <p className="text-sm">
                                        {debateInfo.username}'s stance: {debateInfo.stance}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Transcription Section */}
                        <div>
                            <h3 className="font-medium mb-3 text-lg">Transcript</h3>
                            <div className="max-h-80 overflow-y-auto p-4 border border-secondary/50 rounded-md">
                                {conversation.map((msg) => (
                                    <div key={msg.id} className="mb-3">
                                        <p className="text-sm font-semibold">
                                            {msg.role === "user" ? debateInfo?.username || "You" : "AI"}:
                                        </p>
                                        <p className="pl-3 border-l-2 border-primary/30">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                onClick={resetAndStartNewDebate}
                                variant="outline"
                                className="flex-1 border-secondary hover:bg-secondary/20"
                            >
                                Start New Debate
                            </Button>
                            <Button
                                onClick={handleSaveDebate}
                                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {savingStage === 'analyzing' ? 'Analyzing...' : 'Saving...'}
                                    </>
                                ) : (
                                    "Save to History"
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Debate Info & Controls Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center gap-5">
                                <div className="text-left">
                                    {debateInfo && (
                                        <div>
                                            <h3 className="text-xl font-medium">Debating: {debateInfo.topic}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Your stance: {debateInfo.stance}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right w-max">
                                    <div className="text-xl font-mono font-bold">{timer}</div>
                                    <p className="text-xs text-muted-foreground">Time Elapsed</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <BroadcastButton
                                    isSessionActive={isSessionActive}
                                    onClick={handleStartStopClick}
                                />
                            </div>
                        </div>

                        {status && (
                            <div className="w-full">
                                <MessageControls conversation={conversation} msgs={msgs} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
} 