type SessionStatus = 'hydrating' | 'signed-out' | 'signed-in';

interface Session {
  status: SessionStatus;
  isSignedIn: boolean;
  /** True while the saved session is still being read. Show nothing and redirect nowhere until it ends. */
  isHydrating: boolean;
}

/**
 * Placeholder until the session store exists (Phase 5): every build behaves as a signed-in user.
 * The route guards in src/app/_layout.tsx already read from here, so wiring the real store
 * changes this file only.
 */
export function useSession(): Session {
  return { status: 'signed-in', isSignedIn: true, isHydrating: false };
}
