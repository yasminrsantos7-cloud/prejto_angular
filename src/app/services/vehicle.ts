import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, pluck } from 'rxjs';
import { Veiculo, VeiculosAPI } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Veiculo[]> {
    return this.http.get<VeiculosAPI>(`${this.apiUrl}/vehicles`).pipe(
      pluck('vehicles'),
      map((vehicles) => vehicles ?? []),
    );
  }

  getVehicleData(vin: string): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/vehicleData`, { vin });
  }
}
