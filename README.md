# AI Debate Practice Platform

A modern web application that helps users improve their debating skills through AI-powered practice sessions. Practice debates on various topics, receive real-time feedback, and track your progress over time.

## Features

### Core Functionality
- **AI-Powered Debate Practice**: Engage in real-time debates with an AI opponent that adapts to your style and skill level
- **Comprehensive Topics**: Choose from a curated list of debate topics or input your own
- **Stance Selection**: Practice arguing both for and against different positions
- **Real-time Interaction**: Natural conversation flow with the AI opponent

### Analysis & Feedback
- **Detailed Performance Analysis**: Get comprehensive feedback on your debate performance
- **Argument Structure Assessment**: Analysis of your main arguments, reasoning quality, and evidence usage
- **Rhetorical Skills Evaluation**: Feedback on persuasiveness, clarity, and language effectiveness
- **Strategic Insights**: Assessment of your opening effectiveness, counterargument handling, and time management

### Learning Resources
- **Curated Video Resources**: Access to hand-picked educational videos on:
  - Debate Techniques
  - Argumentation Skills
  - Public Speaking Tips

### Progress Tracking
- **Debate History**: Review all your past practice sessions
- **Performance Metrics**: Track your improvement over time
- **Session Duration**: Monitor the length of your practice sessions

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase with Drizzle ORM
- **Authentication**: Supabase Auth
- **AI Integration**: Google Gemini AI (for analysis) and OpenAI Realtime API (for debate)
- **UI Components**: Custom components with modern design

## Getting Started

### Prerequisites
- OpenAI API Key
- Google AI API Key
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_KEY=your-google-ai-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-database-url
```

4. Run the development server:
```bash
pnpm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign In**: Create an account or sign in
2. **Start Practice**: Click "Practice Debate" to begin a new session
3. **Choose Topic**: Select from available topics or enter your own
4. **Select Stance**: Choose to argue for or against the topic
5. **Engage in Debate**: Interact with the AI opponent
6. **Review Analysis**: Get detailed feedback after completing the debate
7. **Track Progress**: View your debate history and improvement over time

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── app/               # App router pages
│   ├── api/               # API routes
│   └── components/        # Shared components
├── lib/                   # Utility functions and shared logic
│   ├── db/               # Database queries and schema
│   └── prompts/          # AI conversation prompts
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Resources

- [Openai Realtime API Nextjs](https://github.com/cameronking4/openai-realtime-api-nextjs)
- [Wunderbucket](wunderbucket.io/?ref=landingfolio)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
