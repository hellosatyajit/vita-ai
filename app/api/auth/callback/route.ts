import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { upsertProfile } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await upsertProfile({
        id: user.id,
        email: user.email,
        avatarUrl: user.user_metadata?.avatar_url,
        fullName: user.user_metadata?.full_name
      })
    }
  }

  return NextResponse.redirect(new URL('/app', requestUrl.origin))
} 