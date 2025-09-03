import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PollsPage() {
  // Placeholder data - will be replaced with real data from Supabase
  const placeholderPolls = [
    {
      id: "1",
      question: "What's your favorite programming language?",
      options: ["JavaScript", "Python", "TypeScript", "Rust"],
      totalVotes: 42,
      createdAt: "2024-01-15",
      isActive: true,
    },
    {
      id: "2",
      question: "Which framework do you prefer for web development?",
      options: ["Next.js", "React", "Vue", "Angular"],
      totalVotes: 28,
      createdAt: "2024-01-14",
      isActive: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Polls</h1>
          <p className="text-muted-foreground">Discover and participate in polls</p>
        </div>
        <Button asChild>
          <Link href="/polls/create">Create New Poll</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {placeholderPolls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{poll.question}</CardTitle>
                  <CardDescription className="mt-2">
                    {poll.options.length} options • {poll.totalVotes} total votes
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={poll.isActive ? "default" : "secondary"}>
                    {poll.isActive ? "Active" : "Closed"}
                  </Badge>
                  <Badge variant="outline">
                    {poll.createdAt}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {poll.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/polls/${poll.id}`}>View & Vote</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-muted-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
