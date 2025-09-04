import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { updatePoll } from "@/lib/actions/polls";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}

export const runtime = 'nodejs';

export default async function EditPollPage(props: PageProps) {
  const { id } = await props.params;
  const { error: errorParam } = (props.searchParams ? await props.searchParams : {}) || {} as any;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select('id, question, description, creator_id')
    .eq('id', id)
    .single();
  if (pollError || !poll) notFound();
  if (poll.creator_id !== user.id) redirect('/polls');

  const { data: options, error: optionsError } = await supabase
    .from('poll_options')
    .select('id, text, position')
    .eq('poll_id', id)
    .order('position', { ascending: true });
  if (optionsError) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Poll</CardTitle>
          <CardDescription className="text-xl">
            Update your question and options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={updatePoll}>
            {errorParam && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errorParam}
              </div>
            )}
            <input type="hidden" name="poll_id" value={poll.id} />
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Textarea
                id="question"
                name="question"
                defaultValue={poll.question}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Poll Options</Label>
              <div className="space-y-3">
                {(options || []).map((opt, index) => (
                  <div key={opt.id} className="flex gap-2">
                    <Input
                      name="options"
                      defaultValue={opt.text}
                      required={index <= 1}
                    />
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" disabled>
                + Add Option (coming soon)
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={poll.description ?? ''}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/polls">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


