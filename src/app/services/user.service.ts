import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';
  private usersKey = 'users';

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getCurrentUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserFromStorage(): User | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return null;
    }

    const tokenData = this.parseToken(token);
    if (!tokenData || !tokenData.username) {
      return null;
    }

    const users = this.getUsers();
    const user = users.find((u) => u.username === tokenData.username);
    return user || null;
  }

  getUsers(): User[] {
    const usersJson = localStorage.getItem(this.usersKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  register(user: User): boolean {
    const users = this.getUsers();

    if (users.some((u) => u.username === user.username)) {
      return false;
    }

    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const token = this.generateToken(user);
      localStorage.setItem(this.tokenKey, token);
      this.currentUserSubject.next(user);
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private generateToken(user: User): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const payload = {
      username: user.username,
      firstName: user.firstName,
      exp: new Date().getTime() + 24 * 60 * 60 * 1000, // 1 day expiration
    };

    const headerStr = btoa(JSON.stringify(header));
    const payloadStr = btoa(JSON.stringify(payload));

    const signature = btoa(`${headerStr}.${payloadStr}`);

    return `${headerStr}.${payloadStr}.${signature}`;
  }

  private parseToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      return JSON.parse(atob(parts[1]));
    } catch (e) {
      return null;
    }
  }
}
