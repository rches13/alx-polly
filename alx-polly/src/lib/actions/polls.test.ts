import { createPoll } from './polls';

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user1' } } }),
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'poll1' }, error: null }),
    })),
  })),
}));

jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

describe('createPoll (integration)', () => {
  it('creates a poll and redirects on success', async () => {
    const formData = new FormData();
    formData.set('question', 'Test poll?');
    formData.set('description', 'A test poll');
    formData.append('options', 'Yes');
    formData.append('options', 'No');

    // @ts-ignore
    await createPoll(formData);

    const { redirect } = require('next/navigation');
    expect(redirect).toHaveBeenCalledWith('/polls?created=1');
  });
});
