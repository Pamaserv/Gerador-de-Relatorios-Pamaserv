export interface DadosEmpresa {
  logo: string;
  telefone: string;
  cnpj: string;
  email: string;
  site: string;
}

export interface DadosCliente {
  nomeEmpresa: string;
  representante: string;
  cargo: string;
  cidade: string;
  endereco: string;
  dataServico: string;
}

export interface DadosServico {
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  tipoManutencao: 'Preventiva' | 'Corretiva' | 'Emergencial' | 'Instalação';
  motivoChamado: string;
  modeloEquipamento: string;
  numeroSerie: string;
  periodoGarantia: string;
}

export interface AcoesRealizadas {
  desempenhoEquipamento: string;
  problemasEncontrados: string;
  recomendacoes: string;
}

export interface TecnicoResponsavel {
  nome: string;
  cpf: string;
  especialidade: string;
  nomeEmpresa: string;
}

export interface HorariosTrabalho {
  dataServico: string;
  saidaBase: string;
  chegadaCliente: string;
  inicioTrabalho: string;
  horarioAlmoco: string;
  retornoAlmoco: string;
  finalTrabalho: string;
  saidaCliente: string;
  chegadaBase: string;
  totalHoras: string;
}

export interface AnexoImagem {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  descricao?: string;
}

export interface ItemTabelaPrecos {
  id: string;
  descricao: string;
  categoria: string;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  precoTotal: number;
}

export interface CustosDeslocamento {
  distanciaKm: number;
  valorPorKm: number;
  hospedagem: number;
  alimentacao: number;
  pedagio: number;
}

export interface TotaisCustos {
  subtotal: number;
  custosDeslocamento: number;
  totalGeral: number;
}

export interface CalculadoraCustos {
  custosDeslocamento: CustosDeslocamento;
  tabelaPrecos: ItemTabelaPrecos[];
  totais: TotaisCustos;
}

export interface AssinaturasDigitais {
  assinaturaEmpresa: string;
  nomeEmpresa: string;
  cargoEmpresa: string;
  assinaturaCliente: string;
  nomeCliente: string;
  cargoCliente: string;
}

export interface RelatorioManutencao {
  id: string;
  dadosEmpresa: DadosEmpresa;
  dadosCliente: DadosCliente;
  dadosServico: DadosServico;
  acoesRealizadas: AcoesRealizadas;
  tecnicoResponsavel: TecnicoResponsavel;
  horariosTrabalho: HorariosTrabalho;
  anexoImagens: AnexoImagem[];
  calculadoraCustos: CalculadoraCustos;
  assinaturasDigitais: AssinaturasDigitais;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface FiltrosRelatorio {
  status?: string;
  tipoManutencao?: string;
  dataInicio?: string;
  dataFim?: string;
  cliente?: string;
}