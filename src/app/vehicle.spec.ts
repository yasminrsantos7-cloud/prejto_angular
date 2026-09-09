import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // Passo 8: Busca os dados dos modelos
  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicle`);
  }

  // Passo 11: Busca os dados detalhado do veículo/telemetria
  getVehicleData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicleData`);
  }
}