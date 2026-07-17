import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Session, SessionsResponse } from '../models/session';
import { CreateSessionRequest, UpdateSessionRequest } from '../models/session-request';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sessions`;

  private get headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    };
  }

  getAllSessions(): Observable<SessionsResponse> {
    return this.http.get<SessionsResponse>(
      this.apiUrl,
      this.headers
    );
  }

  getMySessions(): Observable<SessionsResponse> {
    return this.http.get<SessionsResponse>(
      `${this.apiUrl}/me`,
      this.headers
    );
  }

  getTrainerSessions(): Observable<SessionsResponse> {
    return this.http.get<SessionsResponse>(
      `${this.apiUrl}/trainer`,
      this.headers
    );
  }

  create(data: CreateSessionRequest): Observable<Session> {
    return this.http.post<Session>(
      this.apiUrl,
      data,
      this.headers
    );
  }

  update(id: string, data: UpdateSessionRequest): Observable<Session> {
    return this.http.patch<Session>(
      `${this.apiUrl}/${id}`,
      data,
      this.headers
    );
  }

  cancelSession(id: string): Observable<Session> {
    return this.http.patch<Session>(
      `${this.apiUrl}/${id}/cancel`,
      {},
      this.headers
    );
  }

}