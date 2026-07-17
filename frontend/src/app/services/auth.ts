import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../models/register-request';
import { LoginRequest } from '../models/login-request';
import { AuthUser } from '../models/auth-user';
import { RegisterResponse } from '../models/register-response';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;

  currentUser = signal<AuthUser | null>(null);

  constructor(private http: HttpClient) {

    this.loadCurrentUser();
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/auth/register`,
      data
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      data
    );
  }

  getMe(): Observable<AuthUser> {
    const token = this.getAccessToken()
    return this.http.get<AuthUser>(
      `${this.apiUrl}/auth/me`, 
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  saveSession(response: LoginResponse | RegisterResponse): void {

    localStorage.setItem(
      'access_token',
      response.accessToken
    );

    this.currentUser.set(response.user);

  }

  loadCurrentUser(): void {

    if (!this.getAccessToken())
      return;


    this.getMe().subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
      error: (err) => {
        this.logout();
        console.log(err)
      }
    });

  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUser.set(null);
  }


}