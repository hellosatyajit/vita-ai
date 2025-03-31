export interface Database {
  public: {
    Tables: {
      debates: {
        Row: {
          id: string
          created_at: string
          user_id: string
          topic: string
          stance: string
          duration: number
          tokens_used: number
          transcript: Array<{ role: string; text: string; id: string }>
          analysis: DebateAnalysis | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          topic: string
          stance: string
          duration: number
          tokens_used: number
          transcript: Array<{ role: string; text: string; id: string }>
          analysis?: DebateAnalysis | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          topic?: string
          stance?: string
          duration?: number
          tokens_used?: number
          transcript?: Array<{ role: string; text: string; id: string }>
          analysis?: DebateAnalysis | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
        }
      }
    }
  }
}

export interface DebateAnalysis {
  argument_analysis: {
    main_arguments: string[]
    reasoning_quality: string
    evidence_usage: string
    logical_fallacies: string[]
  }
  rhetorical_analysis: {
    persuasiveness_score: number
    clarity_score: number
    language_effectiveness: string
    notable_phrases: string[]
  }
  strategy_analysis: {
    opening_effectiveness: string
    counterargument_handling: string
    time_management: string
    overall_strategy: string
  }
  improvement_areas: {
    priority_improvements: string[]
    practice_suggestions: string[]
    specific_examples: string[]
  }
  overall_assessment: {
    key_strengths: string[]
    learning_points: string[]
    effectiveness_score: number
    summary: string
  }
} 