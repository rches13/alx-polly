# ALX Polly - Polling App with QR Code Sharing

A modern, full-stack polling application built with Next.js, Supabase, and AI assistance. Create polls, share them via unique links and QR codes, and collect votes from participants.

## 🚀 Features

- **User Authentication**: Secure registration and login using Supabase Auth
- **Poll Management**: Create, edit, and delete polls with multiple choice options
- **Voting System**: Public voting interface with real-time results
- **QR Code Sharing**: Generate QR codes for easy poll sharing
- **Responsive Design**: Modern UI built with shadcn/ui components
- **Real-time Updates**: Live poll results and statistics

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Login page
│   │   └── register/     # Registration page
│   ├── polls/            # Poll-related pages
│   │   ├── create/       # Create new poll
│   │   ├── [id]/         # Individual poll view
│   │   └── page.tsx      # Polls listing
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   └── polls/            # Poll-specific components
└── lib/                  # Utility functions and types
    ├── types/            # TypeScript type definitions
    ├── utils/            # Helper functions
    └── constants.ts      # App constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📱 Available Routes

- `/` - Home page with app overview
- `/auth/login` - User login
- `/auth/register` - User registration
- `/polls` - Browse all polls
- `/polls/create` - Create new poll
- `/polls/[id]` - View and vote on specific poll

## 🎯 Development Status

This project is currently in development with the following completed:

- ✅ Project scaffolding and folder structure
- ✅ Basic UI components using shadcn/ui
- ✅ Placeholder pages for all major features
- ✅ TypeScript type definitions
- ✅ Responsive design foundation

### Upcoming Features

- 🔄 Supabase integration
- 🔄 User authentication
- 🔄 Poll CRUD operations
- 🔄 Voting system
- 🔄 QR code generation
- 🔄 Real-time updates
- 🔄 Deployment to Vercel

## 🤝 Contributing

This project is part of the "AI for Developers" program. Development is guided by AI assistance tools including:

- **Planning & Design**: AI Chat tools for architecture and data modeling
- **UI Generation**: v0.dev for rapid component creation
- **Code Assistance**: Cursor, GitHub Copilot for development
- **Testing & Debugging**: AI-powered testing and error resolution


- UI components from shadcn/ui
- Framework by Next.js team
- Database services by Supabase
