import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade | Galorys eSports",
  description: "Política de privacidade do site da Galorys eSports.",
}

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Última atualização: Janeiro de 2026
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Informações que Coletamos</h2>
            <p className="text-muted-foreground mb-4">
              Coletamos informações que você nos fornece diretamente, como quando cria uma conta, preenche um formulário de contato ou interage com nosso site. Isso pode incluir seu nome, endereço de e-mail e outras informações de contato.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-muted-foreground mb-4">
              Usamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços</li>
              <li>Processar e gerenciar sua conta</li>
              <li>Enviar comunicações sobre atualizações, novidades e promoções</li>
              <li>Responder a seus comentários e perguntas</li>
              <li>Proteger contra atividades fraudulentas</li>
            </ul>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground mb-4">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta política ou com seu consentimento explícito.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Segurança</h2>
            <p className="text-muted-foreground mb-4">
              Implementamos medidas de segurança projetadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet é 100% seguro.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site, analisar como você usa nossos serviços e personalizar conteúdo. Você pode configurar seu navegador para recusar cookies.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. Seus Direitos</h2>
            <p className="text-muted-foreground mb-4">
              Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos, entre em contato conosco através da página de contato.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">7. Menores de Idade</h2>
            <p className="text-muted-foreground mb-4">
              Nosso site não é direcionado a menores de 13 anos. Não coletamos intencionalmente informações pessoais de crianças menores de 13 anos.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">8. Alterações nesta Política</h2>
            <p className="text-muted-foreground mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova política nesta página.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">9. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através da página de contato.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
