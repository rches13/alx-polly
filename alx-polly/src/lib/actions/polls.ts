"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const question = (formData.get("question") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();
  const rawOptions = formData.getAll("options").map((o) => o.toString().trim());

  const options = rawOptions.filter((o) => o.length > 0);

  if (!question || options.length < 2) {
    redirect("/polls/create?error=invalid");
  }

  const { data: pollInsert, error: pollError } = await supabase
    .from("polls")
    .insert({
      question,
      description: description || null,
      creator_id: user.id,
    })
    .select("id")
    .single();

  if (pollError || !pollInsert) {
    redirect("/polls/create?error=create_failed");
  }

  const pollId = pollInsert.id as string;

  const optionsPayload = options.map((text, index) => ({
    poll_id: pollId,
    text,
    position: index,
  }));

  const { error: optionsError } = await supabase
    .from("poll_options")
    .insert(optionsPayload);

  if (optionsError) {
    redirect("/polls/create?error=options_failed");
  }

  revalidatePath('/polls');
  redirect(`/polls?created=1`);
}

export async function deletePoll(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const pollId = (formData.get('poll_id') || '').toString();
  if (!pollId) {
    redirect('/polls?error=invalid_poll');
  }

  // Ensure only owner can delete; also enforced by RLS policy
  const { error: delError } = await supabase
    .from('polls')
    .delete()
    .eq('id', pollId)
    .eq('creator_id', user!.id);

  if (delError) {
    redirect('/polls?error=delete_failed');
  }

  revalidatePath('/polls');
  redirect('/polls?deleted=1');
}

export async function updatePoll(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const pollId = (formData.get('poll_id') || '').toString();
  const question = (formData.get('question') || '').toString().trim();
  const description = (formData.get('description') || '').toString().trim();
  const rawOptions = formData.getAll('options').map(o => o.toString().trim());
  const options = rawOptions.filter(o => o.length > 0);

  if (!pollId || !question || options.length < 2) {
    redirect(`/polls/${pollId || ''}/edit?error=invalid`);
  }

  // Update poll (owner only)
  const { error: updError } = await supabase
    .from('polls')
    .update({ question, description: description || null })
    .eq('id', pollId)
    .eq('creator_id', user!.id);

  if (updError) {
    redirect(`/polls/${pollId}/edit?error=update_failed`);
  }

  // Replace options: delete then insert new list with positions
  const { error: delOptsError } = await supabase
    .from('poll_options')
    .delete()
    .eq('poll_id', pollId);

  if (delOptsError) {
    redirect(`/polls/${pollId}/edit?error=options_delete_failed`);
  }

  const optionsPayload = options.map((text, index) => ({
    poll_id: pollId,
    text,
    position: index,
  }));

  const { error: insOptsError } = await supabase
    .from('poll_options')
    .insert(optionsPayload);

  if (insOptsError) {
    redirect(`/polls/${pollId}/edit?error=options_insert_failed`);
  }

  revalidatePath('/polls');
  redirect('/polls?updated=1');
}


