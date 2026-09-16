import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, takeUntil } from 'rxjs';
import { DadoVeiculo, IndicadoresDashboard, Veiculo } from '../../models/veiculo.model';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  menuAberto = false;
  veiculoSelecionadoId = '';
  buscaCodigo = '';
  veiculos: Veiculo[] = [
    { id: '1', nome: 'Ford Ranger', imagemUrl: '/img/ranger.png' },
    { id: '2', nome: 'Ford Mustang', imagemUrl: '/img/mustang.png' },
    { id: '3', nome: 'Ford Bronco Sport', imagemUrl: '/img/broncoSport.png' },
    { id: '4', nome: 'Ford Territory', imagemUrl: '/img/territory.png' },
  ];
  indicadores: IndicadoresDashboard = {
    totalVendas: 0,
    conectados: 0,
    updatesSoftware: 0,
  };
  vehicleData: DadoVeiculo[] = [];
  carregando = true;
  private readonly buscaCodigo$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();
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
      error: () => this.definirErroApi(),
    });

    this.buscaCodigo$.pipe(
      debounceTime(300),
      map((codigo) => codigo.trim().toUpperCase()),
      distinctUntilChanged(),
      filter((vin) => vin.length >= 17),
      switchMap((vin) => this.vehicleService.getVehicleData(vin).pipe(
        map((response) => ({ response, vin })),
        catchError(() => of({ response: null, vin })),
      )),
      takeUntil(this.destroy$),
    ).subscribe({
      next: ({ response, vin }) => {
        this.vehicleData = response ? this.normalizarLista(response, vin) : [];
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get veiculoSelecionado(): Veiculo {
    return this.veiculos.find(({ id }) => String(id) === this.veiculoSelecionadoId)
      ?? this.veiculos[0]
      ?? { id: '', nome: 'Nenhum veículo', imagemUrl: '/img/ford.png' };
  }

  get dadosFiltrados(): DadoVeiculo[] {
    const busca = this.buscaCodigo.trim().toLowerCase();
    if (!busca) {
      return this.vehicleData;
    }

    return this.vehicleData.filter((dados) => this.valor(dados, 'vin', 'code', 'vehicleCode')
      .toLowerCase().includes(busca));
  }

  trackByVeiculo(_: number, veiculo: Veiculo): string {
    return veiculo.id;
  }

  trackByIndice(indice: number): number {
    return indice;
  }

  atualizarBusca(codigo: string): void {
    this.buscaCodigo = codigo;
    const vin = codigo.trim().toUpperCase();
    if (vin.length < 17) {
      this.vehicleData = [];
    }
    this.buscaCodigo$.next(codigo);
  }

  valor(dados: object | undefined, ...chaves: string[]): string {
    const registro = dados as Record<string, unknown> | undefined;
    const chave = chaves.find((nome) => registro?.[nome] !== undefined && registro[nome] !== null);
    return chave ? String(registro?.[chave]) : '-';
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

  private normalizarVeiculos(response: unknown): Veiculo[] {
    const lista = Array.isArray(response)
      ? response
      : (response as { vehicles?: unknown[] })?.vehicles ?? [];

    return lista.map((item, index) => {
      const dados = (item ?? {}) as Record<string, unknown>;
      const id = String(dados['id'] ?? index + 1);
      const nome = String(dados['nome'] ?? dados['vehicle'] ?? dados['model'] ?? dados['name'] ?? 'Veículo');
      return {
        id,
        nome,
        imagemUrl: String(dados['imagemUrl'] ?? this.imagemDoVeiculo(nome)),
      };
    });
  }

  private normalizarLista(response: unknown, vin?: string): DadoVeiculo[] {
    const normalizar = (item: unknown): DadoVeiculo => {
      const dados = (item ?? {}) as Record<string, unknown>;
      return {
        vin: String(dados['vin'] ?? vin ?? ''),
        odometro: Number(dados['odometro'] ?? dados['odometer'] ?? 0),
        nivelCombustivelOuBateria: (dados['nivelCombustivelOuBateria'] ?? dados['fuelLevel'] ?? dados['batteryLevel'] ?? '-') as string | number,
        statusOuPneus: String(dados['statusOuPneus'] ?? dados['status'] ?? dados['tirePressure'] ?? '-'),
        latitude: Number(dados['latitude'] ?? dados['lat'] ?? 0),
        longitude: Number(dados['longitude'] ?? dados['long'] ?? dados['lng'] ?? 0),
      };
    };
    if (Array.isArray(response)) {
      return response.map(normalizar);
    }
    const dados = response as { vehicleData?: unknown[] };
    if (Array.isArray(dados?.vehicleData)) {
      return dados.vehicleData.map(normalizar);
    }
    return response && typeof response === 'object'
      ? [normalizar(response)]
      : [];
  }

  private definirErroApi(): void {
    this.carregando = false;
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