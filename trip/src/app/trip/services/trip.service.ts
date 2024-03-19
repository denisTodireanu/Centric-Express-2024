import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TripModel } from '../models';
import { TripsModel } from '../models/trips.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private endpoint: string = 'https://api-generator.retool.com/awiPna/trip';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<TripsModel> {
    return this.http.get<TripsModel>(this.endpoint, this.httpOptions);
  }

  get(id: string): Observable<TripModel> {
    return this.http.get<TripModel>(`${this.endpoint}/${id}`, this.httpOptions);
  }

  post(trip: TripModel): Observable<any> {
    return this.http.post<any>(this.endpoint, trip, this.httpOptions);
  }

  patch(trip: TripModel): Observable<any> {
    return this.http.patch<any>(`${this.endpoint}/${trip.id}`, trip, this.httpOptions);
  }
}
