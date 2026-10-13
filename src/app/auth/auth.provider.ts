import { signal, type Provider } from '@angular/core';
import { AUTH_SERVICE, type AuthService, type AuthUser } from '@thydda/auth-contracts';

// Used only by mfe1's standalone bootstrap, not by the federated routes.
export function provideAuth(): Provider {
  return {
    provide: AUTH_SERVICE,
    useFactory: (): AuthService => {
      const user = signal<AuthUser | null>(null);
      return {
        user: user.asReadonly(),
        login(name: string) {
          const normalizedName = name.trim();
          if (!normalizedName) throw new Error('Enter a name to sign in.');
          user.set({ id: 'standalone-demo-user', name: normalizedName });
        },
        logout() {
          user.set(null);
        },
      };
    },
  };
}
