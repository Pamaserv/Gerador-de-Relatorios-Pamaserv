'use client'

import { useState, useEffect, useRef } from 'react'
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
  Trash2,
  Upload,
  X,
  Home,
  Briefcase,
  Wrench as ToolIcon,
  ClipboardList,
  Users,
  FileBarChart,
  Printer,
  Share2,
  Archive,
  Filter,
  SortAsc,
  MoreHorizontal,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Info,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

// Tipos completos
interface RelatorioManutencao {
  id: string
  dadosEmpresa: {
    nomeEmpresa: string
    logo: string
    telefone: string
    cnpj: string
    email: string
    site: string
    endereco: string
    cidade: string
    cep: string
    responsavelTecnico: string
  }
  dadosCliente: {
    nomeEmpresa: string
    representante: string
    cargo: string
    cidade: string
    endereco: string
    cep: string
    telefone: string
    dataServico: string
  }
  dadosServico: {
    status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado'
    tipoManutencao: 'Preventiva' | 'Corretiva' | 'Emergencial' | 'Instalação'
    motivoChamado: string
    modeloEquipamento: string
    numeroSerie: string
    periodoGarantia: string
    condicaoEquipamento: string
    prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica'
    observacoes: string
  }
  acoesRealizadas: {
    desempenhoEquipamento: string
    problemasEncontrados: string
    recomendacoes: string
    proximaManutencao: string
  }
  tecnicoResponsavel: {
    nome: string
    especialidade: string
    nomeEmpresa: string
    telefone: string
    email: string
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
    horasExtras: string
    observacoesHorario: string
  }
  anexoImagens: {
    id: string
    nome: string
    url: string
    tipo: string
    tamanho: number
    descricao: string
    categoria: 'Antes' | 'Durante' | 'Depois' | 'Problema' | 'Solução' | 'Documentação'
    dataUpload: Date
  }[]
  calculadoraCustos: {
    custosDeslocamento: {
      distanciaKm: number
      valorPorKm: number
      hospedagem: number
      alimentacao: number
      pedagio: number
    }
    tabelaPrecos: {
      id: string
      descricao: string
      categoria: 'Serviço' | 'Peça' | 'Material' | 'Deslocamento' | 'Mão de Obra'
      quantidade: number
      precoUnitario: number
      desconto: number
      precoTotal: number
      observacoes: string
    }[]
    totais: {
      subtotal: number
      custosDeslocamento: number
      impostos: number
      desconto: number
      totalGeral: number
    }
    formaPagamento: string
    condicoesPagamento: string
    observacoesCusto: string
  }
  assinaturasDigitais: {
    assinaturaEmpresa: string
    nomeEmpresa: string
    cargoEmpresa: string
    dataAssinaturaEmpresa: string
    assinaturaCliente: string
    nomeCliente: string
    cargoCliente: string
    dataAssinaturaCliente: string
    observacoes: string
  }
  criadoEm: Date
  atualizadoEm: Date
  criadoPor: string
  versao: number
  tags: string[]
  categoria: string
  arquivado: boolean
}

