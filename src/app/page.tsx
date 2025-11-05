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

// Tipos simplificados
interface RelatorioManutencao {
  id: string
  dadosEmpresa: {
    nomeEmpresa: string
    logo: string
    telefone: string
    cnpj: string
    email: string
    site: string
  }
  dadosCliente: {
    nomeEmpresa: string
    representante: string
    cargo: string
    cidade: string
    endereco: string
    dataServico: string
  }
  dadosServico: {
    status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado'
    tipoManutencao: 'Preventiva' | 'Corretiva' | 'Emergencial' | 'Instalação'
    motivoChamado: string
    modeloEquipamento: string
    numeroSerie: string
    periodoGarantia: string
  }
  acoesRealizadas: {
    desempenhoEquipamento: string
    problemasEncontrados: string
    recomendacoes: string
  }
  tecnicoResponsavel: {
    nome: string
    cpf: string
    especialidade: string
    nomeEmpresa: string
  }
  horariosTrabalho: {
    dataServico: string
    saidaBase: string
    chegadaCliente: string
    inicioTrabalho: string
    horarioAlmoco: string
    retornoAlmoco: string
    finalTrabalho: string
    saidaCliente: string
    chegadaBase: string
    totalHoras: string
  }
  anexoImagens: any[]
  calculadoraCustos: {
    custosDeslocamento: {
      distanciaKm: number
      valorPorKm: number
      hospedagem: number
      alimentacao: number
      pedagio: number
    }
    tabelaPrecos: any[]
    totais: {
      subtotal: number
      custosDeslocamento: number
      totalGeral: number
    }
  }
  assinaturasDigitais: {
    assinaturaEmpresa: string
    nomeEmpresa: string
    cargoEmpresa: string
    assinaturaCliente: string
    nomeCliente: string
    cargoCliente: string
  }
  criadoEm: Date
  atualizadoEm: Date
}

// Componente simples para upload de imagens
function ImageUpload({ images, onImagesChange, maxSize = 5, maxImages = 10 }: {
  images: any[]
  onImagesChange: (images: any[]) => void
  maxSize: number
  maxImages: number
}) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Camera className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600">Funcionalidade de upload de imagens em desenvolvimento</p>
        <p className="text-xs text-gray-500 mt-2">Máximo {maxImages} imagens, {maxSize}MB cada</p>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image.url} alt={image.nome} className="w-full h-32 object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onImagesChange(images.filter((_, i) => i !== index))}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente simples para tabela de preços
