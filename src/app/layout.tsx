import type { Metadata } from "next";
import { Orbitron, Montserrat } from "next/font/google";
import Script from "next/script";
import "@cidqueiroz/cdkteck-ui/global.css";
import ClientLayout from "@/components/ClientLayout";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cdkteck.com.br'),
  title: "CDK TECK - Soluções Tecnológicas",
  description: "Soluções especializadas em Engenharia de IA, Arquitetura Cloud (AWS/OCI/AZ/GCP), Automação de Processos e Business Intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
      </head>
      <body className={`${orbitron.variable} ${montserrat.variable} antialiased`}>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-PJG10ZYPBS"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PJG10ZYPBS');
          `}
        </Script>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
