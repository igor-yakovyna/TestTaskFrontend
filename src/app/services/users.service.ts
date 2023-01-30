import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiEndpoint}/api/v1/users`)
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  saveUsers(users: User[]): Observable<any> {
    return this.http.put(`${environment.apiEndpoint}/api/v1/users`, {users: users}, this.httpOptions)
    .pipe(
      catchError(this.handleError<any>('saveUsers', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
