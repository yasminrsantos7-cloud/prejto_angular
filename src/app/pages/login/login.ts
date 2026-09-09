import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private readonly apiUrl = 'http://localhost:3001';
  nome = '';
  senha = '';
  mensagemErro = '';
  carregando = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  fazerLogin(event: SubmitEvent): void {
    event.preventDefault();
    this.mensagemErro = '';
    this.carregando = true;

    this.http.post(`${this.apiUrl}/login`, {
      nome: this.nome.trim(),
      senha: this.senha,
    }).subscribe({
      next: () => {
        this.carregando = false;
        sessionStorage.setItem('autenticado', 'true');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.carregando = false;
        this.mensagemErro = error.error?.message ?? 'Não foi possível fazer login.';
      },
    });
  }
}