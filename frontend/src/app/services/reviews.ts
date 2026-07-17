import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Review, ReviewsResponse, TrainerReviewsResponse } from '../models/review';
import { UpdateReviewRequest } from '../models/update-review';
import { CreateReviewRequest } from '../models/create-review';

@Injectable({
  providedIn: 'root',
})
export class Reviews {

  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient){}

  getAllreviews(): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/reviews`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    })
  }

  getTrainerReviews(trainerId: string): Observable<TrainerReviewsResponse>{
    return this.http.get<TrainerReviewsResponse>(`${this.apiUrl}/reviews/trainers/${trainerId}`)
  }

  createReview(trainerId: string, data: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/trainers/${trainerId}`, data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    })
  }

  updateReview( reviewId: string, data: UpdateReviewRequest): Observable<Review> {
    return this.http.patch<Review>(
      `${this.apiUrl}/reviews/${reviewId}`,
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        })
      }
    );
  }

  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/reviews/${reviewId}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        })
      }
    );
  }



}
