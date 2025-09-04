import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PollPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const runtime = 'nodejs';

export default async function PollPage({ params }: PollPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select('id, question, description, is_active, created_at, creator_id')
    .eq('id', id)
    .single();

  if (pollError || !poll) {
    notFound();
  }

  const { data: options, error: optionsError } = await supabase
    .from('poll_options')
    .select('id, text, position')
    .eq('poll_id', id)
    .order('position', { ascending: true });

  if (optionsError) {
    notFound();
  }

  const { data: results } = await supabase
    .from('poll_results')
    .select('option_id, votes_count')
    .eq('poll_id', id);

  // Optimize: Build a map and tally total votes in one pass
  let totalVotes = 0;
  const optionIdToVotes = new Map<string, number>();
  (results || []).forEach(r => {
    const votes = Number(r.votes_count);
    optionIdToVotes.set(r.option_id as string, votes);
    totalVotes += votes;
  });

  // Optimize: Calculate enriched options in a single map pass
  const enrichedOptions = (options || []).map(o => {
    const votes = optionIdToVotes.get(o.id) || 0;
    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 1000) / 10 : 0;
    return { id: o.id, text: o.text, votes, percentage };
  });

  const { data: { user } } = await supabase.auth.getUser();

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
              <Badge variant={poll.is_active ? "default" : "secondary"}>
                {poll.is_active ? "Active" : "Closed"}
              </Badge>
              <Badge variant="outline">
                {totalVotes} votes
              </Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Created on {new Date(poll.created_at).toLocaleDateString()}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 mb-6">
            {enrichedOptions.map((option) => (
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

          {poll.is_active && (
            <div className="space-y-3">
              <div className="text-center text-sm text-muted-foreground">
                Select your preferred option:
              </div>
              <div className="grid gap-2">
                {enrichedOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                    disabled={!user}
                  >
                    <div className="w-4 h-4 border-2 border-primary rounded-full mr-3"></div>
                    {option.text}
                  </Button>
                ))}
              </div>
              <Button className="w-full" disabled={!user}>
                Submit Vote
              </Button>
              {!user && (
                <div className="text-center text-sm text-red-600 mt-2">
                  You must <Link href="/auth/login" className="underline">log in</Link> to vote.
                </div>
              )}
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
