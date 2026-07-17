import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreateUserRequest, Users } from '../models/users';
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user';
import { UpdateUserRequest } from '../models/update-user-request';
import { Trainer } from '../models/trainer';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl  

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<Users[]>(`${this.apiUrl}/users`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    })
  }

  getMe(): Observable<AuthUser>{
    const token = localStorage.getItem('access_token');
    return this.http.get<AuthUser>(
        `${this.apiUrl}/auth/me`,
        {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        }
    );
  }

  update(id: string, data: UpdateUserRequest): Observable<AuthUser> {
    const token = localStorage.getItem('access_token')

    return this.http.patch<AuthUser>(`${this.apiUrl}/users/${id}`,
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    )
  }

  uploadProfileImage(file: File) {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('profile-image', file);
    return this.http.patch<AuthUser>(
        `${this.apiUrl}/users/profile-image`,
        formData,
        {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        }
    );
  }

  getAllTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.apiUrl}/users/trainers`)
  }

  getTrainerById(id: string): Observable<AuthUser> {
    const token = localStorage.getItem('access_token');
    return this.http.get<AuthUser>(`${this.apiUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

}

  getPublicTrainer(id: string): Observable<AuthUser>{
    return this.http.get<AuthUser>(`${this.apiUrl}/users/trainers/${id}`)
  }

  create(data: CreateUserRequest): Observable<Users> {
    const token = localStorage.getItem('access_token');
    return this.http.post<Users>(`${this.apiUrl}/users`,
        data,
        {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        }
    );
  }

  delete(id: string): Observable<Users> {
    const token = localStorage.getItem('access_token');
    return this.http.delete<Users>(`${this.apiUrl}/users/${id}`,
        {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        }
    );
  }

}
