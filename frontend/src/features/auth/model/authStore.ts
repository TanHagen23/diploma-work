import { User } from '@/shared/types';
import { authApi } from '@/shared/api/auth';

class AuthStore {
  private currentUser: User | null = null;
  private listeners: Set<(user: User | null) => void> = new Set();

  subscribe(listener: (user: User | null) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }

  async login(username: string, password: string): Promise<void> {
    await authApi.login(username, password);
    this.notify();
  }

  logout() {
    this.currentUser = null;
    authApi.logout();
    this.notify();
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access');
  }

  getUserRole(): 'admin' | 'operator' | 'viewer' {
    return (localStorage.getItem('user_role') as 'admin' | 'operator' | 'viewer') || 'viewer';
  }
}

export const authStore = new AuthStore();
