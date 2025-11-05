'use client'

import { useState, useEffect } from 'react'
import { RelatorioManutencao } from '@/lib/types'
import { RelatorioService } from '@/lib/relatorio-service'

// Chave para localStorage (fallback)
const STORAGE_KEY = 'pamaserv_relatorios'

// Mock data para demonstração inicial
const mockRelatorios: RelatorioManutencao[] = [
  {
    id: 'REL-1733097600000',
    dadosEmpresa: {
      nomeEmpresa: 'PAMASERV',
      logo: '',
      telefone: '(11) 99999-9999',
      cnpj: '12.345.678/0001-90',
      email: 'contato@pamaserv.com',
      site: 'www.pamaserv.com'
    },
    dadosCliente: {
      nomeEmpresa: 'Tech Solutions Ltda',
      representante: 'João Silva',
      cargo: 'Gerente de TI',
      cidade: 'São Paulo - SP',
      endereco: 'Rua das Flores, 123',
      dataServico: '2024-12-01'
    },
    dadosServico: {
      status: 'Concluído',
      tipoManutencao: 'Preventiva',
      motivoChamado: 'Manutenção preventiva mensal',
      modeloEquipamento: 'Servidor Dell PowerEdge',
      numeroSerie: 'SN123456789',
      periodoGarantia: '12 meses'
    },
    acoesRealizadas: {
      desempenhoEquipamento: 'Sistema funcionando dentro dos parâmetros normais',
      problemasEncontrados: 'Nenhum problema identificado',
      recomendacoes: 'Continuar com manutenção preventiva mensal'
    },
    tecnicoResponsavel: {
      nome: 'Carlos Santos',
      cpf: '123.456.789-00',
      especialidade: 'Manutenção Preventiva',
      nomeEmpresa: 'PAMASERV'
    },
    horariosTrabalho: {
      dataServico: '2024-12-01',
      saidaBase: '08:00',
      chegadaCliente: '09:00',
      inicioTrabalho: '09:15',
      horarioAlmoco: '12:00',
      retornoAlmoco: '13:00',
      finalTrabalho: '17:00',
      saidaCliente: '17:15',
      chegadaBase: '18:00',
      totalHoras: '7:45'
    },
    anexoImagens: [],
    calculadoraCustos: {
      custosDeslocamento: {
        distanciaKm: 50,
        valorPorKm: 1.5,
        hospedagem: 0,
        alimentacao: 50,
        pedagio: 25
      },
      tabelaPrecos: [
        {
          id: '1',
          descricao: 'Manutenção preventiva',
          categoria: 'Serviço',
          quantidade: 1,
          precoUnitario: 500,
          desconto: 0,
          precoTotal: 500
        }
      ],
      totais: {
        subtotal: 500,
        custosDeslocamento: 150,
        totalGeral: 650
      }
    },
    assinaturasDigitais: {
      assinaturaEmpresa: '',
      nomeEmpresa: 'Carlos Santos',
      cargoEmpresa: 'Técnico Responsável',
      assinaturaCliente: '',
      nomeCliente: 'João Silva',
      cargoCliente: 'Gerente de TI'
    },
    criadoEm: new Date('2024-12-01'),
    atualizadoEm: new Date('2024-12-01')
  }
]

// Função para carregar relatórios do localStorage (fallback)
const carregarRelatoriosLocal = (): RelatorioManutencao[] => {
  if (typeof window === 'undefined') return mockRelatorios
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((rel: any) => ({
        ...rel,
        criadoEm: new Date(rel.criadoEm),
        atualizadoEm: new Date(rel.atualizadoEm),
        calculadoraCustos: {
          ...rel.calculadoraCustos,
          custosDeslocamento: {
            ...rel.calculadoraCustos.custosDeslocamento,
            pedagio: rel.calculadoraCustos.custosDeslocamento.pedagio || 0
          }
        }
      }))
    }
  } catch (error) {
    console.error('Erro ao carregar relatórios do localStorage:', error)
  }
  
  return mockRelatorios
}

// Função para salvar relatórios no localStorage (fallback)
const salvarRelatoriosLocal = (relatorios: RelatorioManutencao[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(relatorios))
  } catch (error) {
    console.error('Erro ao salvar relatórios no localStorage:', error)
  }
}

