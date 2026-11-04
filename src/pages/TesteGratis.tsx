import { useEffect, useState } from "react";
import { Bar } from "@/components/site/Bar";
import { Foot } from "@/components/site/Foot";
import { Toaster } from "@/components/ui/toaster";
import { AutomationSelector } from "@/components/AutomationSelector";
import { ChatTest } from "@/components/ChatTest";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";

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
    webhookUrl: "https://n8n.erickai.com.br/webhook/atendimento-site"
  },
  {
    id: "consultorio",
    name: "Agendamento de Consultório",
    description: "Teste o fluxo de agendamento médico automatizado",
    icon: "🏥",
    webhookUrl: "https://n8n.erickai.com.br/webhook/atendimento-site"
  },
  {
    id: "contabil",
    name: "Suporte Contábil",
    description: "Experimente o assistente de dúvidas contábeis",
    icon: "📊",
    webhookUrl: "https://n8n.erickai.com.br/webhook/atendimento-site"
  }
];

const TesteGratis = () => {
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [pendingAutomation, setPendingAutomation] = useState<Automation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // página fora do ar para visitantes: sem link no site e fora do Google enquanto não houver crédito de LLM
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "Teste grátis | Erick.AI";
    return () => meta.remove();
  }, []);

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

      <Bar />

      <Toaster />

      <main id="conteudo" className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Teste agora e veja o que <span className="text-gradient">seu cliente vai sentir</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Converse com a IA exatamente como seus clientes conversariam.
            </p>
          </div>

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
          <p
            className="text-center text-muted-foreground text-sm mt-6"
          >
            Conversa real com o agente, em tempo real.
          </p>

          {/* Chat Component */}
          {selectedAutomation && isUnlocked && (
            <div
              className="mt-12"
            >
              <ChatTest automation={selectedAutomation} />
            </div>
          )}
        </div>
      </main>

      <Foot />
    </div>
  );
};

export default TesteGratis;