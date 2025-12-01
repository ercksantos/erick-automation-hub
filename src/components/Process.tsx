import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardCheck, Lightbulb, Rocket, BarChart3 } from "lucide-react";

export const Process = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: ClipboardCheck,
      title: "Diagnóstico",
      description: "Analiso seu processo atual, identifico gargalos e oportunidades de automação",
    },
    {
      icon: Lightbulb,
      title: "Prova de Conceito",
      description: "Crio um MVP funcional para validar a solução antes do investimento total",
    },
    {
      icon: Rocket,
      title: "Deploy",
      description: "Implemento a automação completa com integração aos seus sistemas",
    },
    {
      icon: BarChart3,
      title: "Monitoramento",
      description: "Acompanho métricas e otimizo continuamente para máximo resultado",
    },
  ];

  return (
    <section id="processo" ref={ref} className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Como <span className="text-gradient">Funciona</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Metodologia comprovada para entregar resultados rápidos
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center z-10">
                  <span className="text-xl font-bold text-primary">{index + 1}</span>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 h-full hover:border-primary/50 transition-all duration-300 group">
                  <div className="mb-6 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-full">
            <span className="text-2xl">⚡</span>
            <span className="font-semibold">Primeiros resultados em 2-4 semanas</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