// Componente completo para upload de imagens
function ImageUpload({ images, onImagesChange, maxSize = 5, maxImages = 20 }: {
  images: RelatorioManutencao['anexoImagens']
  onImagesChange: (images: RelatorioManutencao['anexoImagens']) => void
  maxSize: number
  maxImages: number
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`)
      return
    }

    setUploading(true)
    const newImages: RelatorioManutencao['anexoImagens'] = []

    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Arquivo ${file.name} é muito grande. Máximo ${maxSize}MB`)
        continue
      }

      if (!file.type.startsWith('image/')) {
        alert(`Arquivo ${file.name} não é uma imagem válida`)
        continue
      }

      // Simular upload - em produção seria enviado para servidor
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          nome: file.name,
          url: e.target?.result as string,
          tipo: file.type,
          tamanho: file.size,
          descricao: '',
          categoria: 'Documentação' as const,
          dataUpload: new Date()
        }
        newImages.push(newImage)
        
        if (newImages.length === files.length) {
          onImagesChange([...images, ...newImages])
          setUploading(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const updateImageData = (id: string, field: string, value: any) => {
    onImagesChange(images.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ))
  }

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id))
  }

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-sm text-gray-600">Processando imagens...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Camera className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Adicionar Imagens
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Arraste e solte ou clique para selecionar
            </p>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mb-2"
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivos
            </Button>
            <p className="text-xs text-gray-400">
              Máximo {maxImages} imagens, {maxSize}MB cada
            </p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Imagens Anexadas ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={image.url} 
                    alt={image.nome} 
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Categoria</Label>
                    <Select
                      value={image.categoria}
                      onValueChange={(value) => updateImageData(image.id, 'categoria', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Antes">Antes</SelectItem>
                        <SelectItem value="Durante">Durante</SelectItem>
                        <SelectItem value="Depois">Depois</SelectItem>
                        <SelectItem value="Problema">Problema</SelectItem>
                        <SelectItem value="Solução">Solução</SelectItem>
                        <SelectItem value="Documentação">Documentação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Descrição</Label>
                    <Textarea
                      value={image.descricao}
                      onChange={(e) => updateImageData(image.id, 'descricao', e.target.value)}
                      placeholder="Descreva a imagem..."
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {image.nome} • {(image.tamanho / 1024 / 1024).toFixed(2)}MB
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente completo para tabela de preços
function TabelaPrecos({ items, onItemsChange, custos }: {
  items: RelatorioManutencao['calculadoraCustos']['tabelaPrecos']
  onItemsChange: (items: RelatorioManutencao['calculadoraCustos']['tabelaPrecos']) => void
  custos: RelatorioManutencao['calculadoraCustos']
}) {
  const adicionarItem = () => {
    const novoItem = {
      id: Date.now().toString(),
      descricao: '',
      categoria: 'Serviço' as const,
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0,
      precoTotal: 0,
      observacoes: ''
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

  const duplicarItem = (id: string) => {
    const item = items.find(i => i.id === id)
    if (item) {
      const novoItem = {
        ...item,
        id: Date.now().toString(),
        descricao: `${item.descricao} (Cópia)`
      }
      onItemsChange([...items, novoItem])
    }
  }

  const subtotal = items.reduce((total, item) => total + item.precoTotal, 0)
  const totalDeslocamento = Object.values(custos.custosDeslocamento).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Tabela de Preços</h3>
          <p className="text-sm text-gray-600">Gerencie os itens e custos do serviço</p>
        </div>
        <Button onClick={adicionarItem} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Item
        </Button>
      </div>
      
      {items.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Descrição</th>
                  <th className="text-left p-4 font-medium text-gray-900">Categoria</th>
                  <th className="text-center p-4 font-medium text-gray-900">Qtd</th>
                  <th className="text-right p-4 font-medium text-gray-900">Preço Unit.</th>
                  <th className="text-center p-4 font-medium text-gray-900">Desc. %</th>
                  <th className="text-right p-4 font-medium text-gray-900">Total</th>
                  <th className="text-center p-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Input
                          value={item.descricao}
                          onChange={(e) => atualizarItem(item.id, 'descricao', e.target.value)}
                          placeholder="Descrição do item"
                          className="text-sm"
                        />
                        <Textarea
                          value={item.observacoes}
                          onChange={(e) => atualizarItem(item.id, 'observacoes', e.target.value)}
                          placeholder="Observações (opcional)"
                          className="text-xs"
                          rows={1}
                        />
                      </div>
                    </td>
                    <td className="p-4">
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
                          <SelectItem value="Mão de Obra">Mão de Obra</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(item.id, 'quantidade', parseFloat(e.target.value) || 0)}
                        className="text-sm text-center w-20"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.precoUnitario}
                        onChange={(e) => atualizarItem(item.id, 'precoUnitario', parseFloat(e.target.value) || 0)}
                        className="text-sm text-right w-28"
                        min="0"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.desconto}
                        onChange={(e) => atualizarItem(item.id, 'desconto', parseFloat(e.target.value) || 0)}
                        className="text-sm text-center w-20"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="p-4 text-right font-semibold text-green-600">
                      R$ {item.precoTotal.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => duplicarItem(item.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => removerItem(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Resumo de totais */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="text-sm text-gray-600">
                <p>{items.length} item(ns) • Total de {items.reduce((total, item) => total + item.quantidade, 0)} unidades</p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex justify-between gap-8 text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8 text-sm">
                  <span>Deslocamento:</span>
                  <span>R$ {totalDeslocamento.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between gap-8 text-lg font-bold text-green-600">
                  <span>Total Geral:</span>
                  <span>R$ {(subtotal + totalDeslocamento).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calculator className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item adicionado</h3>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Adicione itens para calcular os custos do serviço
            </p>
            <Button onClick={adicionarItem} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente completo para assinatura canvas
function AssinaturaCanvas({ assinatura, onAssinaturaChange, nome, cargo, width = 400, height = 150 }: {
  assinatura: string
  onAssinaturaChange: (assinatura: string) => void
  nome: string
  cargo: string
  width?: number
  height?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDrawing(true)
    setLastPos({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()
    
    setLastPos({ x, y })
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      if (canvas) {
        const dataURL = canvas.toDataURL()
        onAssinaturaChange(dataURL)
      }
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      onAssinaturaChange('')
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      // Configurar canvas
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Carregar assinatura existente
      if (assinatura) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
        }
        img.src = assinatura
      }
    }
  }, [assinatura])

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
        <div className="mb-4">
          <h4 className="font-medium text-gray-900">{nome || 'Nome não informado'}</h4>
          <p className="text-sm text-gray-600">{cargo || 'Cargo não informado'}</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="cursor-crosshair bg-white block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-gray-500">
            Clique e arraste para assinar
          </p>
          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={clearCanvas}
            >
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </div>
      
      {assinatura && (
        <div className="text-xs text-gray-500 text-center">
          Assinatura capturada • {new Date().toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  )
}

// Componente de estatísticas avançadas
function DashboardStats({ relatorios }: { relatorios: RelatorioManutencao[] }) {
  const stats = {
    total: relatorios.length,
    concluidos: relatorios.filter(r => r.dadosServico.status === 'Concluído').length,
    emAndamento: relatorios.filter(r => r.dadosServico.status === 'Em Andamento').length,
    pendentes: relatorios.filter(r => r.dadosServico.status === 'Pendente').length,
    cancelados: relatorios.filter(r => r.dadosServico.status === 'Cancelado').length,
    preventiva: relatorios.filter(r => r.dadosServico.tipoManutencao === 'Preventiva').length,
    corretiva: relatorios.filter(r => r.dadosServico.tipoManutencao === 'Corretiva').length,
    emergencial: relatorios.filter(r => r.dadosServico.tipoManutencao === 'Emergencial').length,
    instalacao: relatorios.filter(r => r.dadosServico.tipoManutencao === 'Instalação').length,
    valorTotal: relatorios.reduce((total, r) => total + (r.calculadoraCustos?.totais?.totalGeral || 0), 0),
    mediaValor: relatorios.length > 0 ? relatorios.reduce((total, r) => total + (r.calculadoraCustos?.totais?.totalGeral || 0), 0) / relatorios.length : 0,
    tempoMedio: '2.5h' // Calculado baseado nos horários
  }

  const percentualConcluidos = stats.total > 0 ? (stats.concluidos / stats.total) * 100 : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Card de Status Geral */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Relatórios</p>
              <p className="text-3xl font-bold">{stats.total}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12% este mês</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileSignature className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Conclusão */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Taxa de Conclusão</p>
              <p className="text-3xl font-bold">{percentualConcluidos.toFixed(0)}%</p>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${percentualConcluidos}%` }}
                />
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Valor */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Valor Total</p>
              <p className="text-3xl font-bold">R$ {(stats.valorTotal / 1000).toFixed(0)}k</p>
              <p className="text-sm text-purple-100 mt-1">
                Média: R$ {stats.mediaValor.toFixed(0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Performance */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Performance</p>
              <p className="text-3xl font-bold">{stats.tempoMedio}</p>
              <p className="text-sm text-orange-100 mt-1">
                Tempo médio por serviço
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Status Detalhados */}
      <Card className="sm:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Distribuição por Status e Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
              <p className="text-sm text-yellow-700">Pendentes</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.emAndamento}</p>
              <p className="text-sm text-blue-700">Em Andamento</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
              <p className="text-sm text-green-700">Concluídos</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.cancelados}</p>
              <p className="text-sm text-red-700">Cancelados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PamaservPage() {
  // Estados principais
  const [relatorios, setRelatorios] = useState<RelatorioManutencao[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [relatorioParaExcluir, setRelatorioParaExcluir] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [sortBy, setSortBy] = useState('dataServico')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 8

  // Estado do formulário completo
  const [formData, setFormData] = useState<Partial<RelatorioManutencao>>({
    id: '',
    dadosEmpresa: {
      nomeEmpresa: 'PAMASERV Manutenção Industrial',
      logo: '',
      telefone: '(11) 99999-9999',
      cnpj: '00.000.000/0001-00',
      email: 'contato@pamaserv.com.br',
      site: 'www.pamaserv.com.br',
      endereco: 'Rua Industrial, 123',
      cidade: 'São Paulo - SP',
      cep: '01234-567',
      responsavelTecnico: 'João Silva'
    },
    dadosCliente: {
      nomeEmpresa: '',
      representante: '',
      cargo: '',
      cidade: '',
      endereco: '',
      cep: '',
      telefone: '',
      dataServico: ''
    },
    dadosServico: {
      status: 'Pendente',
      tipoManutencao: 'Preventiva',
      motivoChamado: '',
      modeloEquipamento: '',
      numeroSerie: '',
      periodoGarantia: '',
      condicaoEquipamento: '',
      prioridade: 'Média',
      observacoes: ''
    },
    acoesRealizadas: {
      desempenhoEquipamento: '',
      problemasEncontrados: '',
      recomendacoes: '',
      proximaManutencao: ''
    },
    tecnicoResponsavel: {
      nome: '',
      especialidade: '',
      nomeEmpresa: 'PAMASERV',
      telefone: '',
      email: ''
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
      totalHoras: '',
      horasExtras: '',
      observacoesHorario: ''
    },
    anexoImagens: [],
    calculadoraCustos: {
      custosDeslocamento: {
        distanciaKm: 0,
        valorPorKm: 0.75,
        hospedagem: 0,
        alimentacao: 0,
        pedagio: 0
      },
      tabelaPrecos: [],
      totais: {
        subtotal: 0,
        custosDeslocamento: 0,
        impostos: 0,
        desconto: 0,
        totalGeral: 0
      },
      formaPagamento: 'À vista',
      condicoesPagamento: '30 dias',
      observacoesCusto: ''
    },
    assinaturasDigitais: {
      assinaturaEmpresa: '',
      nomeEmpresa: '',
      cargoEmpresa: '',
      dataAssinaturaEmpresa: '',
      assinaturaCliente: '',
      nomeCliente: '',
      cargoCliente: '',
      dataAssinaturaCliente: '',
      observacoes: ''
    },
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    criadoPor: 'Sistema',
    versao: 1,
    tags: [],
    categoria: 'Manutenção',
    arquivado: false
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedRelatorios = localStorage.getItem('pamaserv-relatorios')
    if (savedRelatorios) {
      try {
        const parsed = JSON.parse(savedRelatorios)
        setRelatorios(parsed.map((r: any) => ({
          ...r,
          criadoEm: new Date(r.criadoEm),
          atualizadoEm: new Date(r.atualizadoEm)
        })))
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error)
      }
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (relatorios.length > 0) {
      localStorage.setItem('pamaserv-relatorios', JSON.stringify(relatorios))
    }
  }, [relatorios])

  // Filtros e ordenação
  const filteredRelatorios = relatorios
    .filter(relatorio => {
      const matchesSearch = relatorio.dadosCliente.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           relatorio.dadosServico.modeloEquipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           relatorio.tecnicoResponsavel.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'todos' || relatorio.dadosServico.status === statusFilter
      const matchesTipo = tipoFilter === 'todos' || relatorio.dadosServico.tipoManutencao === tipoFilter
      return matchesSearch && matchesStatus && matchesTipo
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'dataServico':
          aValue = new Date(a.dadosCliente.dataServico || 0)
          bValue = new Date(b.dadosCliente.dataServico || 0)
          break
        case 'cliente':
          aValue = a.dadosCliente.nomeEmpresa
          bValue = b.dadosCliente.nomeEmpresa
          break
        case 'status':
          aValue = a.dadosServico.status
          bValue = b.dadosServico.status
          break
        case 'valor':
          aValue = a.calculadoraCustos?.totais?.totalGeral || 0
          bValue = b.calculadoraCustos?.totais?.totalGeral || 0
          break
        default:
          aValue = a.criadoEm
          bValue = b.criadoEm
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
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

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Crítica': return 'bg-red-500'
      case 'Alta': return 'bg-orange-500'
      case 'Média': return 'bg-yellow-500'
      case 'Baixa': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleNovoRelatorio = () => {
    const novoId = `REL-${Date.now()}`
    setFormData({
      ...formData,
      id: novoId,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    })
    setCurrentStep(1)
    setSaveStatus('idle')
    setSaveMessage('')
    setActiveTab('formulario')
  }

  const handleEditarRelatorio = (relatorio: RelatorioManutencao) => {
    setFormData(relatorio)
    setCurrentStep(1)
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
      const { valido, erros } = validarFormulario()
      
      if (!valido) {
        setSaveStatus('error')
        setSaveMessage(`Erro de validação: ${erros.join(', ')}`)
        return
      }

      const totalHoras = calcularTotalHoras()
      
      // Calcular totais
      const custosDeslocamento = Object.values(formData.calculadoraCustos?.custosDeslocamento || {}).reduce((a, b) => a + b, 0)
      const subtotal = formData.calculadoraCustos?.tabelaPrecos?.reduce((total, item) => total + item.precoTotal, 0) || 0
      const impostos = subtotal * 0.1 // 10% de impostos
      const totalGeral = subtotal + custosDeslocamento + impostos
      
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
            impostos,
            desconto: 0,
            totalGeral
          }
        },
        atualizadoEm: new Date(),
        versao: (formData.versao || 0) + 1
      }
      
      const existeRelatorio = relatorios.find(r => r.id === formData.id)
      
      if (existeRelatorio) {
        setRelatorios(prev => prev.map(r => r.id === formData.id ? relatorioCompleto : r))
        setSaveMessage('Relatório atualizado com sucesso!')
      } else {
        setRelatorios(prev => [...prev, relatorioCompleto])
        setSaveMessage('Relatório salvo com sucesso!')
      }
      
      setSaveStatus('success')
      
      setTimeout(() => {
        setActiveTab('dashboard')
        setCurrentStep(1)
        // Reset form
        setFormData({
          id: '',
          dadosEmpresa: {
            nomeEmpresa: 'PAMASERV Manutenção Industrial',
            logo: '',
            telefone: '(11) 99999-9999',
            cnpj: '00.000.000/0001-00',
            email: 'contato@pamaserv.com.br',
            site: 'www.pamaserv.com.br',
            endereco: 'Rua Industrial, 123',
            cidade: 'São Paulo - SP',
            cep: '01234-567',
            responsavelTecnico: 'João Silva'
          },
          dadosCliente: { nomeEmpresa: '', representante: '', cargo: '', cidade: '', endereco: '', cep: '', telefone: '', dataServico: '' },
          dadosServico: { status: 'Pendente', tipoManutencao: 'Preventiva', motivoChamado: '', modeloEquipamento: '', numeroSerie: '', periodoGarantia: '', condicaoEquipamento: '', prioridade: 'Média', observacoes: '' },
          acoesRealizadas: { desempenhoEquipamento: '', problemasEncontrados: '', recomendacoes: '', proximaManutencao: '' },
          tecnicoResponsavel: { nome: '', especialidade: '', nomeEmpresa: 'PAMASERV', telefone: '', email: '' },
          horariosTrabalho: { dataServico: '', saidaBase: '', chegadaCliente: '', inicioTrabalho: '', horarioAlmoco: '', retornoAlmoco: '', finalTrabalho: '', saidaCliente: '', chegadaBase: '', totalHoras: '', horasExtras: '', observacoesHorario: '' },
          anexoImagens: [],
          calculadoraCustos: { custosDeslocamento: { distanciaKm: 0, valorPorKm: 0.75, hospedagem: 0, alimentacao: 0, pedagio: 0 }, tabelaPrecos: [], totais: { subtotal: 0, custosDeslocamento: 0, impostos: 0, desconto: 0, totalGeral: 0 }, formaPagamento: 'À vista', condicoesPagamento: '30 dias', observacoesCusto: '' },
          assinaturasDigitais: { assinaturaEmpresa: '', nomeEmpresa: '', cargoEmpresa: '', dataAssinaturaEmpresa: '', assinaturaCliente: '', nomeCliente: '', cargoCliente: '', dataAssinaturaCliente: '', observacoes: '' },
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          criadoPor: 'Sistema',
          versao: 1,
          tags: [],
          categoria: 'Manutenção',
          arquivado: false
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

  const exportarRelatorio = (id: string, formato: 'pdf' | 'html' | 'json') => {
    const relatorio = relatorios.find(r => r.id === id)
    if (!relatorio) return

    setSaveStatus('success')
    setSaveMessage(`Exportação ${formato.toUpperCase()} iniciada!`)
    
    // Simular download
    setTimeout(() => {
      const dataStr = JSON.stringify(relatorio, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = `relatorio_${relatorio.id}_${formato}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      setSaveStatus('idle')
      setSaveMessage('')
    }, 1000)
  }

  const duplicarRelatorio = (id: string) => {
    const relatorio = relatorios.find(r => r.id === id)
    if (relatorio) {
      const novoRelatorio = {
        ...relatorio,
        id: `REL-${Date.now()}`,
        dadosCliente: {
          ...relatorio.dadosCliente,
          nomeEmpresa: `${relatorio.dadosCliente.nomeEmpresa} (Cópia)`
        },
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        versao: 1
      }
      setRelatorios(prev => [...prev, novoRelatorio])
      setSaveStatus('success')
      setSaveMessage('Relatório duplicado com sucesso!')
      setTimeout(() => {
        setSaveStatus('idle')
        setSaveMessage('')
      }, 3000)
    }
  }

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
                  <Input
                    id="nomeEmpresa"
                    value={formData.dadosCliente?.nomeEmpresa || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, nomeEmpresa: e.target.value }
                    })}
                    placeholder="Nome da empresa cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representante">Representante</Label>
                  <Input
                    id="representante"
                    value={formData.dadosCliente?.representante || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, representante: e.target.value }
                    })}
                    placeholder="Nome do representante"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={formData.dadosCliente?.cargo || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, cargo: e.target.value }
                    })}
                    placeholder="Cargo do representante"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefoneCliente">Telefone</Label>
                  <Input
                    id="telefoneCliente"
                    value={formData.dadosCliente?.telefone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, telefone: e.target.value }
                    })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enderecoCliente">Endereço</Label>
                  <Input
                    id="enderecoCliente"
                    value={formData.dadosCliente?.endereco || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, endereco: e.target.value }
                    })}
                    placeholder="Rua, número"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidadeCliente">Cidade</Label>
                  <Input
                    id="cidadeCliente"
                    value={formData.dadosCliente?.cidade || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, cidade: e.target.value }
                    })}
                    placeholder="Cidade - UF"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cepCliente">CEP</Label>
                  <Input
                    id="cepCliente"
                    value={formData.dadosCliente?.cep || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, cep: e.target.value }
                    })}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ToolIcon className="w-5 h-5" />
                Dados do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataServico">Data do Serviço *</Label>
                  <Input
                    id="dataServico"
                    type="date"
                    value={formData.dadosCliente?.dataServico || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosCliente: { ...formData.dadosCliente!, dataServico: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={formData.dadosServico?.prioridade || 'Média'}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      dadosServico: { ...formData.dadosServico!, prioridade: value as any }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.dadosServico?.status || 'Pendente'}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      dadosServico: { ...formData.dadosServico!, status: value as any }
                    })}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="tipoManutencao">Tipo de Manutenção</Label>
                  <Select
                    value={formData.dadosServico?.tipoManutencao || 'Preventiva'}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      dadosServico: { ...formData.dadosServico!, tipoManutencao: value as any }
                    })}
                  >
                    <SelectTrigger>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modeloEquipamento">Modelo do Equipamento *</Label>
                  <Input
                    id="modeloEquipamento"
                    value={formData.dadosServico?.modeloEquipamento || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosServico: { ...formData.dadosServico!, modeloEquipamento: e.target.value }
                    })}
                    placeholder="Modelo do equipamento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroSerie">Número de Série</Label>
                  <Input
                    id="numeroSerie"
                    value={formData.dadosServico?.numeroSerie || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosServico: { ...formData.dadosServico!, numeroSerie: e.target.value }
                    })}
                    placeholder="Número de série"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodoGarantia">Período de Garantia</Label>
                  <Input
                    id="periodoGarantia"
                    value={formData.dadosServico?.periodoGarantia || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dadosServico: { ...formData.dadosServico!, periodoGarantia: e.target.value }
                    })}
                    placeholder="Ex: 12 meses"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivoChamado">Motivo do Chamado</Label>
                <Textarea
                  id="motivoChamado"
                  value={formData.dadosServico?.motivoChamado || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    dadosServico: { ...formData.dadosServico!, motivoChamado: e.target.value }
                  })}
                  placeholder="Descreva o motivo do chamado"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condicaoEquipamento">Condição do Equipamento</Label>
                <Textarea
                  id="condicaoEquipamento"
                  value={formData.dadosServico?.condicaoEquipamento || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    dadosServico: { ...formData.dadosServico!, condicaoEquipamento: e.target.value }
                  })}
                  placeholder="Estado geral do equipamento ao chegar no local"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Técnico Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeTecnico">Nome Completo *</Label>
                  <Input
                    id="nomeTecnico"
                    value={formData.tecnicoResponsavel?.nome || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tecnicoResponsavel: { ...formData.tecnicoResponsavel!, nome: e.target.value }
                    })}
                    placeholder="Nome completo do técnico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input
                    id="especialidade"
                    value={formData.tecnicoResponsavel?.especialidade || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tecnicoResponsavel: { ...formData.tecnicoResponsavel!, especialidade: e.target.value }
                    })}
                    placeholder="Área de especialização"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefoneTecnico">Telefone</Label>
                  <Input
                    id="telefoneTecnico"
                    value={formData.tecnicoResponsavel?.telefone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tecnicoResponsavel: { ...formData.tecnicoResponsavel!, telefone: e.target.value }
                    })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailTecnico">E-mail</Label>
                  <Input
                    id="emailTecnico"
                    type="email"
                    value={formData.tecnicoResponsavel?.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tecnicoResponsavel: { ...formData.tecnicoResponsavel!, email: e.target.value }
                    })}
                    placeholder="tecnico@pamaserv.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresaTecnico">Empresa</Label>
                  <Input
                    id="nomeEmpresaTecnico"
                    value={formData.tecnicoResponsavel?.nomeEmpresa || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      tecnicoResponsavel: { ...formData.tecnicoResponsavel!, nomeEmpresa: e.target.value }
                    })}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários de Trabalho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saidaBase">Saída da Base</Label>
                  <Input
                    id="saidaBase"
                    type="time"
                    value={formData.horariosTrabalho?.saidaBase || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, saidaBase: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chegadaCliente">Chegada no Cliente</Label>
                  <Input
                    id="chegadaCliente"
                    type="time"
                    value={formData.horariosTrabalho?.chegadaCliente || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, chegadaCliente: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inicioTrabalho">Início do Trabalho</Label>
                  <Input
                    id="inicioTrabalho"
                    type="time"
                    value={formData.horariosTrabalho?.inicioTrabalho || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, inicioTrabalho: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioAlmoco">Saída para Almoço</Label>
                  <Input
                    id="horarioAlmoco"
                    type="time"
                    value={formData.horariosTrabalho?.horarioAlmoco || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, horarioAlmoco: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retornoAlmoco">Retorno do Almoço</Label>
                  <Input
                    id="retornoAlmoco"
                    type="time"
                    value={formData.horariosTrabalho?.retornoAlmoco || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, retornoAlmoco: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalTrabalho">Final do Trabalho</Label>
                  <Input
                    id="finalTrabalho"
                    type="time"
                    value={formData.horariosTrabalho?.finalTrabalho || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, finalTrabalho: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saidaCliente">Saída do Cliente</Label>
                  <Input
                    id="saidaCliente"
                    type="time"
                    value={formData.horariosTrabalho?.saidaCliente || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, saidaCliente: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chegadaBase">Chegada na Base</Label>
                  <Input
                    id="chegadaBase"
                    type="time"
                    value={formData.horariosTrabalho?.chegadaBase || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, chegadaBase: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horasExtras">Horas Extras</Label>
                  <Input
                    id="horasExtras"
                    value={formData.horariosTrabalho?.horasExtras || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      horariosTrabalho: { ...formData.horariosTrabalho!, horasExtras: e.target.value }
                    })}
                    placeholder="0:00"
                  />
                </div>
              </div>
              
              {/* Cálculo automático de horas */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Cálculo de Horas</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total de Horas:</span>
                    <span className="ml-2 font-bold text-blue-900">{calcularTotalHoras()}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Horas Extras:</span>
                    <span className="ml-2 font-bold text-blue-900">{formData.horariosTrabalho?.horasExtras || '0:00'}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Status:</span>
                    <span className="ml-2 font-bold text-green-600">Calculado automaticamente</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoesHorario">Observações sobre Horários</Label>
                <Textarea
                  id="observacoesHorario"
                  value={formData.horariosTrabalho?.observacoesHorario || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    horariosTrabalho: { ...formData.horariosTrabalho!, observacoesHorario: e.target.value }
                  })}
                  placeholder="Observações sobre os horários de trabalho"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Ações Realizadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="desempenhoEquipamento">Desempenho do Equipamento</Label>
                  <Textarea
                    id="desempenhoEquipamento"
                    value={formData.acoesRealizadas?.desempenhoEquipamento || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      acoesRealizadas: { ...formData.acoesRealizadas!, desempenhoEquipamento: e.target.value }
                    })}
                    placeholder="Descreva o desempenho atual do equipamento"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problemasEncontrados">Problemas Encontrados</Label>
                  <Textarea
                    id="problemasEncontrados"
                    value={formData.acoesRealizadas?.problemasEncontrados || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      acoesRealizadas: { ...formData.acoesRealizadas!, problemasEncontrados: e.target.value }
                    })}
                    placeholder="Liste os problemas identificados"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recomendacoes">Recomendações</Label>
                  <Textarea
                    id="recomendacoes"
                    value={formData.acoesRealizadas?.recomendacoes || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      acoesRealizadas: { ...formData.acoesRealizadas!, recomendacoes: e.target.value }
                    })}
                    placeholder="Recomendações para o cliente"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proximaManutencao">Próxima Manutenção</Label>
                  <Textarea
                    id="proximaManutencao"
                    value={formData.acoesRealizadas?.proximaManutencao || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      acoesRealizadas: { ...formData.acoesRealizadas!, proximaManutencao: e.target.value }
                    })}
                    placeholder="Quando deve ser realizada a próxima manutenção"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Anexo de Imagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={formData.anexoImagens || []}
                onImagesChange={(images) => setFormData({
                  ...formData,
                  anexoImagens: images
                })}
                maxSize={5}
                maxImages={20}
              />
            </CardContent>
          </Card>
        )

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculadora de Custos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custos de Deslocamento */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Custos de Deslocamento</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distanciaKm">Distância (km)</Label>
                    <Input
                      id="distanciaKm"
                      type="number"
                      step="0.1"
                      value={formData.calculadoraCustos?.custosDeslocamento?.distanciaKm || 0}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorPorKm">Valor por km</Label>
                    <Input
                      id="valorPorKm"
                      type="number"
                      step="0.01"
                      value={formData.calculadoraCustos?.custosDeslocamento?.valorPorKm || 0}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospedagem">Hospedagem</Label>
                    <Input
                      id="hospedagem"
                      type="number"
                      step="0.01"
                      value={formData.calculadoraCustos?.custosDeslocamento?.hospedagem || 0}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alimentacao">Alimentação</Label>
                    <Input
                      id="alimentacao"
                      type="number"
                      step="0.01"
                      value={formData.calculadoraCustos?.custosDeslocamento?.alimentacao || 0}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pedagio">Pedágio</Label>
                    <Input
                      id="pedagio"
                      type="number"
                      step="0.01"
                      value={formData.calculadoraCustos?.custosDeslocamento?.pedagio || 0}
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
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tabela de Preços */}
              <TabelaPrecos
                items={formData.calculadoraCustos?.tabelaPrecos || []}
                onItemsChange={(items) => setFormData({
                  ...formData,
                  calculadoraCustos: {
                    ...formData.calculadoraCustos!,
                    tabelaPrecos: items
                  }
                })}
                custos={formData.calculadoraCustos!}
              />

              <Separator />

              {/* Condições de Pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Select
                    value={formData.calculadoraCustos?.formaPagamento || 'À vista'}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      calculadoraCustos: {
                        ...formData.calculadoraCustos!,
                        formaPagamento: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="À vista">À vista</SelectItem>
                      <SelectItem value="Cartão de crédito">Cartão de crédito</SelectItem>
                      <SelectItem value="Cartão de débito">Cartão de débito</SelectItem>
                      <SelectItem value="Transferência bancária">Transferência bancária</SelectItem>
                      <SelectItem value="Boleto bancário">Boleto bancário</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condicoesPagamento">Condições de Pagamento</Label>
                  <Input
                    id="condicoesPagamento"
                    value={formData.calculadoraCustos?.condicoesPagamento || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      calculadoraCustos: {
                        ...formData.calculadoraCustos!,
                        condicoesPagamento: e.target.value
                      }
                    })}
                    placeholder="Ex: 30 dias, À vista com desconto"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoesCusto">Observações sobre Custos</Label>
                <Textarea
                  id="observacoesCusto"
                  value={formData.calculadoraCustos?.observacoesCusto || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    calculadoraCustos: {
                      ...formData.calculadoraCustos!,
                      observacoesCusto: e.target.value
                    }
                  })}
                  placeholder="Observações adicionais sobre os custos"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Assinaturas Digitais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Assinatura da Empresa */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Assinatura da Empresa</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeEmpresaAssinatura">Nome do Responsável</Label>
                    <Input
                      id="nomeEmpresaAssinatura"
                      value={formData.assinaturasDigitais?.nomeEmpresa || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        assinaturasDigitais: {
                          ...formData.assinaturasDigitais!,
                          nomeEmpresa: e.target.value
                        }
                      })}
                      placeholder="Nome do responsável da empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargoEmpresaAssinatura">Cargo</Label>
                    <Input
                      id="cargoEmpresaAssinatura"
                      value={formData.assinaturasDigitais?.cargoEmpresa || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        assinaturasDigitais: {
                          ...formData.assinaturasDigitais!,
                          cargoEmpresa: e.target.value
                        }
                      })}
                      placeholder="Cargo na empresa"
                    />
                  </div>
                </div>
                <AssinaturaCanvas
                  assinatura={formData.assinaturasDigitais?.assinaturaEmpresa || ''}
                  onAssinaturaChange={(assinatura) => setFormData({
                    ...formData,
                    assinaturasDigitais: {
                      ...formData.assinaturasDigitais!,
                      assinaturaEmpresa: assinatura,
                      dataAssinaturaEmpresa: new Date().toISOString()
                    }
                  })}
                  nome={formData.assinaturasDigitais?.nomeEmpresa || ''}
                  cargo={formData.assinaturasDigitais?.cargoEmpresa || ''}
                />
              </div>

              <Separator />

              {/* Assinatura do Cliente */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Assinatura do Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeClienteAssinatura">Nome do Responsável</Label>
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
                      placeholder="Nome do responsável do cliente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargoClienteAssinatura">Cargo</Label>
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
                      placeholder="Cargo do responsável"
                    />
                  </div>
                </div>
                <AssinaturaCanvas
                  assinatura={formData.assinaturasDigitais?.assinaturaCliente || ''}
                  onAssinaturaChange={(assinatura) => setFormData({
                    ...formData,
                    assinaturasDigitais: {
                      ...formData.assinaturasDigitais!,
                      assinaturaCliente: assinatura,
                      dataAssinaturaCliente: new Date().toISOString()
                    }
                  })}
                  nome={formData.assinaturasDigitais?.nomeCliente || ''}
                  cargo={formData.assinaturasDigitais?.cargoCliente || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoesAssinatura">Observações</Label>
                <Textarea
                  id="observacoesAssinatura"
                  value={formData.assinaturasDigitais?.observacoes || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    assinaturasDigitais: {
                      ...formData.assinaturasDigitais!,
                      observacoes: e.target.value
                    }
                  })}
                  placeholder="Observações sobre as assinaturas"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Aprimorado */}
        <div className="mb-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PAMASERV
              </h1>
              <p className="text-lg text-gray-600 mt-1">Sistema Completo de Relatórios de Manutenção</p>
              <p className="text-sm text-gray-500">Versão 2.0 • Profissional</p>
            </div>
          </div>
        </div>

        {/* Status de Salvamento Global */}
        {saveStatus !== 'idle' && (
          <Alert className={`mb-6 ${
            saveStatus === 'success' ? 'border-green-200 bg-green-50' :
            saveStatus === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-center gap-3">
              {saveStatus === 'saving' && <Loader2 className="w-5 h-5 animate-spin" />}
              {saveStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {saveStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              <AlertDescription className={`${
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
                  <AlertTriangle className="w-5 h-5" />
                  Confirmar Exclusão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* TabsList Aprimorado */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 min-w-[700px] sm:min-w-full h-14">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm px-4">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="formulario" className="flex items-center gap-2 text-sm px-4">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Relatório</span>
                <span className="sm:hidden">Novo</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 text-sm px-4">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Pré-visualização</span>
                <span className="sm:hidden">Preview</span>
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-2 text-sm px-4">
                <FileBarChart className="w-4 h-4" />
                <span className="hidden sm:inline">Relatórios</span>
                <span className="sm:hidden">Lista</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Completo */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats relatorios={relatorios} />

            {/* Relatórios Recentes */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Activity className="w-5 h-5" />
                      Relatórios Recentes
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Últimos relatórios criados e atualizados
                    </p>
                  </div>
                  <Button onClick={handleNovoRelatorio} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Relatório
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatorios.slice(0, 8).map((relatorio) => (
                    <div key={relatorio.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 gap-4">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(relatorio.dadosServico.status)} shadow-sm`} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate text-lg">
                            {relatorio.dadosCliente.nomeEmpresa}
                          </h3>
                          <p className="text-gray-600 truncate">
                            {relatorio.dadosServico.modeloEquipamento}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {relatorio.dadosCliente.dataServico}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {relatorio.tecnicoResponsavel.nome}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between lg:justify-end gap-4">
                        <div className="text-right">
                          <Badge className={`${getStatusColor(relatorio.dadosServico.status)} text-white border-0 mb-2`}>
                            {relatorio.dadosServico.status}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {relatorio.dadosServico.tipoManutencao}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(relatorio.dadosServico.prioridade)} text-white border-0`}>
                              {relatorio.dadosServico.prioridade}
                            </Badge>
                          </div>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => duplicarRelatorio(relatorio.id)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportarRelatorio(relatorio.id, 'pdf')}>
                                <Download className="w-4 h-4 mr-2" />
                                Exportar PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setRelatorioParaExcluir(relatorio.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                  {relatorios.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileSignature className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum relatório encontrado
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Comece criando seu primeiro relatório de manutenção
                      </p>
                      <Button onClick={handleNovoRelatorio} size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Plus className="w-5 h-5 mr-2" />
                        Criar Primeiro Relatório
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formulário Multi-Step */}
          <TabsContent value="formulario" className="space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {formData.id && relatorios.find(r => r.id === formData.id) ? 'Editar Relatório' : 'Novo Relatório'}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Etapa {currentStep} de {totalSteps}
                  </span>
                </div>
                <Progress value={(currentStep / totalSteps) * 100} className="mb-4" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Cliente</span>
                  <span>Serviço</span>
                  <span>Técnico</span>
                  <span>Horários</span>
                  <span>Ações</span>
                  <span>Imagens</span>
                  <span>Custos</span>
                  <span>Assinaturas</span>
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            {renderFormStep()}

            {/* Navigation Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    {currentStep > 1 && (
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Anterior
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('preview')}
                      className="bg-blue-50 hover:bg-blue-100 border-blue-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Pré-visualizar
                    </Button>
                    
                    {currentStep < totalSteps ? (
                      <Button 
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        Próximo
                        <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSalvarRelatorio} 
                        disabled={saveStatus === 'saving'}
                        className="bg-gradient-to-r from-green-600 to-emerald-600"
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
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pré-visualização Completa */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-5 h-5" />
                    Pré-visualização do Relatório
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportarRelatorio(formData.id || '', 'pdf')}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Cabeçalho do Relatório */}
                <div className="text-center border-b pb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">RELATÓRIO DE MANUTENÇÃO</h1>
                      <p className="text-lg text-gray-600">{formData.dadosEmpresa?.nomeEmpresa}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <p>Relatório ID: <span className="font-medium">{formData.id || 'Não definido'}</span></p>
                    <p>Gerado em: <span className="font-medium">{new Date().toLocaleDateString('pt-BR')}</span></p>
                    <p>Versão: <span className="font-medium">{formData.versao || 1}</span></p>
                  </div>
                </div>

                {/* Informações do Cliente e Serviço */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="w-5 h-5" />
                        Dados do Cliente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Empresa:</span>
                          <p className="font-medium">{formData.dadosCliente?.nomeEmpresa || 'Não informado'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Representante:</span>
                          <p>{formData.dadosCliente?.representante || 'Não informado'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Cargo:</span>
                          <p>{formData.dadosCliente?.cargo || 'Não informado'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Contato:</span>
                          <p>{formData.dadosCliente?.telefone || 'Não informado'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Data do Serviço:</span>
                          <p className="font-medium">{formData.dadosCliente?.dataServico || 'Não informado'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ToolIcon className="w-5 h-5" />
                        Dados do Serviço
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Equipamento:</span>
                          <p className="font-medium">{formData.dadosServico?.modeloEquipamento || 'Não informado'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Número de Série:</span>
                          <p>{formData.dadosServico?.numeroSerie || 'Não informado'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Técnico Responsável:</span>
                          <p className="font-medium">{formData.tecnicoResponsavel?.nome || 'Não informado'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Status:</span>
                            <Badge className={`ml-2 ${getStatusColor(formData.dadosServico?.status || 'Pendente')} text-white border-0`}>
                              {formData.dadosServico?.status || 'Pendente'}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Prioridade:</span>
                            <Badge className={`ml-2 ${getPriorityColor(formData.dadosServico?.prioridade || 'Média')} text-white border-0`}>
                              {formData.dadosServico?.prioridade || 'Média'}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Tipo:</span>
                          <p>{formData.dadosServico?.tipoManutencao || 'Não informado'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Motivo do Chamado */}
                {formData.dadosServico?.motivoChamado && (
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AlertCircle className="w-5 h-5" />
                        Motivo do Chamado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{formData.dadosServico.motivoChamado}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Ações Realizadas */}
                {(formData.acoesRealizadas?.desempenhoEquipamento || 
                  formData.acoesRealizadas?.problemasEncontrados || 
                  formData.acoesRealizadas?.recomendacoes) && (
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ClipboardList className="w-5 h-5" />
                        Ações Realizadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {formData.acoesRealizadas?.desempenhoEquipamento && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Desempenho do Equipamento</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{formData.acoesRealizadas.desempenhoEquipamento}</p>
                        </div>
                      )}
                      {formData.acoesRealizadas?.problemasEncontrados && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Problemas Encontrados</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{formData.acoesRealizadas.problemasEncontrados}</p>
                        </div>
                      )}
                      {formData.acoesRealizadas?.recomendacoes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Recomendações</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{formData.acoesRealizadas.recomendacoes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Horários de Trabalho */}
                {formData.horariosTrabalho?.inicioTrabalho && (
                  <Card className="border-l-4 border-l-cyan-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5" />
                        Horários de Trabalho
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Início:</span>
                          <p>{formData.horariosTrabalho.inicioTrabalho}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Fim:</span>
                          <p>{formData.horariosTrabalho.finalTrabalho}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Total:</span>
                          <p className="font-bold text-blue-600">{calcularTotalHoras()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Extras:</span>
                          <p>{formData.horariosTrabalho.horasExtras || '0:00'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Imagens Anexadas */}
                {formData.anexoImagens && formData.anexoImagens.length > 0 && (
                  <Card className="border-l-4 border-l-pink-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Camera className="w-5 h-5" />
                        Imagens Anexadas ({formData.anexoImagens.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.anexoImagens.map((image, index) => (
                          <div key={image.id} className="space-y-2">
                            <img 
                              src={image.url} 
                              alt={image.nome} 
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <div className="text-xs">
                              <Badge variant="outline" className="mb-1">
                                {image.categoria}
                              </Badge>
                              {image.descricao && (
                                <p className="text-gray-600 truncate">{image.descricao}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Custos */}
                {formData.calculadoraCustos?.tabelaPrecos && formData.calculadoraCustos.tabelaPrecos.length > 0 && (
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <DollarSign className="w-5 h-5" />
                        Resumo de Custos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Item</th>
                                <th className="text-center p-2">Qtd</th>
                                <th className="text-right p-2">Valor Unit.</th>
                                <th className="text-right p-2">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.calculadoraCustos.tabelaPrecos.map((item) => (
                                <tr key={item.id} className="border-b">
                                  <td className="p-2">{item.descricao}</td>
                                  <td className="text-center p-2">{item.quantidade}</td>
                                  <td className="text-right p-2">R$ {item.precoUnitario.toFixed(2)}</td>
                                  <td className="text-right p-2 font-medium">R$ {item.precoTotal.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center text-lg font-bold text-green-600">
                            <span>Total Geral:</span>
                            <span>R$ {(
                              formData.calculadoraCustos.tabelaPrecos.reduce((total, item) => total + item.precoTotal, 0) +
                              Object.values(formData.calculadoraCustos.custosDeslocamento).reduce((a, b) => a + b, 0)
                            ).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Assinaturas */}
                {(formData.assinaturasDigitais?.assinaturaEmpresa || formData.assinaturasDigitais?.assinaturaCliente) && (
                  <Card className="border-l-4 border-l-indigo-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PenTool className="w-5 h-5" />
                        Assinaturas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {formData.assinaturasDigitais?.assinaturaEmpresa && (
                          <div className="text-center">
                            <h4 className="font-medium text-gray-900 mb-4">Assinatura da Empresa</h4>
                            <div className="border rounded-lg p-4 bg-white">
                              <img 
                                src={formData.assinaturasDigitais.assinaturaEmpresa} 
                                alt="Assinatura da Empresa" 
                                className="max-w-full h-auto mx-auto"
                              />
                            </div>
                            <div className="mt-4 text-sm">
                              <p className="font-medium">{formData.assinaturasDigitais.nomeEmpresa}</p>
                              <p className="text-gray-600">{formData.assinaturasDigitais.cargoEmpresa}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {formData.assinaturasDigitais.dataAssinaturaEmpresa && 
                                  new Date(formData.assinaturasDigitais.dataAssinaturaEmpresa).toLocaleString('pt-BR')
                                }
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {formData.assinaturasDigitais?.assinaturaCliente && (
                          <div className="text-center">
                            <h4 className="font-medium text-gray-900 mb-4">Assinatura do Cliente</h4>
                            <div className="border rounded-lg p-4 bg-white">
                              <img 
                                src={formData.assinaturasDigitais.assinaturaCliente} 
                                alt="Assinatura do Cliente" 
                                className="max-w-full h-auto mx-auto"
                              />
                            </div>
                            <div className="mt-4 text-sm">
                              <p className="font-medium">{formData.assinaturasDigitais.nomeCliente}</p>
                              <p className="text-gray-600">{formData.assinaturasDigitais.cargoCliente}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {formData.assinaturasDigitais.dataAssinaturaCliente && 
                                  new Date(formData.assinaturasDigitais.dataAssinaturaCliente).toLocaleString('pt-BR')
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Rodapé */}
                <div className="text-center border-t pt-8 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Wrench className="w-4 h-4" />
                    <span className="font-medium">PAMASERV - Sistema de Relatórios de Manutenção</span>
                  </div>
                  <p>Este relatório foi gerado automaticamente pelo sistema</p>
                  <p>Data de geração: {new Date().toLocaleString('pt-BR')}</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                    <span>📧 {formData.dadosEmpresa?.email}</span>
                    <span>📞 {formData.dadosEmpresa?.telefone}</span>
                    <span>🌐 {formData.dadosEmpresa?.site}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista de Relatórios Completa */}
          <TabsContent value="relatorios" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileBarChart className="w-5 h-5" />
                      Todos os Relatórios ({filteredRelatorios.length})
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Gerencie todos os relatórios de manutenção
                    </p>
                  </div>
                  <Button onClick={handleNovoRelatorio} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Relatório
                  </Button>
                </div>
                
                {/* Filtros Avançados */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar relatórios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tipoFilter} onValueChange={setTipoFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Tipos</SelectItem>
                      <SelectItem value="Preventiva">Preventiva</SelectItem>
                      <SelectItem value="Corretiva">Corretiva</SelectItem>
                      <SelectItem value="Emergencial">Emergencial</SelectItem>
                      <SelectItem value="Instalação">Instalação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-')
                    setSortBy(field)
                    setSortOrder(order as 'asc' | 'desc')
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dataServico-desc">Data (Mais recente)</SelectItem>
                      <SelectItem value="dataServico-asc">Data (Mais antigo)</SelectItem>
                      <SelectItem value="cliente-asc">Cliente (A-Z)</SelectItem>
                      <SelectItem value="cliente-desc">Cliente (Z-A)</SelectItem>
                      <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                      <SelectItem value="valor-desc">Valor (Maior)</SelectItem>
                      <SelectItem value="valor-asc">Valor (Menor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRelatorios.map((relatorio) => (
                    <Card key={relatorio.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <div className={`w-4 h-4 rounded-full ${getStatusColor(relatorio.dadosServico.status)} mt-1 flex-shrink-0`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-3">
                                <h3 className="text-xl font-semibold text-gray-900 truncate">
                                  {relatorio.dadosCliente.nomeEmpresa}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getStatusColor(relatorio.dadosServico.status)} text-white border-0`}>
                                    {relatorio.dadosServico.status}
                                  </Badge>
                                  <Badge variant="outline">
                                    {relatorio.dadosServico.tipoManutencao}
                                  </Badge>
                                  <Badge className={`${getPriorityColor(relatorio.dadosServico.prioridade)} text-white border-0`}>
                                    {relatorio.dadosServico.prioridade}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <ToolIcon className="w-4 h-4 text-gray-400" />
                                  <span className="truncate">{relatorio.dadosServico.modeloEquipamento}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="truncate">{relatorio.tecnicoResponsavel.nome}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span>{relatorio.dadosCliente.dataServico}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium text-green-600">
                                    R$ {(relatorio.calculadoraCustos?.totais?.totalGeral || 0).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              
                              {relatorio.dadosServico.motivoChamado && (
                                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                  {relatorio.dadosServico.motivoChamado}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                <span>ID: {relatorio.id}</span>
                                <span>Criado: {relatorio.criadoEm.toLocaleDateString('pt-BR')}</span>
                                <span>Atualizado: {relatorio.atualizadoEm.toLocaleDateString('pt-BR')}</span>
                                <span>v{relatorio.versao}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => duplicarRelatorio(relatorio.id)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => exportarRelatorio(relatorio.id, 'pdf')}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Exportar PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => exportarRelatorio(relatorio.id, 'json')}>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Exportar JSON
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setRelatorioParaExcluir(relatorio.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredRelatorios.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum relatório encontrado
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Tente ajustar os filtros ou criar um novo relatório
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm('')
                            setStatusFilter('todos')
                            setTipoFilter('todos')
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Limpar Filtros
                        </Button>
                        <Button onClick={handleNovoRelatorio} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Novo Relatório
                        </Button>
                      </div>
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