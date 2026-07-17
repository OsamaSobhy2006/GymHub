import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getDashboardStats(): Observable<DashboardResponse> {

    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/dashboard/stats`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        }),
      }
    );

  }
}
