import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle';

interface DashboardVeiculo {
  id: number | string;
  vehicle: string;
  [key: string]: unknown;
  imagem: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  menuAberto = false;
  veiculoSelecionadoId = '';
  buscaCodigo = '';
  veiculos: DashboardVeiculo[] = [
    { id: 1, vehicle: 'Ford Ranger', totalSales: 0, connected: 0, softwareUpdates: 0, imagem: '/img/ranger.png' },
    { id: 2, vehicle: 'Ford Mustang', totalSales: 0, connected: 0, softwareUpdates: 0, imagem: '/img/mustang.png' },
    { id: 3, vehicle: 'Ford Bronco Sport', totalSales: 0, connected: 0, softwareUpdates: 0, imagem: '/img/broncoSport.png' },
    { id: 4, vehicle: 'Ford Territory', totalSales: 0, connected: 0, softwareUpdates: 0, imagem: '/img/territory.png' },
  ];
  vehicleData: Record<string, unknown>[] = [];
  carregando = true;
  erroApi = '';

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
  ) {}

  ngOnInit(): void {
    this.veiculoSelecionadoId = String(this.veiculos[0].id);
    this.vehicleService.getVehicles().subscribe({
      next: (response) => {
        this.veiculos = this.normalizarVeiculos(response);
        this.veiculoSelecionadoId = String(this.veiculos[0]?.id ?? '');
        this.carregando = false;
      },
      error: (error: HttpErrorResponse) => this.definirErroApi(error),
    });

    this.vehicleService.getVehicleData().subscribe({
      next: (response) => this.vehicleData = this.normalizarLista(response),
      error: (error: HttpErrorResponse) => this.definirErroApi(error),
    });
  }

  get veiculoSelecionado(): DashboardVeiculo {
    return this.veiculos.find(({ id }) => String(id) === this.veiculoSelecionadoId)
      ?? this.veiculos[0]
      ?? { id: '', vehicle: 'Nenhum veículo', imagem: '/img/ford.png' };
  }

  indicador(...chaves: string[]): string {
    return this.valor(this.veiculoSelecionado, ...chaves);
  }

  get dadosFiltrados(): Record<string, unknown>[] {
    const busca = this.buscaCodigo.trim().toLowerCase();
    if (!busca) {
      return this.vehicleData;
    }

    return this.vehicleData.filter((dados) => this.valor(dados, 'vin', 'code', 'vehicleCode')
      .toLowerCase().includes(busca));
  }

  selecionarVeiculo(event: Event): void {
    this.veiculoSelecionadoId = (event.target as HTMLSelectElement).value;
  }

  valor(dados: Record<string, unknown> | undefined, ...chaves: string[]): string {
    const chave = chaves.find((nome) => dados?.[nome] !== undefined && dados[nome] !== null);
    return chave ? String(dados?.[chave]) : '-';
  }

  imagemDoVeiculo(nome: string): string {
    const imagens: Record<string, string> = {
      ranger: '/img/ranger.png',
      mustang: '/img/mustang.png',
      bronco: '/img/broncoSport.png',
      territory: '/img/territory.png',
    };
    const modelo = nome.toLowerCase();
    const chave = Object.keys(imagens).find((item) => modelo.includes(item));
    return chave ? imagens[chave] : '/img/ford.png';
  }

  private normalizarVeiculos(response: unknown): DashboardVeiculo[] {
    const lista = Array.isArray(response)
      ? response
      : (response as { vehicles?: unknown[] })?.vehicles ?? [];

    return lista.map((item, index) => {
      const dados = (item ?? {}) as Record<string, unknown>;
      const id = typeof dados['id'] === 'string' || typeof dados['id'] === 'number'
        ? dados['id']
        : index + 1;
      return {
        ...dados,
        id,
        vehicle: String(dados['vehicle'] ?? dados['model'] ?? dados['name'] ?? 'Veículo'),
        imagem: this.imagemDoVeiculo(String(dados['vehicle'] ?? dados['model'] ?? '')),
      };
    });
  }

  private normalizarLista(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) {
      return response as Record<string, unknown>[];
    }
    const dados = response as { vehicleData?: unknown[] };
    return (dados?.vehicleData ?? []) as Record<string, unknown>[];
  }

  private definirErroApi(error: HttpErrorResponse): void {
    this.carregando = false;
    this.erroApi = error.status === 0
      ? 'Não foi possível conectar ao back-end.'
      : '';
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  sair(): void {
    sessionStorage.removeItem('autenticado');
    this.fecharMenu();
    this.router.navigate(['/login']);
  }

}