// Função para gerar HTML do relatório para visualização/impressão
const gerarHtmlRelatorio = (relatorio: RelatorioManutencao): string => {
  const formatarData = (data: string | Date) => {
    if (!data) return 'Não informado'
    const dataObj = typeof data === 'string' ? new Date(data) : data
    return dataObj.toLocaleDateString('pt-BR')
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Manutenção - ${relatorio.dadosCliente.nomeEmpresa}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background: #f8f9fa;
          padding: 20px;
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          padding: 40px; 
          border-radius: 10px; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          padding-bottom: 20px; 
          border-bottom: 3px solid #2563eb;
        }
        .header h1 { 
          color: #2563eb; 
          font-size: 2.5em; 
          margin-bottom: 10px; 
          font-weight: bold;
        }
        .header p { 
          color: #666; 
          font-size: 1.1em; 
        }
        .section { 
          margin-bottom: 30px; 
          padding: 20px; 
          background: #f8f9fa; 
          border-radius: 8px; 
          border-left: 4px solid #2563eb;
        }
        .section h2 { 
          color: #2563eb; 
          margin-bottom: 15px; 
          font-size: 1.4em; 
          display: flex; 
          align-items: center; 
          gap: 10px;
        }
        .grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap: 15px; 
        }
        .field { 
          background: white; 
          padding: 12px; 
          border-radius: 6px; 
          border: 1px solid #e5e7eb;
        }
        .field label { 
          font-weight: 600; 
          color: #374151; 
          display: block; 
          margin-bottom: 5px; 
          font-size: 0.9em;
        }
        .field span { 
          color: #111827; 
          font-size: 1em;
        }
        .status { 
          display: inline-block; 
          padding: 6px 12px; 
          border-radius: 20px; 
          font-weight: 600; 
          font-size: 0.9em;
        }
        .status.concluido { background: #dcfce7; color: #166534; }
        .status.andamento { background: #dbeafe; color: #1d4ed8; }
        .status.pendente { background: #fef3c7; color: #92400e; }
        .status.cancelado { background: #fee2e2; color: #dc2626; }
        .table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 15px; 
          background: white; 
          border-radius: 6px; 
          overflow: hidden;
        }
        .table th, .table td { 
          padding: 12px; 
          text-align: left; 
          border-bottom: 1px solid #e5e7eb; 
        }
        .table th { 
          background: #f3f4f6; 
          font-weight: 600; 
          color: #374151;
        }
        .custos-deslocamento {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #0ea5e9;
          margin-bottom: 20px;
        }
        .custos-deslocamento h4 {
          color: #0c4a6e;
          margin-bottom: 10px;
          font-size: 1.1em;
        }
        .custos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        .custo-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #e0f2fe;
        }
        .custo-item:last-child {
          border-bottom: none;
        }
        .totals { 
          background: #ecfdf5; 
          padding: 20px; 
          border-radius: 8px; 
          border: 1px solid #10b981; 
          margin-top: 20px;
        }
        .totals h3 { 
          color: #065f46; 
          margin-bottom: 15px; 
        }
        .total-item { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 8px; 
          padding: 5px 0;
        }
        .total-item.final { 
          font-weight: bold; 
          font-size: 1.2em; 
          border-top: 2px solid #10b981; 
          padding-top: 10px; 
          margin-top: 10px;
        }
        .signatures { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 30px; 
          margin-top: 40px; 
          padding-top: 30px; 
          border-top: 2px solid #e5e7eb;
        }
        .signature-box { 
          text-align: center; 
          padding: 20px; 
          background: #f8f9fa; 
          border-radius: 8px;
        }
        .signature-line { 
          border-top: 2px solid #374151; 
          margin: 30px 0 10px 0; 
          position: relative;
        }
        .signature-image { 
          max-width: 200px; 
          max-height: 80px; 
          margin: 10px 0;
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          color: #666; 
          font-size: 0.9em;
        }
        .print-buttons {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background: #f0f9ff;
          border-radius: 8px;
          border: 1px solid #0ea5e9;
        }
        .print-buttons button {
          background: #0ea5e9;
          color: white;
          border: none;
          padding: 12px 24px;
          margin: 0 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        }
        .print-buttons button:hover {
          background: #0284c7;
        }
        @media print {
          body { background: white; padding: 0; }
          .container { box-shadow: none; padding: 20px; }
          .no-print, .print-buttons { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="print-buttons no-print">
        <button onclick="window.print()">🖨️ Imprimir Relatório</button>
        <button onclick="gerarPDF()">📄 Baixar PDF</button>
      </div>

      <div class="container" id="relatorio-content">
        <div class="header">
          <h1>PAMASERV</h1>
          <p>Relatório de Manutenção</p>
          <p><strong>ID:</strong> ${relatorio.id}</p>
        </div>

        <div class="section">
          <h2>📋 Informações do Cliente</h2>
          <div class="grid">
            <div class="field">
              <label>Empresa:</label>
              <span>${relatorio.dadosCliente.nomeEmpresa || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Representante:</label>
              <span>${relatorio.dadosCliente.representante || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Cargo:</label>
              <span>${relatorio.dadosCliente.cargo || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Cidade:</label>
              <span>${relatorio.dadosCliente.cidade || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Endereço:</label>
              <span>${relatorio.dadosCliente.endereco || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Data do Serviço:</label>
              <span>${formatarData(relatorio.dadosCliente.dataServico)}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>🔧 Dados do Serviço</h2>
          <div class="grid">
            <div class="field">
              <label>Status:</label>
              <span class="status ${relatorio.dadosServico.status.toLowerCase().replace(' ', '')}">${relatorio.dadosServico.status}</span>
            </div>
            <div class="field">
              <label>Tipo de Manutenção:</label>
              <span>${relatorio.dadosServico.tipoManutencao}</span>
            </div>
            <div class="field">
              <label>Modelo do Equipamento:</label>
              <span>${relatorio.dadosServico.modeloEquipamento || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Número de Série:</label>
              <span>${relatorio.dadosServico.numeroSerie || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Período de Garantia:</label>
              <span>${relatorio.dadosServico.periodoGarantia || 'Não informado'}</span>
            </div>
          </div>
          ${relatorio.dadosServico.motivoChamado ? `
            <div class="field" style="margin-top: 15px;">
              <label>Motivo do Chamado:</label>
              <span>${relatorio.dadosServico.motivoChamado}</span>
            </div>
          ` : ''}
        </div>

        <div class="section">
          <h2>👨‍🔧 Técnico Responsável</h2>
          <div class="grid">
            <div class="field">
              <label>Nome:</label>
              <span>${relatorio.tecnicoResponsavel.nome || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>CPF:</label>
              <span>${relatorio.tecnicoResponsavel.cpf || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Nome da Empresa:</label>
              <span>${relatorio.tecnicoResponsavel.nomeEmpresa || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Especialidade:</label>
              <span>${relatorio.tecnicoResponsavel.especialidade || 'Não informado'}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>⏰ Horários de Trabalho</h2>
          <div class="grid">
            <div class="field">
              <label>Saída da Base:</label>
              <span>${relatorio.horariosTrabalho.saidaBase || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Chegada ao Cliente:</label>
              <span>${relatorio.horariosTrabalho.chegadaCliente || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Início do Trabalho:</label>
              <span>${relatorio.horariosTrabalho.inicioTrabalho || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Final do Trabalho:</label>
              <span>${relatorio.horariosTrabalho.finalTrabalho || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Saída do Cliente:</label>
              <span>${relatorio.horariosTrabalho.saidaCliente || 'Não informado'}</span>
            </div>
            <div class="field">
              <label>Total de Horas:</label>
              <span><strong>${relatorio.horariosTrabalho.totalHoras || 'Não calculado'}</strong></span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>📝 Ações Realizadas</h2>
          ${relatorio.acoesRealizadas.desempenhoEquipamento ? `
            <div class="field">
              <label>Desempenho do Equipamento:</label>
              <span>${relatorio.acoesRealizadas.desempenhoEquipamento}</span>
            </div>
          ` : ''}
          ${relatorio.acoesRealizadas.problemasEncontrados ? `
            <div class="field">
              <label>Problemas Encontrados:</label>
              <span>${relatorio.acoesRealizadas.problemasEncontrados}</span>
            </div>
          ` : ''}
          ${relatorio.acoesRealizadas.recomendacoes ? `
            <div class="field">
              <label>Recomendações:</label>
              <span>${relatorio.acoesRealizadas.recomendacoes}</span>
            </div>
          ` : ''}
        </div>

        ${relatorio.calculadoraCustos.tabelaPrecos.length > 0 || 
          relatorio.calculadoraCustos.custosDeslocamento.distanciaKm > 0 ||
          relatorio.calculadoraCustos.custosDeslocamento.hospedagem > 0 ||
          relatorio.calculadoraCustos.custosDeslocamento.alimentacao > 0 ||
          relatorio.calculadoraCustos.custosDeslocamento.pedagio > 0 ? `
          <div class="section">
            <h2>💰 Custos do Serviço</h2>
            
            ${(relatorio.calculadoraCustos.custosDeslocamento.distanciaKm > 0 ||
              relatorio.calculadoraCustos.custosDeslocamento.hospedagem > 0 ||
              relatorio.calculadoraCustos.custosDeslocamento.alimentacao > 0 ||
              relatorio.calculadoraCustos.custosDeslocamento.pedagio > 0) ? `
              <div class="custos-deslocamento">
                <h4>Custos de Deslocamento</h4>
                <div class="custos-grid">
                  ${relatorio.calculadoraCustos.custosDeslocamento.distanciaKm > 0 ? `
                    <div class="custo-item">
                      <span>Distância (${relatorio.calculadoraCustos.custosDeslocamento.distanciaKm}km × ${formatarMoeda(relatorio.calculadoraCustos.custosDeslocamento.valorPorKm)}):</span>
                      <span>${formatarMoeda(relatorio.calculadoraCustos.custosDeslocamento.distanciaKm * relatorio.calculadoraCustos.custosDeslocamento.valorPorKm)}</span>
                    </div>
                  ` : ''}
                  ${relatorio.calculadoraCustos.custosDeslocamento.hospedagem > 0 ? `
                    <div class="custo-item">
                      <span>Hospedagem:</span>
                      <span>${formatarMoeda(relatorio.calculadoraCustos.custosDeslocamento.hospedagem)}</span>
                    </div>
                  ` : ''}
                  ${relatorio.calculadoraCustos.custosDeslocamento.alimentacao > 0 ? `
                    <div class="custo-item">
                      <span>Alimentação:</span>
                      <span>${formatarMoeda(relatorio.calculadoraCustos.custosDeslocamento.alimentacao)}</span>
                    </div>
                  ` : ''}
                  ${relatorio.calculadoraCustos.custosDeslocamento.pedagio > 0 ? `
                    <div class="custo-item">
                      <span>Pedágio:</span>
                      <span>${formatarMoeda(relatorio.calculadoraCustos.custosDeslocamento.pedagio)}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            ${relatorio.calculadoraCustos.tabelaPrecos.length > 0 ? `
              <table class="table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Qtd</th>
                    <th>Preço Unit.</th>
                    <th>Desconto</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${relatorio.calculadoraCustos.tabelaPrecos.map(item => `
                    <tr>
                      <td>${item.descricao}</td>
                      <td>${item.categoria}</td>
                      <td>${item.quantidade}</td>
                      <td>${formatarMoeda(item.precoUnitario)}</td>
                      <td>${item.desconto}%</td>
                      <td>${formatarMoeda(item.precoTotal)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}
            
            <div class="totals">
              <h3>Resumo Financeiro</h3>
              <div class="total-item">
                <span>Subtotal dos Serviços:</span>
                <span>${formatarMoeda(relatorio.calculadoraCustos.totais.subtotal)}</span>
              </div>
              <div class="total-item">
                <span>Custos de Deslocamento:</span>
                <span>${formatarMoeda(relatorio.calculadoraCustos.totais.custosDeslocamento)}</span>
              </div>
              <div class="total-item final">
                <span>Total Geral:</span>
                <span>${formatarMoeda(relatorio.calculadoraCustos.totais.totalGeral)}</span>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="signatures">
          <div class="signature-box">
            <h3>Técnico Responsável</h3>
            ${relatorio.assinaturasDigitais.assinaturaEmpresa ? `
              <img src="${relatorio.assinaturasDigitais.assinaturaEmpresa}" alt="Assinatura do Técnico" class="signature-image" />
            ` : '<div class="signature-line"></div>'}
            <p><strong>${relatorio.assinaturasDigitais.nomeEmpresa || 'Nome não informado'}</strong></p>
            <p>${relatorio.assinaturasDigitais.cargoEmpresa || 'Cargo não informado'}</p>
          </div>
          
          <div class="signature-box">
            <h3>Cliente</h3>
            ${relatorio.assinaturasDigitais.assinaturaCliente ? `
              <img src="${relatorio.assinaturasDigitais.assinaturaCliente}" alt="Assinatura do Cliente" class="signature-image" />
            ` : '<div class="signature-line"></div>'}
            <p><strong>${relatorio.assinaturasDigitais.nomeCliente || 'Nome não informado'}</strong></p>
            <p>${relatorio.assinaturasDigitais.cargoCliente || 'Cargo não informado'}</p>
          </div>
        </div>

        <div class="footer">
          <p>Relatório gerado em ${formatarData(new Date())}</p>
          <p>PAMASERV - Sistema de Relatórios de Manutenção</p>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <script>
        function gerarPDF() {
          const element = document.getElementById('relatorio-content');
          const opt = {
            margin: 1,
            filename: 'relatorio_${relatorio.id}_${relatorio.dadosCliente.nomeEmpresa.replace(/[^a-zA-Z0-9]/g, '_')}.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          
          html2pdf().set(opt).from(element).save();
        }
      </script>
    </body>
    </html>
  `
}

export function useRelatorios() {
  const [relatorios, setRelatorios] = useState<RelatorioManutencao[]>([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [useSupabase, setUseSupabase] = useState(true)

  // Carregar relatórios na inicialização
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      try {
        if (useSupabase) {
          // Tentar carregar do Supabase
          const relatoriosSupabase = await RelatorioService.buscarRelatorios()
          setRelatorios(relatoriosSupabase)
          console.log('Relatórios carregados do Supabase:', relatoriosSupabase.length)
        } else {
          // Fallback para localStorage
          const relatoriosLocal = carregarRelatoriosLocal()
          setRelatorios(relatoriosLocal)
          console.log('Relatórios carregados do localStorage:', relatoriosLocal.length)
        }
      } catch (error) {
        console.error('Erro ao carregar do Supabase, usando localStorage:', error)
        setUseSupabase(false)
        const relatoriosLocal = carregarRelatoriosLocal()
        setRelatorios(relatoriosLocal)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    carregarDados()
  }, [])

  // Salvar no localStorage quando não usar Supabase
  useEffect(() => {
    if (initialized && !useSupabase) {
      salvarRelatoriosLocal(relatorios)
    }
  }, [relatorios, initialized, useSupabase])

  const adicionarRelatorio = async (relatorio: RelatorioManutencao): Promise<void> => {
    setLoading(true)
    
    try {
      const novoRelatorio = {
        ...relatorio,
        id: relatorio.id || `REL-${Date.now()}`,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      }

      if (useSupabase) {
        // Salvar no Supabase
        const relatorioSalvo = await RelatorioService.criarRelatorio(novoRelatorio)
        setRelatorios(prev => [relatorioSalvo, ...prev])
        console.log('Relatório salvo no Supabase:', relatorioSalvo.id)
      } else {
        // Salvar localmente
        setRelatorios(prev => [novoRelatorio, ...prev])
        console.log('Relatório salvo localmente:', novoRelatorio.id)
      }
      
    } catch (error) {
      console.error('Erro ao adicionar relatório:', error)
      // Em caso de erro com Supabase, tentar salvar localmente
      if (useSupabase) {
        setUseSupabase(false)
        const novoRelatorio = {
          ...relatorio,
          id: relatorio.id || `REL-${Date.now()}`,
          criadoEm: new Date(),
          atualizadoEm: new Date()
        }
        setRelatorios(prev => [novoRelatorio, ...prev])
        console.log('Fallback: Relatório salvo localmente')
      } else {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const atualizarRelatorio = async (id: string, dados: Partial<RelatorioManutencao>): Promise<void> => {
    setLoading(true)
    
    try {
      if (useSupabase) {
        // Buscar relatório atual
        const relatorioAtual = relatorios.find(r => r.id === id)
        if (!relatorioAtual) throw new Error('Relatório não encontrado')
        
        const relatorioAtualizado = { ...relatorioAtual, ...dados, atualizadoEm: new Date() }
        const relatorioSalvo = await RelatorioService.atualizarRelatorio(id, relatorioAtualizado)
        
        setRelatorios(prev => 
          prev.map(rel => rel.id === id ? relatorioSalvo : rel)
        )
        console.log('Relatório atualizado no Supabase:', id)
      } else {
        // Atualizar localmente
        setRelatorios(prev => 
          prev.map(rel => 
            rel.id === id ? { 
              ...rel, 
              ...dados, 
              atualizadoEm: new Date() 
            } : rel
          )
        )
        console.log('Relatório atualizado localmente:', id)
      }
      
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error)
      // Em caso de erro com Supabase, tentar atualizar localmente
      if (useSupabase) {
        setUseSupabase(false)
        setRelatorios(prev => 
          prev.map(rel => 
            rel.id === id ? { 
              ...rel, 
              ...dados, 
              atualizadoEm: new Date() 
            } : rel
          )
        )
        console.log('Fallback: Relatório atualizado localmente')
      } else {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const excluirRelatorio = async (id: string): Promise<void> => {
    setLoading(true)
    
    try {
      if (useSupabase) {
        // Excluir do Supabase
        await RelatorioService.excluirRelatorio(id)
        setRelatorios(prev => prev.filter(rel => rel.id !== id))
        console.log('Relatório excluído do Supabase:', id)
      } else {
        // Excluir localmente
        setRelatorios(prev => prev.filter(rel => rel.id !== id))
        console.log('Relatório excluído localmente:', id)
      }
      
    } catch (error) {
      console.error('Erro ao excluir relatório:', error)
      // Em caso de erro com Supabase, tentar excluir localmente
      if (useSupabase) {
        setUseSupabase(false)
        setRelatorios(prev => prev.filter(rel => rel.id !== id))
        console.log('Fallback: Relatório excluído localmente')
      } else {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const buscarRelatorio = (id: string): RelatorioManutencao | undefined => {
    return relatorios.find(rel => rel.id === id)
  }

  const filtrarRelatorios = (filtros: {
    status?: string
    tipoManutencao?: string
    dataInicio?: string
    dataFim?: string
    cliente?: string
  }) => {
    return relatorios.filter(rel => {
      if (filtros.status && rel.dadosServico.status !== filtros.status) return false
      if (filtros.tipoManutencao && rel.dadosServico.tipoManutencao !== filtros.tipoManutencao) return false
      if (filtros.dataInicio && rel.dadosCliente.dataServico < filtros.dataInicio) return false
      if (filtros.dataFim && rel.dadosCliente.dataServico > filtros.dataFim) return false
      if (filtros.cliente && !rel.dadosCliente.nomeEmpresa.toLowerCase().includes(filtros.cliente.toLowerCase())) return false
      return true
    })
  }

  const exportarRelatorios = (): string => {
    return JSON.stringify(relatorios, null, 2)
  }

  const importarRelatorios = (dadosJson: string): void => {
    try {
      const relatoriosImportados = JSON.parse(dadosJson)
      const relatoriosValidados = relatoriosImportados.map((rel: any) => ({
        ...rel,
        criadoEm: new Date(rel.criadoEm),
        atualizadoEm: new Date(rel.atualizadoEm)
      }))
      
      setRelatorios(relatoriosValidados)
      console.log('Relatórios importados com sucesso!')
    } catch (error) {
      console.error('Erro ao importar relatórios:', error)
      throw new Error('Formato de dados inválido')
    }
  }

  const limparTodosRelatorios = (): void => {
    setRelatorios([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Todos os relatórios foram removidos')
    }
  }

  const visualizarRelatorio = (id: string): void => {
    const relatorio = buscarRelatorio(id)
    if (!relatorio) {
      console.error('Relatório não encontrado:', id)
      alert('Relatório não encontrado!')
      return
    }

    try {
      const htmlContent = gerarHtmlRelatorio(relatorio)
      const newWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes')
      
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
        newWindow.focus()
        console.log('Relatório aberto em nova janela')
      } else {
        console.log('Popup bloqueado, usando fallback')
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Erro ao visualizar relatório:', error)
      alert('Erro ao abrir o relatório. Tente novamente.')
    }
  }

  const salvarRelatorio = (id: string, formato: 'html' | 'json' | 'pdf' = 'html'): void => {
    const relatorio = buscarRelatorio(id)
    if (!relatorio) {
      console.error('Relatório não encontrado:', id)
      alert('Relatório não encontrado!')
      return
    }

    try {
      if (formato === 'pdf') {
        visualizarRelatorio(id)
        return
      }

      let content: string
      let filename: string
      let mimeType: string

      if (formato === 'html') {
        content = gerarHtmlRelatorio(relatorio)
        filename = `relatorio_${relatorio.id}_${relatorio.dadosCliente.nomeEmpresa.replace(/[^a-zA-Z0-9]/g, '_')}.html`
        mimeType = 'text/html'
      } else {
        content = JSON.stringify(relatorio, null, 2)
        filename = `relatorio_${relatorio.id}.json`
        mimeType = 'application/json'
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log(`Relatório salvo como: ${filename}`)
    } catch (error) {
      console.error('Erro ao salvar relatório:', error)
      alert('Erro ao salvar o relatório. Tente novamente.')
    }
  }

  return {
    relatorios,
    loading,
    initialized,
    useSupabase,
    adicionarRelatorio,
    atualizarRelatorio,
    excluirRelatorio,
    buscarRelatorio,
    filtrarRelatorios,
    exportarRelatorios,
    importarRelatorios,
    limparTodosRelatorios,
    visualizarRelatorio,
    salvarRelatorio
  }
}