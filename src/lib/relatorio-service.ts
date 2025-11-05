import { supabase } from '@/lib/supabase'
import { RelatorioManutencao } from '@/lib/types'

export class RelatorioService {
  // Criar novo relatório
  static async criarRelatorio(relatorio: RelatorioManutencao): Promise<RelatorioManutencao> {
    const { data, error } = await supabase
      .from('relatorios_manutencao')
      .insert({
        id: relatorio.id,
        titulo: relatorio.dadosCliente.nomeEmpresa + ' - ' + relatorio.dadosServico.modeloEquipamento,
        dados_empresa: relatorio.dadosEmpresa,
        dados_cliente: relatorio.dadosCliente,
        dados_servico: relatorio.dadosServico,
        acoes_realizadas: relatorio.acoesRealizadas,
        tecnico_responsavel: relatorio.tecnicoResponsavel,
        horarios_trabalho: relatorio.horariosTrabalho,
        anexo_imagens: relatorio.anexoImagens,
        calculadora_custos: relatorio.calculadoraCustos,
        assinaturas_digitais: relatorio.assinaturasDigitais,
        criado_em: relatorio.criadoEm.toISOString(),
        atualizado_em: relatorio.atualizadoEm.toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar relatório: ${error.message}`)
    }

    return this.mapearParaRelatorio(data)
  }

  // Buscar todos os relatórios
  static async buscarRelatorios(): Promise<RelatorioManutencao[]> {
    const { data, error } = await supabase
      .from('relatorios_manutencao')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar relatórios: ${error.message}`)
    }

    return data.map(this.mapearParaRelatorio)
  }

  // Buscar relatório por ID
  static async buscarRelatorioPorId(id: string): Promise<RelatorioManutencao | null> {
    const { data, error } = await supabase
      .from('relatorios_manutencao')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Relatório não encontrado
      }
      throw new Error(`Erro ao buscar relatório: ${error.message}`)
    }

    return this.mapearParaRelatorio(data)
  }

  // Atualizar relatório
  static async atualizarRelatorio(id: string, relatorio: RelatorioManutencao): Promise<RelatorioManutencao> {
    const { data, error } = await supabase
      .from('relatorios_manutencao')
      .update({
        titulo: relatorio.dadosCliente.nomeEmpresa + ' - ' + relatorio.dadosServico.modeloEquipamento,
        dados_empresa: relatorio.dadosEmpresa,
        dados_cliente: relatorio.dadosCliente,
        dados_servico: relatorio.dadosServico,
        acoes_realizadas: relatorio.acoesRealizadas,
        tecnico_responsavel: relatorio.tecnicoResponsavel,
        horarios_trabalho: relatorio.horariosTrabalho,
        anexo_imagens: relatorio.anexoImagens,
        calculadora_custos: relatorio.calculadoraCustos,
        assinaturas_digitais: relatorio.assinaturasDigitais,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar relatório: ${error.message}`)
    }

    return this.mapearParaRelatorio(data)
  }

  // Excluir relatório
  static async excluirRelatorio(id: string): Promise<void> {
    const { error } = await supabase
      .from('relatorios_manutencao')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao excluir relatório: ${error.message}`)
    }
  }

  // Buscar relatórios por status
  static async buscarRelatoriosPorStatus(status: string): Promise<RelatorioManutencao[]> {
    const { data, error } = await supabase
      .from('relatorios_manutencao')
      .select('*')
      .eq('dados_servico->>status', status)
      .order('criado_em', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar relatórios por status: ${error.message}`)
    }

    return data.map(this.mapearParaRelatorio)
  }

  // Buscar relatórios por cliente
  static async buscarRelatoriosPorCliente(nomeCliente: string): Promise<RelatorioManutencao[]> {
    const { data, error } = await supabase
      .from('relatorios_manutencao')
      .select('*')
      .ilike('dados_cliente->>nomeEmpresa', `%${nomeCliente}%`)
      .order('criado_em', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar relatórios por cliente: ${error.message}`)
    }

    return data.map(this.mapearParaRelatorio)
  }

  // Mapear dados do banco para o tipo RelatorioManutencao
  private static mapearParaRelatorio(data: any): RelatorioManutencao {
    return {
      id: data.id,
      dadosEmpresa: data.dados_empresa,
      dadosCliente: data.dados_cliente,
      dadosServico: data.dados_servico,
      acoesRealizadas: data.acoes_realizadas,
      tecnicoResponsavel: data.tecnico_responsavel,
      horariosTrabalho: data.horarios_trabalho,
      anexoImagens: data.anexo_imagens || [],
      calculadoraCustos: data.calculadora_custos,
      assinaturasDigitais: data.assinaturas_digitais,
      criadoEm: new Date(data.criado_em),
      atualizadoEm: new Date(data.atualizado_em)
    }
  }
}