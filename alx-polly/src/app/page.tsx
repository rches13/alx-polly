'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
        {user ? (
          <div className="space-y-4">
            <div className="text-lg text-muted-foreground">
              Welcome back, {user.user_metadata?.name || user.email}!
            </div>
            <Button asChild>
              <Link href="/polls/create">Create New Poll</Link>
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        )}
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
            <CardTitle>About & Help</CardTitle>
            <CardDescription>
              Learn how to use ALX Polly and share polls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/about">Learn More</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      {/* Footer removed as requested */}
    </div>
  );
}
