export const APP_CONFIG = {
  name: "ALX Polly",
  description: "Create and share polls with QR codes",
  version: "1.0.0",
};

export const ROUTES = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  polls: {
    list: "/polls",
    create: "/polls/create",
    view: (id: string) => `/polls/${id}`,
  },
};

export const POLL_CONFIG = {
  minOptions: 2,
  maxOptions: 10,
  maxQuestionLength: 500,
  maxOptionLength: 200,
  maxDescriptionLength: 1000,
};

export const VOTING_CONFIG = {
  allowAnonymous: true,
  allowMultipleVotes: false,
  requireLogin: false,
};
