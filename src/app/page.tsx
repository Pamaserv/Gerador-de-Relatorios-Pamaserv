'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, 
  User, 
  Wrench, 
  Settings, 
  UserCheck, 
  Clock, 
  Camera, 
  Calculator,
  FileSignature,
  Plus,
  Eye,
  Download,
  Search,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  PenTool,
  ChevronDown,
  Edit,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Timer,
  DollarSign,
  Trash2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRelatorios } from '@/hooks/useRelatorios'
import { RelatorioManutencao } from '@/lib/types'
import { ImageUpload, TabelaPrecos, AssinaturaCanvas } from '@/components/FormComponents'

export default function PamaservPage() {
  const { relatorios, adicionarRelatorio, atualizarRelatorio, excluirRelatorio, loading, visualizarRelatorio, salvarRelatorio } = useRelatorios()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [relatorioParaExcluir, setRelatorioParaExcluir] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<RelatorioManutencao>>({
    id: '',
    dadosEmpresa: {
      nomeEmpresa: '',
      logo: '',
      telefone: '',
      cnpj: '',
      email: '',
      site: ''
    },
    dadosCliente: {
      nomeEmpresa: '',
      representante: '',
      cargo: '',
      cidade: '',
      endereco: '',
      dataServico: ''
    },
    dadosServico: {
      status: 'Pendente',
      tipoManutencao: 'Preventiva',
      motivoChamado: '',
      modeloEquipamento: '',
      numeroSerie: '',
      periodoGarantia: ''
    },
    acoesRealizadas: {
      desempenhoEquipamento: '',
      problemasEncontrados: '',
      recomendacoes: ''
    },
    tecnicoResponsavel: {
      nome: '',
      cpf: '',
      especialidade: '',
      nomeEmpresa: ''
    },
    horariosTrabalho: {
      dataServico: '',
      saidaBase: '',
      chegadaCliente: '',
      inicioTrabalho: '',
      horarioAlmoco: '',
      retornoAlmoco: '',
      finalTrabalho: '',
      saidaCliente: '',
      chegadaBase: '',
      totalHoras: ''
    },
    anexoImagens: [],
    calculadoraCustos: {
      custosDeslocamento: {
        distanciaKm: 0,
        valorPorKm: 0,
        hospedagem: 0,
        alimentacao: 0,
        pedagio: 0
      },
      tabelaPrecos: [],
      totais: {
        subtotal: 0,
        custosDeslocamento: 0,
        totalGeral: 0
      }
    },
    assinaturasDigitais: {
      assinaturaEmpresa: '',
      nomeEmpresa: '',
      cargoEmpresa: '',
      assinaturaCliente: '',
      nomeCliente: '',
      cargoCliente: ''
    },
    criadoEm: new Date(),
    atualizadoEm: new Date()
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')

  const filteredRelatorios = relatorios.filter(relatorio => {
    const matchesSearch = relatorio.dadosCliente.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         relatorio.dadosServico.modeloEquipamento.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || relatorio.dadosServico.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'bg-green-500'
      case 'Em Andamento': return 'bg-blue-500'
      case 'Pendente': return 'bg-yellow-500'
      case 'Cancelado': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusCount = (status: string) => {
    return relatorios.filter(r => r.dadosServico.status === status).length
  }

  const handleNovoRelatorio = () => {
    const novoId = `REL-${Date.now()}`
    setFormData({
      ...formData,
      id: novoId,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    })
    setSaveStatus('idle')
    setSaveMessage('')
    setActiveTab('formulario')
  }

  const handleEditarRelatorio = (relatorio: RelatorioManutencao) => {
    setFormData(relatorio)
    setSaveStatus('idle')
    setSaveMessage('')
    setActiveTab('formulario')
  }

  const handleExcluirRelatorio = async (id: string) => {
    try {
      await excluirRelatorio(id)
      setRelatorioParaExcluir(null)
      setSaveStatus('success')
      setSaveMessage('Relatório excluído com sucesso!')
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSaveStatus('idle')
        setSaveMessage('')
      }, 3000)
    } catch (error) {
      console.error('Erro ao excluir relatório:', error)
      setSaveStatus('error')
      setSaveMessage('Erro ao excluir relatório. Tente novamente.')
      setRelatorioParaExcluir(null)
    }
  }

  const calcularTotalHoras = () => {
    const { inicioTrabalho, finalTrabalho, horarioAlmoco, retornoAlmoco } = formData.horariosTrabalho || {}
    
    if (!inicioTrabalho || !finalTrabalho) return '0:00'
    
    const inicio = new Date(`2000-01-01T${inicioTrabalho}:00`)
    const fim = new Date(`2000-01-01T${finalTrabalho}:00`)
    
    let totalMinutos = (fim.getTime() - inicio.getTime()) / (1000 * 60)
    
    // Subtrair tempo de almoço se informado
    if (horarioAlmoco && retornoAlmoco) {
      const saidaAlmoco = new Date(`2000-01-01T${horarioAlmoco}:00`)
      const voltaAlmoco = new Date(`2000-01-01T${retornoAlmoco}:00`)
      const minutosAlmoco = (voltaAlmoco.getTime() - saidaAlmoco.getTime()) / (1000 * 60)
      totalMinutos -= minutosAlmoco
    }
    
    const horas = Math.floor(totalMinutos / 60)
    const minutos = Math.round(totalMinutos % 60)
    
    return `${horas}:${minutos.toString().padStart(2, '0')}`
  }

  const validarFormulario = (): { valido: boolean; erros: string[] } => {
    const erros: string[] = []

    // Validações obrigatórias
    if (!formData.dadosCliente?.nomeEmpresa?.trim()) {
      erros.push('Nome da empresa cliente é obrigatório')
    }
    
    if (!formData.dadosServico?.modeloEquipamento?.trim()) {
      erros.push('Modelo do equipamento é obrigatório')
    }
    
    if (!formData.tecnicoResponsavel?.nome?.trim()) {
      erros.push('Nome do técnico responsável é obrigatório')
    }
    
    if (!formData.dadosCliente?.dataServico) {
      erros.push('Data do serviço é obrigatória')
    }

    return {
      valido: erros.length === 0,
      erros
    }
  }

  const handleSalvarRelatorio = async () => {
    setSaveStatus('saving')
    setSaveMessage('')

    try {
      // Validar formulário
      const { valido, erros } = validarFormulario()
      
      if (!valido) {
        setSaveStatus('error')
        setSaveMessage(`Erro de validação: ${erros.join(', ')}`)
        return
      }

      // Calcular total de horas automaticamente
      const totalHoras = calcularTotalHoras()
      
      // Calcular totais de custos
      const custosDeslocamento = (formData.calculadoraCustos?.custosDeslocamento.distanciaKm || 0) * 
                                (formData.calculadoraCustos?.custosDeslocamento.valorPorKm || 0) +
                                (formData.calculadoraCustos?.custosDeslocamento.hospedagem || 0) +
                                (formData.calculadoraCustos?.custosDeslocamento.alimentacao || 0) +
                                (formData.calculadoraCustos?.custosDeslocamento.pedagio || 0)
      
      const subtotal = formData.calculadoraCustos?.tabelaPrecos.reduce((total, item) => total + item.precoTotal, 0) || 0
      const totalGeral = subtotal + custosDeslocamento
      
      const relatorioCompleto: RelatorioManutencao = {
        ...formData as RelatorioManutencao,
        horariosTrabalho: {
          ...formData.horariosTrabalho!,
          totalHoras
        },
        calculadoraCustos: {
          ...formData.calculadoraCustos!,
          totais: {
            subtotal,
            custosDeslocamento,
            totalGeral
          }
        },
        atualizadoEm: new Date()
      }
      
      // Verificar se é atualização ou novo relatório
      const existeRelatorio = relatorios.find(r => r.id === formData.id)
      
      if (existeRelatorio) {
        await atualizarRelatorio(formData.id!, relatorioCompleto)
        setSaveMessage('Relatório atualizado com sucesso!')
      } else {
        await adicionarRelatorio(relatorioCompleto)
        setSaveMessage('Relatório salvo com sucesso!')
      }
      
      setSaveStatus('success')
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        setActiveTab('dashboard')
        // Reset form
        setFormData({
          id: '',
          dadosEmpresa: { nomeEmpresa: '', logo: '', telefone: '', cnpj: '', email: '', site: '' },
          dadosCliente: { nomeEmpresa: '', representante: '', cargo: '', cidade: '', endereco: '', dataServico: '' },
          dadosServico: { status: 'Pendente', tipoManutencao: 'Preventiva', motivoChamado: '', modeloEquipamento: '', numeroSerie: '', periodoGarantia: '' },
          acoesRealizadas: { desempenhoEquipamento: '', problemasEncontrados: '', recomendacoes: '' },
          tecnicoResponsavel: { nome: '', cpf: '', especialidade: '', nomeEmpresa: '' },
          horariosTrabalho: { dataServico: '', saidaBase: '', chegadaCliente: '', inicioTrabalho: '', horarioAlmoco: '', retornoAlmoco: '', finalTrabalho: '', saidaCliente: '', chegadaBase: '', totalHoras: '' },
          anexoImagens: [],
          calculadoraCustos: { custosDeslocamento: { distanciaKm: 0, valorPorKm: 0, hospedagem: 0, alimentacao: 0, pedagio: 0 }, tabelaPrecos: [], totais: { subtotal: 0, custosDeslocamento: 0, totalGeral: 0 } },
          assinaturasDigitais: { assinaturaEmpresa: '', nomeEmpresa: '', cargoEmpresa: '', assinaturaCliente: '', nomeCliente: '', cargoCliente: '' },
          criadoEm: new Date(),
          atualizadoEm: new Date()
        })
        setSaveStatus('idle')
        setSaveMessage('')
      }, 2000)
      
    } catch (error) {
      console.error('Erro ao salvar relatório:', error)
      setSaveStatus('error')
      setSaveMessage('Erro ao salvar relatório. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header - Responsivo */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">PAMASERV</h1>
              <p className="text-sm sm:text-base text-gray-600">Sistema de Relatórios de Manutenção</p>
            </div>
          </div>
        </div>

        {/* Status de Salvamento Global */}
        {saveStatus !== 'idle' && (
          <Alert className={`mb-4 ${
            saveStatus === 'success' ? 'border-green-200 bg-green-50' :
            saveStatus === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
              {saveStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
              {saveStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
              <AlertDescription className={`text-sm ${
                saveStatus === 'success' ? 'text-green-800' :
                saveStatus === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {saveStatus === 'saving' ? 'Processando...' : saveMessage}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {relatorioParaExcluir && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  Confirmar Exclusão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setRelatorioParaExcluir(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleExcluirRelatorio(relatorioParaExcluir)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* TabsList Responsivo */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 min-w-[600px] sm:min-w-full">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Dashboard</span>
                <span className="xs:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="formulario" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Novo Relatório</span>
                <span className="xs:hidden">Novo</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Pré-visualização</span>
                <span className="xs:hidden">Preview</span>
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <FileSignature className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Relatórios</span>
                <span className="xs:hidden">Lista</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard - Grid Responsivo */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Concluídos</p>
                      <p className="text-2xl sm:text-3xl font-bold">{getStatusCount('Concluído')}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Em Andamento</p>
                      <p className="text-2xl sm:text-3xl font-bold">{getStatusCount('Em Andamento')}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Pendentes</p>
                      <p className="text-2xl sm:text-3xl font-bold">{getStatusCount('Pendente')}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total</p>
                      <p className="text-2xl sm:text-3xl font-bold">{relatorios.length}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileSignature className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileSignature className="w-5 h-5" />
                  Relatórios Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {relatorios.slice(0, 5).map((relatorio) => (
                    <div key={relatorio.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(relatorio.dadosServico.status)}`} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{relatorio.dadosCliente.nomeEmpresa}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{relatorio.dadosServico.modeloEquipamento}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <div className="text-left sm:text-right">
                          <Badge variant="outline" className="text-xs">{relatorio.dadosServico.status}</Badge>
                          <p className="text-xs text-gray-600 mt-1">
                            {relatorio.dadosCliente.dataServico}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {relatorios.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileSignature className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">Nenhum relatório encontrado</p>
                      <Button onClick={handleNovoRelatorio} className="mt-4" size="sm">
                        Criar Primeiro Relatório
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pré-visualização - Layout Responsivo */}
          <TabsContent value="preview" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="w-5 h-5" />
                  Pré-visualização do Relatório
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600">
                  Visualização completa de todas as informações que serão incluídas no relatório final
                </p>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                {/* Cabeçalho do Relatório */}
                <div className="text-center border-b pb-4 sm:pb-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">RELATÓRIO DE MANUTENÇÃO</h1>
                  <p className="text-sm sm:text-base text-gray-600">PAMASERV - Sistema de Relatórios de Manutenção</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Relatório ID: {formData.id || 'Não definido'} | 
                    Gerado em: {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* 1. Dados da Empresa */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    1. Dados da Empresa
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm sm:text-base">Nome da Empresa:</span>
                        </div>
                        <span className="text-sm sm:text-base pl-5 sm:pl-0">{formData.dadosEmpresa?.nomeEmpresa || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm sm:text-base">Telefone:</span>
                        </div>
                        <span className="text-sm sm:text-base pl-5 sm:pl-0">{formData.dadosEmpresa?.telefone || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm sm:text-base">CNPJ:</span>
                        </div>
                        <span className="text-sm sm:text-base pl-5 sm:pl-0">{formData.dadosEmpresa?.cnpj || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm sm:text-base">Email:</span>
                        </div>
                        <span className="text-sm sm:text-base pl-5 sm:pl-0 break-all">{formData.dadosEmpresa?.email || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm sm:text-base">Site:</span>
                        </div>
                        <span className="text-sm sm:text-base pl-5 sm:pl-0 break-all">{formData.dadosEmpresa?.site || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Dados do Cliente */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    2. Dados do Cliente
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Empresa:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.dadosCliente?.nomeEmpresa || 'Não informado'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Representante:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.dadosCliente?.representante || 'Não informado'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Cargo:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.dadosCliente?.cargo || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm sm:text-base">Data do Serviço:</span>
                        </div>
                        <span className="text-sm sm:text-base pl-5 sm:pl-0">{formData.dadosCliente?.dataServico || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm sm:text-base">Cidade:</span>
                        </div>
                        <span className="text-sm sm:text-base pl-5 sm:pl-0">{formData.dadosCliente?.cidade || 'Não informado'}</span>
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <span className="font-medium text-sm sm:text-base">Endereço:</span>
                        <span className="ml-2 text-sm sm:text-base break-words">{formData.dadosCliente?.endereco || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Técnico Responsável */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    3. Técnico Responsável
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Nome:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.tecnicoResponsavel?.nome || 'Não informado'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Empresa:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.tecnicoResponsavel?.nomeEmpresa || 'Não informado'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Especialidade:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.tecnicoResponsavel?.especialidade || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Dados do Serviço */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
                    4. Dados do Serviço
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(formData.dadosServico?.status || 'Pendente')} text-white border-0 text-xs`}>
                          {formData.dadosServico?.status || 'Pendente'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Tipo de Manutenção:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.dadosServico?.tipoManutencao || 'Não informado'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Modelo do Equipamento:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.dadosServico?.modeloEquipamento || 'Não informado'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Número de Série:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.dadosServico?.numeroSerie || 'Não informado'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-sm sm:text-base">Período de Garantia:</span>
                        <span className="ml-2 text-sm sm:text-base">{formData.dadosServico?.periodoGarantia || 'Não informado'}</span>
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <span className="font-medium text-sm sm:text-base">Motivo do Chamado:</span>
                        <p className="mt-2 text-xs sm:text-sm text-gray-700 break-words">{formData.dadosServico?.motivoChamado || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Ações Realizadas */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                    5. Ações Realizadas
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4">
                    <div>
                      <span className="font-medium text-sm sm:text-base">Desempenho do Equipamento:</span>
                      <p className="mt-2 text-xs sm:text-sm text-gray-700 break-words">{formData.acoesRealizadas?.desempenhoEquipamento || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-sm sm:text-base">Problemas Encontrados:</span>
                      <p className="mt-2 text-xs sm:text-sm text-gray-700 break-words">{formData.acoesRealizadas?.problemasEncontrados || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-sm sm:text-base">Recomendações:</span>
                      <p className="mt-2 text-xs sm:text-sm text-gray-700 break-words">{formData.acoesRealizadas?.recomendacoes || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {/* 6. Horários de Trabalho */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    6. Horários de Trabalho
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Data:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.dataServico || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Saída da Base:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.saidaBase || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Chegada ao Cliente:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.chegadaCliente || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Início do Trabalho:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.inicioTrabalho || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Horário do Almoço:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.horarioAlmoco || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Retorno do Almoço:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.retornoAlmoco || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Final do Trabalho:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.finalTrabalho || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Saída do Cliente:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.saidaCliente || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="font-medium text-sm">Chegada à Base:</span>
                        </div>
                        <span className="text-sm pl-5 sm:pl-0">{formData.horariosTrabalho?.chegadaBase || 'Não informado'}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800 text-sm sm:text-base">Total de Horas Trabalhadas:</span>
                        <span className="text-blue-800 font-bold text-sm sm:text-base">{calcularTotalHoras()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Custos - Layout Responsivo */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                    7. Custos do Serviço
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4">
                    {/* Custos de Deslocamento */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Custos de Deslocamento</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                        <div>
                          <span className="text-xs sm:text-sm font-medium">Distância:</span>
                          <p className="text-sm sm:text-base">{formData.calculadoraCustos?.custosDeslocamento.distanciaKm || 0} km</p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium">Valor por km:</span>
                          <p className="text-sm sm:text-base">R$ {(formData.calculadoraCustos?.custosDeslocamento.valorPorKm || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium">Hospedagem:</span>
                          <p className="text-sm sm:text-base">R$ {(formData.calculadoraCustos?.custosDeslocamento.hospedagem || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium">Alimentação:</span>
                          <p className="text-sm sm:text-base">R$ {(formData.calculadoraCustos?.custosDeslocamento.alimentacao || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium">Pedágio:</span>
                          <p className="text-sm sm:text-base">R$ {(formData.calculadoraCustos?.custosDeslocamento.pedagio || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tabela de Preços - Responsiva */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Serviços Realizados</h3>
                      {formData.calculadoraCustos?.tabelaPrecos && formData.calculadoraCustos.tabelaPrecos.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Descrição</th>
                                <th className="border border-gray-300 p-2 text-center">Qtd</th>
                                <th className="border border-gray-300 p-2 text-right">Preço Unit.</th>
                                <th className="border border-gray-300 p-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.calculadoraCustos.tabelaPrecos.map((item, index) => (
                                <tr key={index}>
                                  <td className="border border-gray-300 p-2 break-words">{item.descricao}</td>
                                  <td className="border border-gray-300 p-2 text-center">{item.quantidade}</td>
                                  <td className="border border-gray-300 p-2 text-right">R$ {item.precoUnitario.toFixed(2)}</td>
                                  <td className="border border-gray-300 p-2 text-right">R$ {item.precoTotal.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Nenhum serviço adicionado</p>
                      )}
                    </div>

                    {/* Resumo de Custos - Responsivo */}
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                        Resumo Financeiro
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-green-600">Subtotal Serviços</p>
                          <p className="text-lg sm:text-xl font-bold text-green-800">
                            R$ {(formData.calculadoraCustos?.tabelaPrecos?.reduce((total, item) => total + item.precoTotal, 0) || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-green-600">Custos Deslocamento</p>
                          <p className="text-lg sm:text-xl font-bold text-green-800">
                            R$ {(
                              (formData.calculadoraCustos?.custosDeslocamento.distanciaKm || 0) * 
                              (formData.calculadoraCustos?.custosDeslocamento.valorPorKm || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.hospedagem || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.alimentacao || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.pedagio || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-green-600">Total Geral</p>
                          <p className="text-xl sm:text-2xl font-bold text-green-800">
                            R$ {(
                              (formData.calculadoraCustos?.tabelaPrecos?.reduce((total, item) => total + item.precoTotal, 0) || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.distanciaKm || 0) * 
                              (formData.calculadoraCustos?.custosDeslocamento.valorPorKm || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.hospedagem || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.alimentacao || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.pedagio || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Imagens - Grid Responsivo */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    8. Anexo de Imagens
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    {formData.anexoImagens && formData.anexoImagens.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {formData.anexoImagens.map((imagem, index) => (
                          <div key={index} className="space-y-2">
                            <img 
                              src={imagem.url} 
                              alt={imagem.nome}
                              className="w-full h-32 sm:h-48 object-cover rounded-lg border"
                            />
                            <p className="text-xs sm:text-sm text-gray-600 text-center truncate">{imagem.nome}</p>
                            {imagem.descricao && (
                              <p className="text-xs text-gray-500 text-center break-words">{imagem.descricao}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">Nenhuma imagem anexada</p>
                    )}
                  </div>
                </div>

                {/* 9. Assinaturas - Layout Responsivo */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
                    9. Assinaturas Digitais
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      {/* Assinatura do Técnico */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">Técnico Responsável</h3>
                        {formData.assinaturasDigitais?.assinaturaEmpresa ? (
                          <div className="space-y-3">
                            <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4 bg-white">
                              <img 
                                src={formData.assinaturasDigitais.assinaturaEmpresa} 
                                alt="Assinatura do Técnico"
                                className="max-w-full h-16 sm:h-24 mx-auto"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base">{formData.assinaturasDigitais.nomeEmpresa || 'Nome não informado'}</p>
                              <p className="text-xs sm:text-sm text-gray-600">{formData.assinaturasDigitais.cargoEmpresa || 'Cargo não informado'}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-gray-500">
                            <PenTool className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Assinatura não disponível</p>
                          </div>
                        )}
                      </div>

                      {/* Assinatura do Cliente */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">Cliente</h3>
                        {formData.assinaturasDigitais?.assinaturaCliente ? (
                          <div className="space-y-3">
                            <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4 bg-white">
                              <img 
                                src={formData.assinaturasDigitais.assinaturaCliente} 
                                alt="Assinatura do Cliente"
                                className="max-w-full h-16 sm:h-24 mx-auto"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base">{formData.assinaturasDigitais.nomeCliente || 'Nome não informado'}</p>
                              <p className="text-xs sm:text-sm text-gray-600">{formData.assinaturasDigitais.cargoCliente || 'Cargo não informado'}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-gray-500">
                            <PenTool className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Assinatura não disponível</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Relatório */}
                <div className="text-center border-t pt-4 sm:pt-6 text-xs sm:text-sm text-gray-500">
                  <p>Este relatório foi gerado automaticamente pelo sistema PAMASERV</p>
                  <p>Data de geração: {new Date().toLocaleString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formulário - Layout Responsivo */}
          <TabsContent value="formulario" className="space-y-4 sm:space-y-6">
            {/* Status de Salvamento */}
            {saveStatus !== 'idle' && (
              <Alert className={`${
                saveStatus === 'success' ? 'border-green-200 bg-green-50' :
                saveStatus === 'error' ? 'border-red-200 bg-red-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-center gap-2">
                  {saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saveStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {saveStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  <AlertDescription className={`text-sm ${
                    saveStatus === 'success' ? 'text-green-800' :
                    saveStatus === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {saveStatus === 'saving' ? 'Salvando relatório...' : saveMessage}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Plus className="w-5 h-5" />
                  {formData.id && relatorios.find(r => r.id === formData.id) ? 'Editar Relatório de Manutenção' : 'Novo Relatório de Manutenção'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="empresa" className="space-y-4 sm:space-y-6">
                  {/* TabsList com scroll horizontal em mobile */}
                  <div className="w-full overflow-x-auto">
                    <TabsList className="inline-flex h-auto min-w-full p-1 bg-muted rounded-lg">
                      <div className="flex flex-nowrap gap-1 w-full min-w-max">
                        <TabsTrigger value="empresa" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <Building2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Empresa</span>
                        </TabsTrigger>
                        <TabsTrigger value="cliente" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <User className="w-3 h-3" />
                          <span className="hidden sm:inline">Cliente</span>
                        </TabsTrigger>
                        <TabsTrigger value="tecnico" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <UserCheck className="w-3 h-3" />
                          <span className="hidden sm:inline">Técnico</span>
                        </TabsTrigger>
                        <TabsTrigger value="servico" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <Wrench className="w-3 h-3" />
                          <span className="hidden sm:inline">Serviço</span>
                        </TabsTrigger>
                        <TabsTrigger value="acoes" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <Settings className="w-3 h-3" />
                          <span className="hidden sm:inline">Ações</span>
                        </TabsTrigger>
                        <TabsTrigger value="horarios" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          <span className="hidden sm:inline">Horários</span>
                        </TabsTrigger>
                        <TabsTrigger value="custos" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <Calculator className="w-3 h-3" />
                          <span className="hidden sm:inline">Custos</span>
                        </TabsTrigger>
                        <TabsTrigger value="imagens" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <Camera className="w-3 h-3" />
                          <span className="hidden sm:inline">Imagens</span>
                        </TabsTrigger>
                        <TabsTrigger value="assinaturas" className="flex items-center gap-1 text-xs px-2 py-2 whitespace-nowrap">
                          <PenTool className="w-3 h-3" />
                          <span className="hidden sm:inline">Assinaturas</span>
                        </TabsTrigger>
                      </div>
                    </TabsList>
                  </div>

                  {/* Seção 1: Dados da Empresa */}
                  <TabsContent value="empresa" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeEmpresaDados" className="text-sm">Nome da Empresa</Label>
                        <Input
                          id="nomeEmpresaDados"
                          value={formData.dadosEmpresa?.nomeEmpresa || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosEmpresa: { ...formData.dadosEmpresa!, nomeEmpresa: e.target.value }
                          })}
                          placeholder="Nome da sua empresa"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone" className="text-sm">Telefone de Contato</Label>
                        <Input
                          id="telefone"
                          value={formData.dadosEmpresa?.telefone || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosEmpresa: { ...formData.dadosEmpresa!, telefone: e.target.value }
                          })}
                          placeholder="(11) 99999-9999"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cnpj" className="text-sm">CNPJ da Empresa</Label>
                        <Input
                          id="cnpj"
                          value={formData.dadosEmpresa?.cnpj || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosEmpresa: { ...formData.dadosEmpresa!, cnpj: e.target.value }
                          })}
                          placeholder="00.000.000/0001-00"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">Email Corporativo</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.dadosEmpresa?.email || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosEmpresa: { ...formData.dadosEmpresa!, email: e.target.value }
                          })}
                          placeholder="contato@empresa.com"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site" className="text-sm">Site da Empresa</Label>
                        <Input
                          id="site"
                          value={formData.dadosEmpresa?.site || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosEmpresa: { ...formData.dadosEmpresa!, site: e.target.value }
                          })}
                          placeholder="www.empresa.com"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Seção 2: Dados do Cliente */}
                  <TabsContent value="cliente" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeEmpresa" className="text-sm">Nome da Empresa Cliente *</Label>
                        <Input
                          id="nomeEmpresa"
                          value={formData.dadosCliente?.nomeEmpresa || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosCliente: { ...formData.dadosCliente!, nomeEmpresa: e.target.value }
                          })}
                          placeholder="Nome da empresa cliente"
                          className={`text-sm ${!formData.dadosCliente?.nomeEmpresa?.trim() ? 'border-red-300' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="representante" className="text-sm">Representante Responsável</Label>
                        <Input
                          id="representante"
                          value={formData.dadosCliente?.representante || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosCliente: { ...formData.dadosCliente!, representante: e.target.value }
                          })}
                          placeholder="Nome do representante"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo" className="text-sm">Cargo do Representante</Label>
                        <Input
                          id="cargo"
                          value={formData.dadosCliente?.cargo || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosCliente: { ...formData.dadosCliente!, cargo: e.target.value }
                          })}
                          placeholder="Cargo do representante"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cidade" className="text-sm">Cidade do Serviço</Label>
                        <Input
                          id="cidade"
                          value={formData.dadosCliente?.cidade || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosCliente: { ...formData.dadosCliente!, cidade: e.target.value }
                          })}
                          placeholder="Cidade onde foi prestado o serviço"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="endereco" className="text-sm">Endereço Completo</Label>
                        <Input
                          id="endereco"
                          value={formData.dadosCliente?.endereco || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosCliente: { ...formData.dadosCliente!, endereco: e.target.value }
                          })}
                          placeholder="Endereço completo do cliente"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataServico" className="text-sm">Data do Serviço *</Label>
                        <Input
                          id="dataServico"
                          type="date"
                          value={formData.dadosCliente?.dataServico || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosCliente: { ...formData.dadosCliente!, dataServico: e.target.value }
                          })}
                          className={`text-sm ${!formData.dadosCliente?.dataServico ? 'border-red-300' : ''}`}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Seção 3: Técnico Responsável */}
                  <TabsContent value="tecnico" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeTecnico" className="text-sm">Nome Completo do Técnico *</Label>
                        <Input
                          id="nomeTecnico"
                          value={formData.tecnicoResponsavel?.nome || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            tecnicoResponsavel: { ...formData.tecnicoResponsavel!, nome: e.target.value }
                          })}
                          placeholder="Nome completo do técnico"
                          className={`text-sm ${!formData.tecnicoResponsavel?.nome?.trim() ? 'border-red-300' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nomeEmpresaTecnico" className="text-sm">Nome da Empresa</Label>
                        <Input
                          id="nomeEmpresaTecnico"
                          value={formData.tecnicoResponsavel?.nomeEmpresa || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            tecnicoResponsavel: { ...formData.tecnicoResponsavel!, nomeEmpresa: e.target.value }
                          })}
                          placeholder="Nome da empresa do técnico"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="especialidade" className="text-sm">Especialidade ou Área de Atuação</Label>
                        <Input
                          id="especialidade"
                          value={formData.tecnicoResponsavel?.especialidade || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            tecnicoResponsavel: { ...formData.tecnicoResponsavel!, especialidade: e.target.value }
                          })}
                          placeholder="Especialidade do técnico"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Seção 4: Dados do Serviço */}
                  <TabsContent value="servico" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm">Status</Label>
                        <Select
                          value={formData.dadosServico?.status || 'Pendente'}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            dadosServico: { ...formData.dadosServico!, status: value as 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado' }
                          })}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                            <SelectItem value="Concluído">Concluído</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipoManutencao" className="text-sm">Tipo de Manutenção</Label>
                        <Select
                          value={formData.dadosServico?.tipoManutencao || 'Preventiva'}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            dadosServico: { ...formData.dadosServico!, tipoManutencao: value as 'Preventiva' | 'Corretiva' | 'Emergencial' | 'Instalação' }
                          })}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Preventiva">Preventiva</SelectItem>
                            <SelectItem value="Corretiva">Corretiva</SelectItem>
                            <SelectItem value="Emergencial">Emergencial</SelectItem>
                            <SelectItem value="Instalação">Instalação</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="motivoChamado" className="text-sm">Motivo do Chamado</Label>
                        <Textarea
                          id="motivoChamado"
                          value={formData.dadosServico?.motivoChamado || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosServico: { ...formData.dadosServico!, motivoChamado: e.target.value }
                          })}
                          placeholder="Descreva o motivo do chamado"
                          className="text-sm"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="modeloEquipamento" className="text-sm">Modelo do Equipamento *</Label>
                        <Input
                          id="modeloEquipamento"
                          value={formData.dadosServico?.modeloEquipamento || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosServico: { ...formData.dadosServico!, modeloEquipamento: e.target.value }
                          })}
                          placeholder="Modelo do equipamento"
                          className={`text-sm ${!formData.dadosServico?.modeloEquipamento?.trim() ? 'border-red-300' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numeroSerie" className="text-sm">Número de Série</Label>
                        <Input
                          id="numeroSerie"
                          value={formData.dadosServico?.numeroSerie || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosServico: { ...formData.dadosServico!, numeroSerie: e.target.value }
                          })}
                          placeholder="Número de série"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodoGarantia" className="text-sm">Período de Garantia</Label>
                        <Input
                          id="periodoGarantia"
                          value={formData.dadosServico?.periodoGarantia || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            dadosServico: { ...formData.dadosServico!, periodoGarantia: e.target.value }
                          })}
                          placeholder="Ex: 12 meses"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Seção 5: Ações Realizadas */}
                  <TabsContent value="acoes" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="desempenhoEquipamento" className="text-sm">Desempenho do Equipamento</Label>
                        <Textarea
                          id="desempenhoEquipamento"
                          value={formData.acoesRealizadas?.desempenhoEquipamento || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            acoesRealizadas: { ...formData.acoesRealizadas!, desempenhoEquipamento: e.target.value }
                          })}
                          placeholder="Descreva o desempenho do equipamento"
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="problemasEncontrados" className="text-sm">Problemas Encontrados</Label>
                        <Textarea
                          id="problemasEncontrados"
                          value={formData.acoesRealizadas?.problemasEncontrados || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            acoesRealizadas: { ...formData.acoesRealizadas!, problemasEncontrados: e.target.value }
                          })}
                          placeholder="Descreva os problemas encontrados"
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recomendacoes" className="text-sm">Recomendações para o Cliente</Label>
                        <Textarea
                          id="recomendacoes"
                          value={formData.acoesRealizadas?.recomendacoes || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            acoesRealizadas: { ...formData.acoesRealizadas!, recomendacoes: e.target.value }
                          })}
                          placeholder="Recomendações para o cliente"
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Seção 6: Horários de Trabalho */}
                  <TabsContent value="horarios" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataServicoHorario" className="text-sm">Data do Serviço</Label>
                        <Input
                          id="dataServicoHorario"
                          type="date"
                          value={formData.horariosTrabalho?.dataServico || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, dataServico: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="saidaBase" className="text-sm">Saída da Base</Label>
                        <Input
                          id="saidaBase"
                          type="time"
                          value={formData.horariosTrabalho?.saidaBase || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, saidaBase: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chegadaCliente" className="text-sm">Chegada ao Cliente</Label>
                        <Input
                          id="chegadaCliente"
                          type="time"
                          value={formData.horariosTrabalho?.chegadaCliente || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, chegadaCliente: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inicioTrabalho" className="text-sm">Início do Trabalho</Label>
                        <Input
                          id="inicioTrabalho"
                          type="time"
                          value={formData.horariosTrabalho?.inicioTrabalho || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, inicioTrabalho: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="horarioAlmoco" className="text-sm">Horário do Almoço</Label>
                        <Input
                          id="horarioAlmoco"
                          type="time"
                          value={formData.horariosTrabalho?.horarioAlmoco || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, horarioAlmoco: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="retornoAlmoco" className="text-sm">Retorno do Almoço</Label>
                        <Input
                          id="retornoAlmoco"
                          type="time"
                          value={formData.horariosTrabalho?.retornoAlmoco || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, retornoAlmoco: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="finalTrabalho" className="text-sm">Final do Trabalho</Label>
                        <Input
                          id="finalTrabalho"
                          type="time"
                          value={formData.horariosTrabalho?.finalTrabalho || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, finalTrabalho: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="saidaCliente" className="text-sm">Saída do Cliente</Label>
                        <Input
                          id="saidaCliente"
                          type="time"
                          value={formData.horariosTrabalho?.saidaCliente || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, saidaCliente: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chegadaBase" className="text-sm">Chegada à Base</Label>
                        <Input
                          id="chegadaBase"
                          type="time"
                          value={formData.horariosTrabalho?.chegadaBase || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            horariosTrabalho: { ...formData.horariosTrabalho!, chegadaBase: e.target.value }
                          })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-blue-700">
                        <strong>Total de Horas:</strong> {calcularTotalHoras()} (calculado automaticamente)
                      </p>
                    </div>
                  </TabsContent>

                  {/* Seção 7: Calculadora de Custos */}
                  <TabsContent value="custos" className="space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold">Custos de Deslocamento</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="distanciaKm" className="text-sm">Distância (km)</Label>
                          <Input
                            id="distanciaKm"
                            type="number"
                            value={formData.calculadoraCustos?.custosDeslocamento.distanciaKm || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              calculadoraCustos: {
                                ...formData.calculadoraCustos!,
                                custosDeslocamento: {
                                  ...formData.calculadoraCustos!.custosDeslocamento,
                                  distanciaKm: parseFloat(e.target.value) || 0
                                }
                              }
                            })}
                            placeholder="0"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valorPorKm" className="text-sm">Valor por km (R$)</Label>
                          <Input
                            id="valorPorKm"
                            type="number"
                            step="0.01"
                            value={formData.calculadoraCustos?.custosDeslocamento.valorPorKm || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              calculadoraCustos: {
                                ...formData.calculadoraCustos!,
                                custosDeslocamento: {
                                  ...formData.calculadoraCustos!.custosDeslocamento,
                                  valorPorKm: parseFloat(e.target.value) || 0
                                }
                              }
                            })}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hospedagem" className="text-sm">Hospedagem (R$)</Label>
                          <Input
                            id="hospedagem"
                            type="number"
                            step="0.01"
                            value={formData.calculadoraCustos?.custosDeslocamento.hospedagem || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              calculadoraCustos: {
                                ...formData.calculadoraCustos!,
                                custosDeslocamento: {
                                  ...formData.calculadoraCustos!.custosDeslocamento,
                                  hospedagem: parseFloat(e.target.value) || 0
                                }
                              }
                            })}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="alimentacao" className="text-sm">Alimentação (R$)</Label>
                          <Input
                            id="alimentacao"
                            type="number"
                            step="0.01"
                            value={formData.calculadoraCustos?.custosDeslocamento.alimentacao || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              calculadoraCustos: {
                                ...formData.calculadoraCustos!,
                                custosDeslocamento: {
                                  ...formData.calculadoraCustos!.custosDeslocamento,
                                  alimentacao: parseFloat(e.target.value) || 0
                                }
                              }
                            })}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pedagio" className="text-sm">Pedágio (R$)</Label>
                          <Input
                            id="pedagio"
                            type="number"
                            step="0.01"
                            value={formData.calculadoraCustos?.custosDeslocamento.pedagio || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              calculadoraCustos: {
                                ...formData.calculadoraCustos!,
                                custosDeslocamento: {
                                  ...formData.calculadoraCustos!.custosDeslocamento,
                                  pedagio: parseFloat(e.target.value) || 0
                                }
                              }
                            })}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <TabelaPrecos
                      items={formData.calculadoraCustos?.tabelaPrecos || []}
                      onItemsChange={(items) => setFormData({
                        ...formData,
                        calculadoraCustos: {
                          ...formData.calculadoraCustos!,
                          tabelaPrecos: items
                        }
                      })}
                    />

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-lg border border-green-200">
                      <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-4">Resumo de Custos</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-green-600">Subtotal Serviços</p>
                          <p className="text-lg sm:text-2xl font-bold text-green-800">
                            R$ {(formData.calculadoraCustos?.tabelaPrecos.reduce((total, item) => total + item.precoTotal, 0) || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-green-600">Custos Deslocamento</p>
                          <p className="text-lg sm:text-2xl font-bold text-green-800">
                            R$ {(
                              (formData.calculadoraCustos?.custosDeslocamento.distanciaKm || 0) * 
                              (formData.calculadoraCustos?.custosDeslocamento.valorPorKm || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.hospedagem || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.alimentacao || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.pedagio || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-green-600">Total Geral</p>
                          <p className="text-2xl sm:text-3xl font-bold text-green-800">
                            R$ {(
                              (formData.calculadoraCustos?.tabelaPrecos.reduce((total, item) => total + item.precoTotal, 0) || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.distanciaKm || 0) * 
                              (formData.calculadoraCustos?.custosDeslocamento.valorPorKm || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.hospedagem || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.alimentacao || 0) +
                              (formData.calculadoraCustos?.custosDeslocamento.pedagio || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Seção 8: Anexo de Imagens */}
                  <TabsContent value="imagens" className="space-y-4">
                    <ImageUpload
                      images={formData.anexoImagens || []}
                      onImagesChange={(images) => setFormData({
                        ...formData,
                        anexoImagens: images
                      })}
                      maxSize={5}
                      maxImages={10}
                    />
                  </TabsContent>

                  {/* Seção 9: Assinaturas Digitais */}
                  <TabsContent value="assinaturas" className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      {/* Assinatura do Técnico */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                            Assinatura do Técnico
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeTecnicoAssinatura" className="text-sm">Nome do Técnico</Label>
                            <Input
                              id="nomeTecnicoAssinatura"
                              value={formData.assinaturasDigitais?.nomeEmpresa || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                assinaturasDigitais: {
                                  ...formData.assinaturasDigitais!,
                                  nomeEmpresa: e.target.value
                                }
                              })}
                              placeholder="Nome completo do técnico"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cargoTecnicoAssinatura" className="text-sm">Cargo/Função</Label>
                            <Input
                              id="cargoTecnicoAssinatura"
                              value={formData.assinaturasDigitais?.cargoEmpresa || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                assinaturasDigitais: {
                                  ...formData.assinaturasDigitais!,
                                  cargoEmpresa: e.target.value
                                }
                              })}
                              placeholder="Ex: Técnico em Manutenção"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Assinatura Digital</Label>
                            <AssinaturaCanvas
                              assinatura={formData.assinaturasDigitais?.assinaturaEmpresa || ''}
                              onAssinaturaChange={(assinatura) => setFormData({
                                ...formData,
                                assinaturasDigitais: {
                                  ...formData.assinaturasDigitais!,
                                  assinaturaEmpresa: assinatura
                                }
                              })}
                              width={300}
                              height={120}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Assinatura do Cliente */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            Assinatura do Cliente
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeClienteAssinatura" className="text-sm">Nome do Cliente</Label>
                            <Input
                              id="nomeClienteAssinatura"
                              value={formData.assinaturasDigitais?.nomeCliente || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                assinaturasDigitais: {
                                  ...formData.assinaturasDigitais!,
                                  nomeCliente: e.target.value
                                }
                              })}
                              placeholder="Nome completo do cliente"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cargoClienteAssinatura" className="text-sm">Cargo/Função</Label>
                            <Input
                              id="cargoClienteAssinatura"
                              value={formData.assinaturasDigitais?.cargoCliente || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                assinaturasDigitais: {
                                  ...formData.assinaturasDigitais!,
                                  cargoCliente: e.target.value
                                }
                              })}
                              placeholder="Ex: Gerente de Manutenção"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Assinatura Digital</Label>
                            <AssinaturaCanvas
                              assinatura={formData.assinaturasDigitais?.assinaturaCliente || ''}
                              onAssinaturaChange={(assinatura) => setFormData({
                                ...formData,
                                assinaturasDigitais: {
                                  ...formData.assinaturasDigitais!,
                                  assinaturaCliente: assinatura
                                }
                              })}
                              width={300}
                              height={120}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Informações sobre as assinaturas */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Instruções para Assinatura</h4>
                            <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                              <li>• Use o mouse ou toque na tela para desenhar sua assinatura</li>
                              <li>• As assinaturas são salvas automaticamente no relatório</li>
                              <li>• Clique em "Limpar" para refazer a assinatura</li>
                              <li>• Preencha nome e cargo para identificação completa</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Botões de Ação - Layout Responsivo */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('dashboard')} className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('preview')}
                    className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 border-blue-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Pré-visualizar
                  </Button>
                  {formData.id && relatorios.find(r => r.id === formData.id) && (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => visualizarRelatorio(formData.id!)}
                        className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 border-blue-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline"
                            className="w-full sm:w-auto bg-green-50 hover:bg-green-100 border-green-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => salvarRelatorio(formData.id!, 'html')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Baixar como HTML
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => salvarRelatorio(formData.id!, 'pdf')}>
                            <Download className="w-4 h-4 mr-2" />
                            Baixar como PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => salvarRelatorio(formData.id!, 'json')}>
                            <Download className="w-4 h-4 mr-2" />
                            Baixar como JSON
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                  <Button 
                    onClick={handleSalvarRelatorio} 
                    disabled={saveStatus === 'saving'}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Relatório
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista de Relatórios - Layout Responsivo */}
          <TabsContent value="relatorios" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileSignature className="w-5 h-5" />
                  Todos os Relatórios
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por cliente ou equipamento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {filteredRelatorios.map((relatorio) => (
                    <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getStatusColor(relatorio.dadosServico.status)}`} />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm sm:text-lg truncate">{relatorio.dadosCliente.nomeEmpresa}</h3>
                              <p className="text-xs sm:text-base text-gray-600 truncate">{relatorio.dadosServico.modeloEquipamento}</p>
                              <p className="text-xs text-gray-500">
                                {relatorio.dadosCliente.cidade} • {relatorio.dadosCliente.dataServico}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <div className="text-left sm:text-right">
                              <Badge variant="outline" className={`${getStatusColor(relatorio.dadosServico.status)} text-white border-0 text-xs`}>
                                {relatorio.dadosServico.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {relatorio.dadosServico.tipoManutencao}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditarRelatorio(relatorio)}
                                title="Editar relatório"
                                className="hover:bg-yellow-50 hover:border-yellow-300"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => visualizarRelatorio(relatorio.id)}
                                title="Visualizar relatório"
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => salvarRelatorio(relatorio.id, 'pdf')}
                                title="Baixar PDF"
                                className="hover:bg-green-50 hover:border-green-300"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                PDF
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setRelatorioParaExcluir(relatorio.id)}
                                title="Excluir relatório"
                                className="hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredRelatorios.length === 0 && (
                    <div className="text-center py-8 sm:py-12 text-gray-500">
                      <FileSignature className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-lg mb-2">Nenhum relatório encontrado</p>
                      <p className="text-xs sm:text-sm">Tente ajustar os filtros ou criar um novo relatório</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}