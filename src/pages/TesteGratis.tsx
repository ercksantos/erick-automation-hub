import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AutomationSelector } from "@/components/AutomationSelector";
import { ChatTest } from "@/components/ChatTest";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Teste grátis minha automação
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Converse com a IA exatamente como seus clientes conversariam.
            </p>
          </motion.div>

          {/* Automation Selector */}
          <AutomationSelector
            automations={automations}
            selectedAutomation={selectedAutomation}
            onSelect={setSelectedAutomation}
          />

          {/* Chat Component */}
          {selectedAutomation && (
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
