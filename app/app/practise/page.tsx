"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { BroadcastButton } from "@/components/broadcast-button"
import { MessageControls } from "@/components/message-controls"
import { DebateForm } from "@/components/debate-form"
import { Button } from "@/components/ui/button"
import { tools } from "@/lib/tools"
import { generateDebateSummary, saveDebate, checkDebateCredits, useDebateCredit } from "../actions"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

const DEBATE_CREDIT_LIMIT = 3;

function LoadingSkeleton() {
    return (
        <div className="w-full max-w-xl text-card-foreground border-secondary py-4 md:p-4 space-y-6">
            <Skeleton className="h-8 w-48" /> {/* Title */}
            <Skeleton className="h-20 w-full" /> {/* Alert */}
            <div className="space-y-4"> {/* Form fields */}
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}

export default function PracticePage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [savingStage, setSavingStage] = useState<'idle' | 'analyzing' | 'saving'>('idle')
    const [credits, setCredits] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadCredits = async () => {
        try {
            const count = await checkDebateCredits()
            setCredits(count)
        } catch (error) {
            console.error("Error loading credits:", error)
            toast.error("Failed to load credits")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadCredits()
    }, [])

    const handleStartStopClick = async () => {
        if (isSessionActive === 'connecting') {
            return;
        }
        if (credits === 0) {
            toast.error("No credits remaining!")
            return
        }

        try {
            handleStartStopWebRTC()
            await useDebateCredit()
            setCredits(prev => prev !== null ? prev - 1 : 0)
        } catch (error) {
            console.error("Error using credit:", error)
            toast.error("Failed to use credit")
        }

    }

    const {
        status,
        isSessionActive,
        handleStartStopClick: handleStartStopWebRTC,
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

    if (isLoading) {
        return (
            <main className="h-full flex items-center justify-center bg-background">
                <LoadingSkeleton />
            </main>
        );
    }

    if (credits !== null && credits === 0) {
        return (
            <main className="h-full flex items-center justify-center bg-background">
                <div className="w-full max-w-xl p-8">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Credits Remaining</AlertTitle>
                        <AlertDescription>
                            We are credit poor! You have used all your practice credits.
                            Please try again later or contact support for more credits.
                        </AlertDescription>
                    </Alert>
                    <div className="mt-4 flex justify-center">
                        <Button variant="outline" onClick={() => router.push('/app')}>
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="h-full flex items-center justify-center bg-background">
            <div className="w-full max-w-xl text-card-foreground border-secondary py-4 md:p-4 space-y-4">
                {showForm ? (
                    <>
                        <h2 className="text-2xl font-bold">Debate Practice</h2>
                        {credits !== null && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Credits Available</AlertTitle>
                                <AlertDescription>
                                    You have {credits} practice credits remaining.
                                    A credit will be used when you start the debate.
                                </AlertDescription>
                            </Alert>
                        )}
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