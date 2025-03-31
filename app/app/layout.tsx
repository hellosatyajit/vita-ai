import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logout } from "../login/actions"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between p-4 mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-xl font-instrument">
              Vita AI
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/app" className="font-medium hover:underline">
                Home
              </Link>
              <Link href="/app/practise" className="font-medium hover:underline">
                Practice
              </Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
            {user.user_metadata.name}
            </div>
            <form>
              <Button 
                variant="outline" 
                size="sm"
                formAction={logout}
                className="border-secondary hover:bg-secondary/20"
              >
                Logout
              </Button>
            </form>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-secondary/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80vw] bg-card">
              <SheetHeader>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <nav className="space-y-1">
                  <Link 
                    href="/app" 
                    className="block py-1 text-lg font-medium hover:underline"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/app/practise" 
                    className="block py-1 text-lg font-medium hover:underline"
                  >
                    Practice
                  </Link>
                </nav>
                <div className="pt-6 border-t border-secondary">
                  <div className="mb-4 text-sm text-muted-foreground">
                    {user.user_metadata.name}
                  </div>
                  <form>
                    <Button 
                      variant="outline" 
                      size="sm"
                      formAction={logout}
                      className="w-full border-secondary hover:bg-secondary/20"
                    >
                      Logout
                    </Button>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="px-4 container mx-auto">
        {children}
      </div>
    </div>
  )
} 