import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ClientLogos } from "@/components/client-logos"
import { PortfolioShowcase } from "@/components/portfolio-showcase"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ApproachSection } from "@/components/approach-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { ChatProvider } from "@/components/chat-provider"
import { ChatModal } from "@/components/chat-modal"

export default function Home() {
  return (
    <ChatProvider>
      <main className="min-h-screen">
        <Header />
        <Hero />
        <PortfolioShowcase />
        <ClientLogos />
        <StatsSection />
        <ServicesSection />
        <ApproachSection />
        <PricingSection />
        <TestimonialsSection />
        <CaseStudiesSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
      <ChatModal />
    </ChatProvider>
  )
}
