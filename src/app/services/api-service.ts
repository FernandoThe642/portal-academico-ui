import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment } from '../../environments/environment'

export type RegisterResponse = {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role?: string; 
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  public apiUrl = environment.apiUrlL;

  // 1. POST /users (Registro)
  registerUser(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/users`, userData);
  }

  // 2. POST /resources/upload (Subida de archivos).
  uploadResource(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resources/upload`, formData);
  }

  // 3. GET /resources (Listar recursos)
  getResources(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resources`);
  }
}
