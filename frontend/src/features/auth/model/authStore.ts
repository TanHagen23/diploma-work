import { User } from '@/shared/types';

class AuthStore {
  private currentUser: User | null = null;
  private listeners: Set<(user: User | null) => void> = new Set();

  subscribe(listener: (user: User | null) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  login(username: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && password) {
          const user: User = {
            id: 1,
            fullName: 'John Doe',
            login: username,
            email: 'john@figma.com',
            role: 'admin',
            department: 'IT',
            lastLogin: new Date().toISOString(),
          };
          this.currentUser = user;
          localStorage.setItem('auth_token', 'mock_token_' + Date.now());
          localStorage.setItem('user_role', user.role);
          this.notify();
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    this.notify();
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getUserRole(): 'admin' | 'operator' | 'viewer' {
    return (localStorage.getItem('user_role') as any) || 'viewer';
  }
}

export const authStore = new AuthStore();
