'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Plus, 
  Trash2,
  FileImage,
  Camera
} from 'lucide-react'
import { AnexoImagem, ItemTabelaPrecos } from '@/lib/types'

// Componente para Upload de Imagens - Responsivo
interface ImageUploadProps {
  images: AnexoImagem[]
  onImagesChange: (images: AnexoImagem[]) => void
  maxSize?: number // MB
  maxImages?: number
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxSize = 5, 
  maxImages = 10 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)

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
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newImages: AnexoImagem[] = []
    
    Array.from(files).forEach((file, index) => {
      if (images.length + newImages.length >= maxImages) return
      
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Arquivo ${file.name} é muito grande. Máximo ${maxSize}MB.`)
        return
      }

      if (!file.type.startsWith('image/')) {
        alert(`Arquivo ${file.name} não é uma imagem válida.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage: AnexoImagem = {
          id: `img-${Date.now()}-${index}`,
          nome: file.name,
          url: e.target?.result as string,
          tipo: file.type,
          tamanho: file.size,
          descricao: ''
        }
        newImages.push(newImage)
        
        if (newImages.length === Array.from(files).length || newImages.length + images.length >= maxImages) {
          onImagesChange([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id))
  }

  const updateImageDescription = (id: string, descricao: string) => {
    onImagesChange(images.map(img => 
      img.id === id ? { ...img, descricao } : img
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          Anexar Imagens
        </h3>
        <Badge variant="outline" className="text-xs sm:text-sm">
          {images.length}/{maxImages}
        </Badge>
      </div>

      {/* Área de Upload - Responsiva */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={images.length >= maxImages}
        />
        
        <div className="space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          
          <div>
            <p className="text-sm sm:text-lg font-medium text-gray-700">
              {images.length >= maxImages 
                ? 'Limite máximo atingido' 
                : 'Arraste imagens aqui ou clique para selecionar'
              }
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              PNG, JPG, GIF até {maxSize}MB • Máximo {maxImages} imagens
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Imagens - Grid Responsivo */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.nome}
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <span className="text-xs sm:text-sm font-medium truncate">{image.nome}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {(image.tamanho / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="space-y-1">
                    <Label htmlFor={`desc-${image.id}`} className="text-xs">
                      Descrição (opcional)
                    </Label>
                    <Textarea
                      id={`desc-${image.id}`}
                      placeholder="Descreva a imagem..."
                      value={image.descricao || ''}
                      onChange={(e) => updateImageDescription(image.id, e.target.value)}
                      rows={2}
                      className="text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente para Tabela de Preços - Responsivo
interface TabelaPrecosProps {
  items: ItemTabelaPrecos[]
  onItemsChange: (items: ItemTabelaPrecos[]) => void
}

export function TabelaPrecos({ items, onItemsChange }: TabelaPrecosProps) {
  const adicionarItem = () => {
    const novoItem: ItemTabelaPrecos = {
      id: `item-${Date.now()}`,
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

  const atualizarItem = (id: string, campo: keyof ItemTabelaPrecos, valor: any) => {
    const novosItems = items.map(item => {
      if (item.id === id) {
        const itemAtualizado = { ...item, [campo]: valor }
        
        // Recalcular preço total quando quantidade, preço unitário ou desconto mudarem
        if (campo === 'quantidade' || campo === 'precoUnitario' || campo === 'desconto') {
          const subtotal = itemAtualizado.quantidade * itemAtualizado.precoUnitario
          const valorDesconto = subtotal * (itemAtualizado.desconto / 100)
          itemAtualizado.precoTotal = subtotal - valorDesconto
        }
        
        return itemAtualizado
      }
      return item
    })
    onItemsChange(novosItems)
  }

  const categorias = ['Serviço', 'Peça', 'Material', 'Deslocamento', 'Outros']

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-semibold">Tabela de Preços</h3>
        <Button onClick={adicionarItem} size="sm" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Nenhum item adicionado</p>
            <Button onClick={adicionarItem} variant="outline" className="w-full sm:w-auto">
              Adicionar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base">Item {index + 1}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removerItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Descrição</Label>
                    <Textarea
                      value={item.descricao}
                      onChange={(e) => atualizarItem(item.id, 'descricao', e.target.value)}
                      placeholder="Descreva o item/serviço"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Categoria</Label>
                    <Select
                      value={item.categoria}
                      onValueChange={(value) => atualizarItem(item.id, 'categoria', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(categoria => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Quantidade</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(item.id, 'quantidade', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Preço Unit. (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.precoUnitario}
                      onChange={(e) => atualizarItem(item.id, 'precoUnitario', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Desconto (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.desconto}
                      onChange={(e) => atualizarItem(item.id, 'desconto', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Total (R$)</Label>
                    <Input
                      type="text"
                      value={item.precoTotal.toFixed(2)}
                      readOnly
                      className="bg-gray-50 font-semibold text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="font-semibold text-blue-800 text-sm sm:text-base">Total dos Itens:</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-900">
                R$ {items.reduce((total, item) => total + item.precoTotal, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente para Assinatura Digital (Canvas) - Responsivo e Corrigido
interface AssinaturaCanvasProps {
  assinatura: string
  onAssinaturaChange: (assinatura: string) => void
  width?: number
  height?: number
}

export function AssinaturaCanvas({ 
  assinatura, 
  onAssinaturaChange, 
  width = 400, 
  height = 200 
}: AssinaturaCanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Configurar canvas quando componente monta
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Configurações do contexto para melhor qualidade de desenho
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = 2
        ctx.strokeStyle = '#000000'
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Se já existe assinatura, carregar no canvas
        if (assinatura) {
          const img = new Image()
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
          }
          img.src = assinatura
        }
      }
    }
  }, [assinatura])

  // Função para obter coordenadas precisas (mouse e touch) - CORRIGIDA
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    let clientX, clientY
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  // Eventos de mouse
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const coords = getCoordinates(e)
    setIsDrawing(true)
    setLastPosition(coords)
    
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const coords = getCoordinates(e)
    const canvas = canvasRef.current
    
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(lastPosition.x, lastPosition.y)
        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
        setLastPosition(coords)
      }
    }
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()
    setIsDrawing(false)
    
    const canvas = canvasRef.current
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png')
      onAssinaturaChange(dataURL)
    }
  }

  // Eventos de touch (mobile) - CORRIGIDOS
  const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const coords = getCoordinates(e)
    setIsDrawing(true)
    setLastPosition(coords)
    
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)
      }
    }
  }

  const touchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const coords = getCoordinates(e)
    const canvas = canvasRef.current
    
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(lastPosition.x, lastPosition.y)
        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
        setLastPosition(coords)
      }
    }
  }

  const stopTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()
    setIsDrawing(false)
    
    const canvas = canvasRef.current
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png')
      onAssinaturaChange(dataURL)
    }
  }

  const limparAssinatura = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onAssinaturaChange('')
      }
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded cursor-crosshair bg-white w-full touch-none"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            aspectRatio: `${width}/${height}`
          }}
          // Eventos de mouse
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          // Eventos de touch
          onTouchStart={startTouchDrawing}
          onTouchMove={touchDraw}
          onTouchEnd={stopTouchDrawing}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-xs sm:text-sm text-gray-600">
          Clique e arraste para assinar (funciona com mouse e toque)
        </p>
        <Button variant="outline" size="sm" onClick={limparAssinatura} className="w-full sm:w-auto">
          <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Limpar
        </Button>
      </div>
    </div>
  )
}