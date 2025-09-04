import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePoll } from "@/lib/actions/polls";

interface PageProps {
  searchParams?: Promise<{ created?: string; error?: string }>;
}

export const runtime = 'nodejs';

export default async function PollsPage(props: PageProps) {
  const sp = (props.searchParams ? await props.searchParams : {}) || {} as any;
  const created = sp.created === '1';
  const deleted = sp.deleted === '1';
  const error = sp.error as string | undefined;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: polls } = await supabase
    .from('polls')
    .select('id, question, is_active, created_at, creator_id')
    .order('created_at', { ascending: false });

  const pollIds = (polls || []).map(p => p.id);
  const { data: results } = pollIds.length ? await supabase
    .from('poll_results')
    .select('poll_id, votes_count')
    .in('poll_id', pollIds) : { data: [] as any[] } as any;

  const votesByPoll = new Map<string, number>();
  (results || []).forEach(r => {
    const pid = r.poll_id as string;
    const prev = votesByPoll.get(pid) || 0;
    votesByPoll.set(pid, prev + Number(r.votes_count));
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Polls</h1>
          <p className="text-xl text-muted-foreground">Discover and participate in polls</p>
        </div>
        <Button asChild>
          <Link href="/polls/create">Create New Poll</Link>
        </Button>
      </div>

      {(created || deleted || error) && (
        <div className={`mb-6 p-3 text-sm border rounded-md ${error ? 'text-red-700 bg-red-50 border-red-200' : 'text-green-700 bg-green-50 border-green-200'}`}>
          {error ? (error || 'Something went wrong.') : (created ? 'Poll created successfully.' : 'Poll deleted successfully.')}
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {(polls || []).map((poll) => (
          <Card key={poll.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold mb-1 truncate" title={poll.question}>
                {poll.question}
              </CardTitle>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{votesByPoll.get(poll.id) || 0} votes</span>
                <span className="flex gap-1 items-center">
                  <Badge variant={poll.is_active ? 'default' : 'secondary'} className="px-2 py-0.5 text-xs">
                    {poll.is_active ? 'Active' : 'Closed'}
                  </Badge>
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">
                    {new Date(poll.created_at).toLocaleDateString()}
                  </Badge>
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {user?.id === poll.creator_id && (
                <div className="flex gap-2 mb-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/polls/${poll.id}/edit`}>Edit</Link>
                  </Button>
                  <form action={deletePoll} className="inline">
                    <input type="hidden" name="poll_id" value={poll.id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Delete
                    </Button>
                  </form>
                </div>
              )}
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
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
