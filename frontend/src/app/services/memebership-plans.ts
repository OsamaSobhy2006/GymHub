import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  MembershipPlansResponse,
  MemebershipPlans,
} from '../models/memebersip-plans';

import {
  CreateMembershipPlanRequest,
  UpdateMembershipPlanRequest,
} from '../models/membership-plan-request';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemebershipPlansService {

  private apiUrl = environment.apiUrl + '/membership-plans';

  constructor(private http: HttpClient) {}

  getAllPlans(): Observable<MembershipPlansResponse> {
    return this.http.get<MembershipPlansResponse>(this.apiUrl);
  }

  create(
    data: CreateMembershipPlanRequest
  ): Observable<MemebershipPlans> {

    const token = localStorage.getItem('access_token');

    return this.http.post<MemebershipPlans>(
      this.apiUrl,
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  update(
    id: string,
    data: UpdateMembershipPlanRequest
  ): Observable<MemebershipPlans> {

    const token = localStorage.getItem('access_token');

    return this.http.patch<MemebershipPlans>(
      `${this.apiUrl}/${id}`,
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  delete(id: string): Observable<MemebershipPlans> {

    const token = localStorage.getItem('access_token');

    return this.http.delete<MemebershipPlans>(
      `${this.apiUrl}/${id}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

}