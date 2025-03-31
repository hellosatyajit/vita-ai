"use server"

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

const FEATURES = [
  {
    title: "Real-time AI Debate Practice",
    description: "AI opponent that challenges your arguments in real-time. It's like debating with a knowledgeable partner who adapts to your style and provides thoughtful responses."
  },
  {
    title: "Comprehensive Feedback",
    description: "After each debate, receive a detailed breakdown of your performance with actionable tips for improvement. Track your progress over time as you develop your skills."
  },
  {
    title: "Track Your Progress",
    description: "Review your past debates and see how your skills evolve over time. Identify patterns in your argumentation style and focus your practice on areas that need improvement."
  },
  {
    title: "Practice Anywhere, Anytime",
    description: "No need to coordinate with human partners. Practice at your own pace and schedule, whenever inspiration strikes or before important speaking events."
  }
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-svh flex flex-col items-center bg-[#fff8dc] text-[#333333]">
      {/* Nav */}
      <div className="w-full max-w-5xl px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl font-instrument">Vita AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/hellosatyajit/debate-ai" className="text-sm hover:underline">Github</Link>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto mt-12 mb-20 px-4 text-center">

        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-instrument">Turn your ideas into powerful debates</h1>
        <h2 className="text-xl md:text-xl text-[#555] mb-8 max-w-2xl mx-auto">
          For speakers & debaters who want live, serious practice without complicated tools. It's like a personal debate coach that never gets tired.
        </h2>

        <div className="flex gap-4 justify-center mb-6">
          <Button asChild className="px-8 py-6 rounded-md" size="lg">
            <Link href={user ? "/app/practise" : "/login"}>Start Practicing Now</Link>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-20 text-[#f3e9c2]">
        <svg width="100%" height="20" viewBox="0 0 1000 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10C166.667 3.33333 333.333 0 500 0C666.667 0 833.333 3.33333 1000 10V10C833.333 16.6667 666.667 20 500 20C333.333 20 166.667 16.6667 0 10V10Z" fill="currentColor" />
        </svg>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 text-center mb-20">
        <p className="text-lg text-[#555]">Here's some of the highlights of the features you get when you decide to use Vita AI.</p>
      </div>

      <div id="features" className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 mb-24">
        {FEATURES.map((feature, index) => (
          <div key={index} className="p-6 border border-[#f3e9c2] rounded-lg">
            <h3 className="text-2xl font-bold mb-4 font-instrument">{feature.title}</h3>
            <p className="text-[#555]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl mx-auto px-6 text-center mb-20">
        <Button asChild className="bg-[#333] hover:bg-[#222] text-white px-8 py-6 rounded-md mx-auto" size="lg">
          <Link href={user ? "/app/practise" : "/login"}>Start Practicing Now</Link>
        </Button>
      </div>

      <div className="w-full py-6 border-t border-[#e5e0d5] text-center text-sm text-[#777]">
        <p>Crafted with ❤️ by <Link href="https://satyajit.xyz" className="hover:underline">Satyajit</Link> & <Link href="https://linkedin.com/in/jaybhattwrites" className="hover:underline">Jay</Link></p>
      </div>
    </main>
  )
}