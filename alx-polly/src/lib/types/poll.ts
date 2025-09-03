export interface Poll {
  id: string;
  question: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  creatorId: string;
  creator: User;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  pollId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  userId?: string; // Optional for anonymous voting
  createdAt: string;
}

export interface CreatePollData {
  question: string;
  description?: string;
  options: string[];
}

export interface PollFormData {
  question: string;
  description: string;
  options: string[];
}
