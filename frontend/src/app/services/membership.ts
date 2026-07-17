import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { MembershipResponse, Membership } from '../models/memebersip-plans';
import {
  CreateMembershipRequest
} from '../models/membership-request';

@Injectable({
  providedIn: 'root',
})
export class MembershipService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/membership`;

  private get headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    };
  }

  getAllMemberships(): Observable<MembershipResponse> {
    return this.http.get<MembershipResponse>(
      this.apiUrl,
      this.headers
    );
  }

  getActiveMemberships(): Observable<MembershipResponse> {
    return this.http.get<MembershipResponse>(
      `${this.apiUrl}/active`,
      this.headers
    );
  }

  getExpiredMemberships(): Observable<MembershipResponse> {
    return this.http.get<MembershipResponse>(
      `${this.apiUrl}/expired`,
      this.headers
    );
  }

  getMembershipById(id: string): Observable<Membership> {
    return this.http.get<Membership>(
      `${this.apiUrl}/${id}`,
      this.headers
    );
  }

  getMyMembership(): Observable<MembershipResponse> {
    return this.http.get<MembershipResponse>(
      `${this.apiUrl}/me`,
      this.headers
    );
  }

  create(data: CreateMembershipRequest): Observable<Membership> {
    return this.http.post<Membership>(
      this.apiUrl,
      data,
      this.headers
    );
  }

  renew(id: string): Observable<Membership> {
    return this.http.post<Membership>(
      `${this.apiUrl}/${id}/renew`,
      {},
      this.headers
    );
  }

  delete(id: string): Observable<Membership> {
    return this.http.delete<Membership>(
      `${this.apiUrl}/${id}`,
      this.headers
    );
  }

}