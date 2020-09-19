import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string;
  private token: string;
  private authSubject = new BehaviorSubject<boolean>(false);
  private url: string = 'http://localhost:3000/api/user';
  private timer: number;

  constructor(private http: HttpClient, private router: Router) { }

  getToken(): string {
    return this.token;
  }

  isAuthed(): boolean {
    return !!this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusLisener(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  signup(authData: AuthData) {
    return this.http.post(`${this.url}/signup`, authData);
  }

  getLocalStorage() {
    const expireRemaining: number = +localStorage.getItem('expireTime') - Date.now();
    if (expireRemaining <= 0) {
      localStorage.clear();
    } else {
      console.log(new Date(expireRemaining).getMinutes());
      this.token = localStorage.getItem('token');
      this.userId = localStorage.getItem('userId');
      this.authSubject.next(true);
      this.timer = setTimeout(() => {
        this.logout();
      }, expireRemaining);
    }
  }

  private setLocalStorage(expireIn: number) {
    const expireTime: number = Date.now() + expireIn;
    localStorage.setItem('token', this.token);
    localStorage.setItem('expireTime', expireTime.toString());
    localStorage.setItem('userId', this.userId);
  }

  login(authData: AuthData) {
    this.http.post<{ message: string, token: string; expiresIn: number; userId: string; }>
      (`${this.url}/login`, authData).subscribe(result => {
        console.log(result.message);
        this.timer = setTimeout(() => {
          this.logout();
        }, result.expiresIn * 1000);
        this.token = result.token;
        this.userId = result.userId;
        this.authSubject.next(true);
        this.setLocalStorage(result.expiresIn * 1000);
        this.router.navigate(['']);
      });
  }

  logout(): void {
    this.token = null;
    this.userId = null;
    this.authSubject.next(false);
    clearTimeout(this.timer);
    localStorage.clear();
    this.router.navigate(['']);
  }
}
