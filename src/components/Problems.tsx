import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, TrendingUp, Users, Zap } from "lucide-react";

export const Problems = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      icon: Clock,
      title: "Tempo Perdido em Tarefas Repetitivas",
      description: "Sua equipe gasta horas em processos manuais?",
      result: "-70% de tempo em tarefas operacionais",
    },
    {
      icon: Users,
      title: "Atendimento Manual Não Escala",
      description: "Demanda crescente mas capacidade limitada?",
      result: "Atendimento 24/7 sem aumentar equipe",
    },
    {
      icon: TrendingUp,
      title: "Perda de Oportunidades",
      description: "Leads sem resposta rápida = vendas perdidas",
      result: "+40% de conversão com follow-up automático",
    },
    {
      icon: Zap,
      title: "Processos Desconectados",
      description: "Dados espalhados entre sistemas diferentes?",
      result: "Integração total entre CRM, WhatsApp e IA",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            O Que Eu <span className="text-gradient">Resolvo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformo gargalos operacionais em oportunidades de crescimento
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <problem.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-display font-semibold text-foreground">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground">{problem.description}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      <p className="text-sm font-semibold text-success">{problem.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
