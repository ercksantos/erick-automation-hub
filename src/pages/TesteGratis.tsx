import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UrgencyBar } from "@/components/UrgencyBar"; // Importação da barra
import { AutomationSelector } from "@/components/AutomationSelector";
import { ChatTest } from "@/components/ChatTest";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { motion } from "framer-motion";

export interface Automation {
  id: string;
  name: string;
  description: string;
  icon: string;
  webhookUrl: string;
}

const automations: Automation[] = [
  {
    id: "concessionaria",
    name: "Atendimento de Concessionária",
    description: "Simule o atendimento automatizado para leads de veículos",
    icon: "🚗",
    webhookUrl: "https://bleatinglanternfish-n8n.cloudfy.cloud/webhook/atendimento-site"
  },
  {
    id: "consultorio",
    name: "Agendamento de Consultório",
    description: "Teste o fluxo de agendamento médico automatizado",
    icon: "🏥",
    webhookUrl: "https://bleatinglanternfish-n8n.cloudfy.cloud/webhook/atendimento-site"
  },
  {
    id: "contabil",
    name: "Suporte Contábil",
    description: "Experimente o assistente de dúvidas contábeis",
    icon: "📊",
    webhookUrl: "https://bleatinglanternfish-n8n.cloudfy.cloud/webhook/atendimento-site"
  }
];

const TesteGratis = () => {
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [pendingAutomation, setPendingAutomation] = useState<Automation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleAutomationSelect = (automation: Automation) => {
    if (isUnlocked && selectedAutomation?.id === automation.id) {
      return;
    }
    setPendingAutomation(automation);
    setIsModalOpen(true);
  };

  const handleLeadSubmit = (data: { email: string; phone: string }) => {
    console.log("Lead capturado:", data, "Automação:", pendingAutomation?.name);
    setSelectedAutomation(pendingAutomation);
    setIsUnlocked(true);
    setIsModalOpen(false);
    setPendingAutomation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Barra de Urgência no topo */}
      <UrgencyBar />

      {/* 2. Header logo abaixo */}
      <Header />

      {/* 3. Espaçamento ajustado:
          pt-36 (mobile) e pt-44 (desktop)
          Isso garante que o título apareça abaixo do Header e da Barra.
      */}
      <main className="pt-36 md:pt-44 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Teste agora e veja o que <span className="text-gradient">seu cliente vai sentir</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Converse com a IA exatamente como seus clientes conversariam.
            </p>
          </motion.div>

          {/* Automation Selector */}
          <AutomationSelector
            automations={automations}
            selectedAutomation={selectedAutomation}
            onSelect={handleAutomationSelect}
          />

          {/* Lead Capture Modal */}
          <LeadCaptureModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onSubmit={handleLeadSubmit}
            automationName={pendingAutomation?.name || ""}
          />

          {/* Legend */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-muted-foreground text-sm mt-6"
          >
            ⚡ Simulação real em tempo real
          </motion.p>

          {/* Chat Component */}
          {selectedAutomation && isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <ChatTest automation={selectedAutomation} />
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TesteGratis;