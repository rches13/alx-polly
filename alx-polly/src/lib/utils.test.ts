import { cn } from './utils';

describe('cn', () => {
  it('combines class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz');
    expect(cn('foo', 0, null, 'bar')).toBe('foo bar');
  });

  it('returns an empty string if no arguments are provided', () => {
    expect(cn()).toBe('');
  });

  it('ignores falsy values and merges classes', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });
});
