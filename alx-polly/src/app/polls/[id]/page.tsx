import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PollPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PollPage({ params }: PollPageProps) {
  const { id } = await params;
  // Placeholder data - will be replaced with real data from Supabase
  const poll = {
    id: id,
    question: "What's your favorite programming language?",
    description: "Choose the programming language you enjoy working with the most.",
    options: [
      { id: "1", text: "JavaScript", votes: 15, percentage: 35.7 },
      { id: "2", text: "Python", votes: 12, percentage: 28.6 },
      { id: "3", text: "TypeScript", votes: 10, percentage: 23.8 },
      { id: "4", text: "Rust", votes: 5, percentage: 11.9 },
    ],
    totalVotes: 42,
    createdAt: "2024-01-15",
    isActive: true,
    creator: "John Doe",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className="text-2xl">{poll.question}</CardTitle>
              {poll.description && (
                <CardDescription className="mt-2 text-base">
                  {poll.description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant={poll.isActive ? "default" : "secondary"}>
                {poll.isActive ? "Active" : "Closed"}
              </Badge>
              <Badge variant="outline">
                {poll.totalVotes} votes
              </Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Created by {poll.creator} on {poll.createdAt}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 mb-6">
            {poll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm text-muted-foreground">
                    {option.votes} votes ({option.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {poll.isActive && (
            <div className="space-y-3">
              <div className="text-center text-sm text-muted-foreground">
                Select your preferred option:
              </div>
              <div className="grid gap-2">
                {poll.options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                  >
                    <div className="w-4 h-4 border-2 border-primary rounded-full mr-3"></div>
                    {option.text}
                  </Button>
                ))}
              </div>
              <Button className="w-full" disabled>
                Submit Vote
              </Button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="text-center space-y-3">
              <div className="text-sm text-muted-foreground">
                Share this poll:
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  Copy Link
                </Button>
                <Button variant="outline" size="sm">
                  Show QR Code
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4 justify-center">
        <Button variant="outline" asChild>
          <Link href="/polls">← Browse Polls</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
