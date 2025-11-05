import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      relatorios_manutencao: {
        Row: {
          id: string
          titulo: string | null
          dados_empresa: any
          dados_cliente: any
          dados_servico: any
          acoes_realizadas: any
          tecnico_responsavel: any
          horarios_trabalho: any
          anexo_imagens: any
          calculadora_custos: any
          assinaturas_digitais: any
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id: string
          titulo?: string | null
          dados_empresa?: any
          dados_cliente?: any
          dados_servico?: any
          acoes_realizadas?: any
          tecnico_responsavel?: any
          horarios_trabalho?: any
          anexo_imagens?: any
          calculadora_custos?: any
          assinaturas_digitais?: any
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          titulo?: string | null
          dados_empresa?: any
          dados_cliente?: any
          dados_servico?: any
          acoes_realizadas?: any
          tecnico_responsavel?: any
          horarios_trabalho?: any
          anexo_imagens?: any
          calculadora_custos?: any
          assinaturas_digitais?: any
          criado_em?: string
          atualizado_em?: string
        }
      }
    }
  }
}