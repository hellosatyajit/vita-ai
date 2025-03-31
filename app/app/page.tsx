import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserDebates } from "@/lib/db/queries"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const debates = await getUserDebates(user.id)
  const hasDebates = debates.length > 0

  return (
    <main className="container py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Debate Dashboard</h1>
          <p className="text-muted-foreground">
            View your practice history and start new debates
          </p>
        </div>
        <Button asChild>
          <Link href="/app/practise">Practice Debate</Link>
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Debates</h2>
        
        {hasDebates ? (
          <div className="divide-y">
            {debates.map((debate) => (
              <div key={debate.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      <Link 
                        href={`/app/debate/${debate.id}`}
                        className="hover:underline"
                      >
                        {debate.topic}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your stance: {debate.stance}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>
                      {debate.createdAt && formatDistanceToNow(new Date(debate.createdAt), { addSuffix: true })}
                    </p>
                    <p className="text-muted-foreground">
                      {Math.floor(debate.duration / 60)}:{(debate.duration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No debates yet. Start practicing to see your history here.</p>
            <Button asChild>
              <Link href="/app/practise">Start Your First Debate</Link>
            </Button>
          </div>
        )}

        {/* Resources Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="https://youtu.be/tyI73DwoovY?si=DSP91ZAw-97uN9Dj" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
            >
              <h3 className="font-medium mb-2">Debate Techniques</h3>
              <p className="text-sm text-muted-foreground">Learn essential debate techniques and strategies</p>
            </a>
            <a 
              href="https://youtu.be/_WjUFuW2J0A?si=uWuEFkkgzzoTICkf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
            >
              <h3 className="font-medium mb-2">Argumentation Skills</h3>
              <p className="text-sm text-muted-foreground">Master the art of constructing compelling arguments</p>
            </a>
            <a 
              href="https://youtu.be/YJQSuUZdcV4?si=ghEmmJQXFzzQFyLj" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
            >
              <h3 className="font-medium mb-2">Public Speaking Tips</h3>
              <p className="text-sm text-muted-foreground">Improve your public speaking and presentation skills</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
} 