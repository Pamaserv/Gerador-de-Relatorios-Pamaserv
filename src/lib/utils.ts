import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcularHorasTrabalho(inicioTrabalho: string, finalTrabalho: string, horarioAlmoco?: string, retornoAlmoco?: string): string {
  if (!inicioTrabalho || !finalTrabalho) return '0:00';
  
  const inicio = new Date(`2000-01-01T${inicioTrabalho}:00`);
  const fim = new Date(`2000-01-01T${finalTrabalho}:00`);
  
  let totalMinutos = (fim.getTime() - inicio.getTime()) / (1000 * 60);
  
  // Subtrair tempo de almoço se informado
  if (horarioAlmoco && retornoAlmoco) {
    const saidaAlmoco = new Date(`2000-01-01T${horarioAlmoco}:00`);
    const voltaAlmoco = new Date(`2000-01-01T${retornoAlmoco}:00`);
    const minutosAlmoco = (voltaAlmoco.getTime() - saidaAlmoco.getTime()) / (1000 * 60);
    totalMinutos -= minutosAlmoco;
  }
  
  const horas = Math.floor(totalMinutos / 60);
  const minutos = Math.round(totalMinutos % 60);
  
  return `${horas}:${minutos.toString().padStart(2, '0')}`;
}

export function formatarHoras(horas: number): string {
  const horasInteiras = Math.floor(horas);
  const minutos = Math.round((horas - horasInteiras) * 60);
  return `${horasInteiras}h ${minutos}min`;
}

export function calcularPrecoTotal(quantidade: number, precoUnitario: number, desconto: number = 0): number {
  const subtotal = quantidade * precoUnitario;
  const valorDesconto = (subtotal * desconto) / 100;
  return subtotal - valorDesconto;
}

export function gerarNumeroRelatorio(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-4);
  
  return `REL-${ano}${mes}${dia}-${timestamp}`;
}

export function formatarCPF(cpf: string): string {
  const numeros = cpf.replace(/\D/g, '');
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarCPF(cpf: string): boolean {
  const numeros = cpf.replace(/\D/g, '');
  
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;
  
  // Validação do primeiro dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros[i]) * (10 - i);
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(numeros[9]) !== digito1) return false;
  
  // Validação do segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i]) * (11 - i);
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  
  return parseInt(numeros[10]) === digito2;
}