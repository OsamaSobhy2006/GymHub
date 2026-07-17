import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CheckoutResponse } from '../models/checkout';
import { Payment, PaymentsResponse } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  private get headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    };
  }

  createMembershipCheckout(planId: string): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(
      `${this.apiUrl}/membership/${planId}`,
      {},
      this.headers
    );
  }

  getAllPayments(): Observable<PaymentsResponse> {
    return this.http.get<PaymentsResponse>(
      this.apiUrl,
      this.headers
    );
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.http.get<Payment>(
      `${this.apiUrl}/${id}`,
      this.headers
    );
  }

}