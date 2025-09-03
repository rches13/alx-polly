import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

export default function CreatePollPage() {
  return (
    <ProtectedRoute>
      <CreatePollForm />
    </ProtectedRoute>
  );
}

function CreatePollForm() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Poll</CardTitle>
          <CardDescription>
            Design a poll with your question and multiple choice options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Textarea
                id="question"
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
                      placeholder={`Option ${index}`}
                      required
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