function TabelaPrecos({ items, onItemsChange }: {
  items: any[]
  onItemsChange: (items: any[]) => void
}) {
  const adicionarItem = () => {
    const novoItem = {
      id: Date.now().toString(),
      descricao: '',
      categoria: 'Serviço',
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0,
      precoTotal: 0
    }
    onItemsChange([...items, novoItem])
  }

  const removerItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id))
  }

  const atualizarItem = (id: string, campo: string, valor: any) => {
    onItemsChange(items.map(item => {
      if (item.id === id) {
        const itemAtualizado = { ...item, [campo]: valor }
        // Recalcular preço total
        const precoComDesconto = itemAtualizado.precoUnitario * (1 - itemAtualizado.desconto / 100)
        itemAtualizado.precoTotal = precoComDesconto * itemAtualizado.quantidade
        return itemAtualizado
      }
      return item
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tabela de Preços</h3>
        <Button onClick={adicionarItem} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Item
        </Button>
      </div>
      
      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Descrição</th>
                <th className="border border-gray-300 p-2 text-left">Categoria</th>
                <th className="border border-gray-300 p-2 text-center">Qtd</th>
                <th className="border border-gray-300 p-2 text-right">Preço Unit.</th>
                <th className="border border-gray-300 p-2 text-center">Desconto %</th>
                <th className="border border-gray-300 p-2 text-right">Total</th>
                <th className="border border-gray-300 p-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">
                    <Input
                      value={item.descricao}
                      onChange={(e) => atualizarItem(item.id, 'descricao', e.target.value)}
                      placeholder="Descrição do serviço"
                      className="text-sm"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Select
                      value={item.categoria}
                      onValueChange={(value) => atualizarItem(item.id, 'categoria', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Serviço">Serviço</SelectItem>
                        <SelectItem value="Peça">Peça</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                        <SelectItem value="Deslocamento">Deslocamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(item.id, 'quantidade', parseFloat(e.target.value) || 0)}
                      className="text-sm text-center"
                      min="0"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.precoUnitario}
                      onChange={(e) => atualizarItem(item.id, 'precoUnitario', parseFloat(e.target.value) || 0)}
                      className="text-sm text-right"
                      min="0"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={item.desconto}
                      onChange={(e) => atualizarItem(item.id, 'desconto', parseFloat(e.target.value) || 0)}
                      className="text-sm text-center"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-right font-medium">
                    R$ {item.precoTotal.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removerItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum item adicionado</p>
          <Button onClick={adicionarItem} className="mt-4" variant="outline">
            Adicionar Primeiro Item
          </Button>
        </div>
      )}
    </div>
  )
}

// Componente simples para assinatura canvas
function AssinaturaCanvas({ assinatura, onAssinaturaChange, width = 300, height = 120 }: {
  assinatura: string
  onAssinaturaChange: (assinatura: string) => void
  width: number
  height: number
}) {
  return (
    <div className="space-y-2">
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
        {assinatura ? (
          <img src={assinatura} alt="Assinatura" className="max-w-full h-auto" />
        ) : (
          <div className="flex items-center justify-center h-24 text-gray-400">
            <PenTool className="w-6 h-6 mr-2" />
            <span>Canvas de assinatura em desenvolvimento</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onAssinaturaChange('')}>
          Limpar
        </Button>
        <Button variant="outline" size="sm" disabled>
          Assinar (Em desenvolvimento)
        </Button>
      </div>
    </div>
  )
}

export default function PamaservPage() {
  // Estados locais simplificados
  const [relatorios, setRelatorios] = useState<RelatorioManutencao[]>([])
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
      setRelatorios(prev => prev.filter(r => r.id !== id))
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
        setRelatorios(prev => prev.map(r => r.id === formData.id ? relatorioCompleto : r))
        setSaveMessage('Relatório atualizado com sucesso!')
      } else {
        setRelatorios(prev => [...prev, relatorioCompleto])
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

  const visualizarRelatorio = (id: string) => {
    const relatorio = relatorios.find(r => r.id === id)
    if (relatorio) {
      setFormData(relatorio)
      setActiveTab('preview')
    }
  }

  const salvarRelatorio = (id: string, formato: 'html' | 'pdf' | 'json') => {
    // Funcionalidade de download em desenvolvimento
    setSaveStatus('success')
    setSaveMessage(`Download ${formato.toUpperCase()} iniciado!`)
    setTimeout(() => {
      setSaveStatus('idle')
      setSaveMessage('')
    }, 3000)
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

          {/* Formulário - Versão simplificada */}
          <TabsContent value="formulario" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Plus className="w-5 h-5" />
                  {formData.id && relatorios.find(r => r.id === formData.id) ? 'Editar Relatório de Manutenção' : 'Novo Relatório de Manutenção'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Dados básicos */}
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
                        className="text-sm"
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
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomeTecnico" className="text-sm">Nome do Técnico *</Label>
                      <Input
                        id="nomeTecnico"
                        value={formData.tecnicoResponsavel?.nome || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          tecnicoResponsavel: { ...formData.tecnicoResponsavel!, nome: e.target.value }
                        })}
                        placeholder="Nome completo do técnico"
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
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Status e tipo */}
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
                  </div>

                  {/* Descrição do problema */}
                  <div className="space-y-2">
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
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t">
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

          {/* Pré-visualização - Versão simplificada */}
          <TabsContent value="preview" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="w-5 h-5" />
                  Pré-visualização do Relatório
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cabeçalho */}
                <div className="text-center border-b pb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">RELATÓRIO DE MANUTENÇÃO</h1>
                  <p className="text-base text-gray-600">PAMASERV - Sistema de Relatórios de Manutenção</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Relatório ID: {formData.id || 'Não definido'} | 
                    Gerado em: {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Dados do Cliente</h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Empresa:</span> {formData.dadosCliente?.nomeEmpresa || 'Não informado'}</p>
                      <p><span className="font-medium">Data do Serviço:</span> {formData.dadosCliente?.dataServico || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Dados do Serviço</h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Equipamento:</span> {formData.dadosServico?.modeloEquipamento || 'Não informado'}</p>
                      <p><span className="font-medium">Técnico:</span> {formData.tecnicoResponsavel?.nome || 'Não informado'}</p>
                      <p><span className="font-medium">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(formData.dadosServico?.status || 'Pendente')} text-white border-0`}>
                          {formData.dadosServico?.status || 'Pendente'}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Descrição do problema */}
                {formData.dadosServico?.motivoChamado && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Motivo do Chamado</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{formData.dadosServico.motivoChamado}</p>
                    </div>
                  </div>
                )}

                {/* Rodapé */}
                <div className="text-center border-t pt-6 text-sm text-gray-500">
                  <p>Este relatório foi gerado automaticamente pelo sistema PAMASERV</p>
                  <p>Data de geração: {new Date().toLocaleString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista de Relatórios */}
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
                <div className="space-y-4">
                  {filteredRelatorios.map((relatorio) => (
                    <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className={`w-4 h-4 rounded-full ${getStatusColor(relatorio.dadosServico.status)}`} />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-lg truncate">{relatorio.dadosCliente.nomeEmpresa}</h3>
                              <p className="text-base text-gray-600 truncate">{relatorio.dadosServico.modeloEquipamento}</p>
                              <p className="text-sm text-gray-500">
                                {relatorio.dadosCliente.dataServico}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge variant="outline" className={`${getStatusColor(relatorio.dadosServico.status)} text-white border-0`}>
                                {relatorio.dadosServico.status}
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">
                                {relatorio.dadosServico.tipoManutencao}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditarRelatorio(relatorio)}
                                title="Editar relatório"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => visualizarRelatorio(relatorio.id)}
                                title="Visualizar relatório"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setRelatorioParaExcluir(relatorio.id)}
                                title="Excluir relatório"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredRelatorios.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileSignature className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Nenhum relatório encontrado</p>
                      <p className="text-sm">Tente ajustar os filtros ou criar um novo relatório</p>
                      <Button onClick={handleNovoRelatorio} className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Novo Relatório
                      </Button>
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