import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createPoll } from "@/lib/actions/polls";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export const runtime = 'nodejs';

export default async function CreatePollPage(props: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }
  const { error } = await props.searchParams;
  return <CreatePollForm serverError={error} />;
}

function CreatePollForm({ serverError }: { serverError?: string }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create New Poll</CardTitle>
          <CardDescription className="text-xl">
            Design a poll with your question and multiple choice options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={createPoll}>
            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {serverError === "invalid" && "Please provide a question and at least two options."}
                {serverError === "create_failed" && "Could not create poll. Please try again."}
                {serverError === "options_failed" && "Could not save options. Please try again."}
                {!["invalid","create_failed","options_failed"].includes(serverError) && serverError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Textarea
                id="question"
                name="question"
                placeholder="What would you like to ask?"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Poll Options</Label>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      name="options"
                      placeholder={`Option ${index}`}
                      required={index <= 2}
                    />
                    {index > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="px-2"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
              >
                + Add Option
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add context or additional information about your poll"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Create Poll
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/polls">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/" className="text-muted-foreground hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
