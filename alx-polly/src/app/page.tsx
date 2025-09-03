import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to ALX Polly
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create and share polls with QR codes
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Create Polls</CardTitle>
            <CardDescription>
              Design custom polls with multiple choice options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/polls/create">Create New Poll</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Polls</CardTitle>
            <CardDescription>
              Browse and participate in existing polls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/polls">Browse Polls</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share & Vote</CardTitle>
            <CardDescription>
              Share polls via links and QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/polls/example">View Example</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted-foreground">
        <p>Built with Next.js, Supabase, and AI assistance</p>
      </footer>
    </div>
  );
}
