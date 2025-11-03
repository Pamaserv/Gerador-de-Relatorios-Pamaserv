import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAMASERV - Sistema de Relatórios de Manutenção",
  description: "Sistema profissional para criação e gestão de relatórios de manutenção técnica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}