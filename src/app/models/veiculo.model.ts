export interface Veiculo {
  id: string;
  nome: string;
  imagemUrl?: string;
}

export interface IndicadoresDashboard {
  totalVendas: number;
  conectados: number;
  updatesSoftware: number;
}

export interface DadoVeiculo {
  vin: string;
  odometro: number;
  nivelCombustivelOuBateria: string | number;
  statusOuPneus: string;
  latitude: number;
  longitude: number;
}

export interface Veiculos extends Array<Veiculo> {}

export interface VeiculosAPI {
  vehicles: Veiculos;
}
