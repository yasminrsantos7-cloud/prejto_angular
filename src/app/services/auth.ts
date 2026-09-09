import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  nome: string;
  senha: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiurl = 'http://localhost:3001/';

  constructor(private http: HttpClient) {}

  login(usuario: Pick<Usuario, 'nome' | 'senha'>) : Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiurl}login`, usuario);
  }

}
