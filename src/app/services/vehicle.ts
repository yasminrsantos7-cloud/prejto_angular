import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/vehicle`);
  }

  getVehicleData(): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/vehicleData`);
  }
}
