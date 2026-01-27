import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso | Galorys eSports",
  description: "Termos de uso do site da Galorys eSports.",
}

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Termos de Uso
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Última atualização: Janeiro de 2026
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground mb-4">
              Ao acessar e usar o site da Galorys eSports, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso site.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Uso do Site</h2>
            <p className="text-muted-foreground mb-4">
              O conteúdo deste site é apenas para sua informação geral e uso pessoal. Está sujeito a alterações sem aviso prévio. Você não pode usar o site para qualquer finalidade ilegal ou não autorizada.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. Contas de Usuário</h2>
            <p className="text-muted-foreground mb-4">
              Ao criar uma conta em nosso site, você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em aceitar a responsabilidade por todas as atividades que ocorram em sua conta.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Sistema de Pontos</h2>
            <p className="text-muted-foreground mb-4">
              Os pontos ganhos através do site são virtuais e não têm valor monetário. A Galorys reserva-se o direito de modificar, suspender ou encerrar o sistema de pontos a qualquer momento.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Propriedade Intelectual</h2>
            <p className="text-muted-foreground mb-4">
              Todo o conteúdo incluído no site, como textos, gráficos, logos, imagens, bem como a compilação destes, é propriedade da Galorys ou de seus fornecedores de conteúdo e está protegido pelas leis de direitos autorais.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground mb-4">
              A Galorys não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou da incapacidade de usar os materiais ou serviços do site.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">7. Modificações</h2>
            <p className="text-muted-foreground mb-4">
              Reservamo-nos o direito de revisar estes termos a qualquer momento. Ao usar este site, você concorda em estar vinculado à versão atual destes termos de uso.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">8. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da página de contato.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
