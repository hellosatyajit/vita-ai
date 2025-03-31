import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { getDebateById } from "@/lib/db/queries"
import { format } from "date-fns"
import { deleteDebate } from "@/app/app/actions"
import { SummaryGenerator } from "@/components/summary-generator"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DebatePageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function DebatePage({ params }: DebatePageProps) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const debate = await getDebateById(slug)

    if (!debate) {
        return <>
            <div className="py-10 m-auto max-w-xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Debate not found</h1>
                    <p className="text-muted-foreground">The debate you are looking for does not exist.</p>
                </div>
                <div className="mt-4 flex justify-center gap-2">
                    <Button asChild>
                        <Link href="/app">
                            Go to home
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/app/practise">
                            Practice
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    }

    const transcript = debate.transcript as Array<{ role: string; text: string; id: string }>

    return (
        <main className="container max-w-5xl py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold mb-2">{debate.topic}</h2>
                    <p className="text-muted-foreground">
                        {debate.createdAt && format(new Date(debate.createdAt), 'PPP')} • {Math.floor(debate.duration / 60)}:{(debate.duration 
                        % 60).toString().padStart(2, '0')} mins
                    </p>
                </div>
                    <div className="flex gap-2">
                        <Link href="/app">
                            <Button variant="outline">Back to Debates</Button>
                        </Link>
                        <Button 
                            variant="destructive"
                            onClick={async () => {
                                'use server'
                                await deleteDebate(debate.id)
                            }}
                        >
                            Delete Debate
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Analysis Section */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Analysis</h2>
                        <SummaryGenerator
                            debateId={debate.id}
                            hasAnalysis={!!debate.analysis}
                        />
                    </div>

                    {debate.analysis ? (
                        <div className="space-y-6">
                            {/* Argument Analysis */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Argument Analysis</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Main Arguments</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {debate.analysis.argument_analysis.main_arguments.map((arg, i) => (
                                                <li key={i}>{arg}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Reasoning Quality</h4>
                                        <p>{debate.analysis.argument_analysis.reasoning_quality}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Evidence Usage</h4>
                                        <p>{debate.analysis.argument_analysis.evidence_usage}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Logical Fallacies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {debate.analysis.argument_analysis.logical_fallacies.map((fallacy, i) => (
                                                <Badge key={i} variant="secondary">{fallacy}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rhetorical Analysis */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Rhetorical Analysis</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Persuasiveness Score</h4>
                                            <div className="text-2xl font-bold">{debate.analysis.rhetorical_analysis.persuasiveness_score}/10</div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">Clarity Score</h4>
                                            <div className="text-2xl font-bold">{debate.analysis.rhetorical_analysis.clarity_score}/10</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Language Effectiveness</h4>
                                        <p>{debate.analysis.rhetorical_analysis.language_effectiveness}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Notable Phrases</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {debate.analysis.rhetorical_analysis.notable_phrases.map((phrase, i) => (
                                                <Badge key={i} variant="outline">{phrase}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Strategy Analysis */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Strategy Analysis</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Opening Effectiveness</h4>
                                        <p>{debate.analysis.strategy_analysis.opening_effectiveness}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Counterargument Handling</h4>
                                        <p>{debate.analysis.strategy_analysis.counterargument_handling}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Time Management</h4>
                                        <p>{debate.analysis.strategy_analysis.time_management}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Overall Strategy</h4>
                                        <p>{debate.analysis.strategy_analysis.overall_strategy}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Improvement Areas */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Areas for Improvement</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Priority Improvements</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {debate.analysis.improvement_areas.priority_improvements.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Practice Suggestions</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {debate.analysis.improvement_areas.practice_suggestions.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Specific Examples</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {debate.analysis.improvement_areas.specific_examples.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Overall Assessment */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Overall Assessment</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Key Strengths</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {debate.analysis.overall_assessment.key_strengths.map((strength, i) => (
                                                <li key={i}>{strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Learning Points</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {debate.analysis.overall_assessment.learning_points.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Effectiveness Score</h4>
                                        <div className="text-3xl font-bold">{debate.analysis.overall_assessment.effectiveness_score}/10</div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Summary</h4>
                                        <p className="text-muted-foreground">{debate.analysis.overall_assessment.summary}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No analysis available. Click "Generate Analysis" to create one.</p>
                        </div>
                    )}
                </Card>

                {/* Transcript Section */}
                <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Transcript</h2>
                    <div className="space-y-4">
                        {transcript.map((msg) => (
                            <div key={msg.id} className="mb-2">
                                <p className="font-semibold">
                                    {msg.role === "user" ? "You" : "AI"}:
                                </p>
                                <p className="pl-2 border-l-2 border-primary">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </main>
    )
} 