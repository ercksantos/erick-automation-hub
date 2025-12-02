import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  const technologies = ["n8n", "IA Generativa", "APIs", "CRM", "Fluxos Complexos", "WhatsApp", "OpenAI", "Automação"];
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section id="sobre" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {}} transition={{
          duration: 0.8
        }} className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl" />
              <img alt="Erick - Especialista em Automação" className="relative rounded-full border-4 border-primary/20 shadow-2xl w-full h-full object-cover" src="/imagem-sobre-mim.png" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {}} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Sobre <span className="text-gradient">Mim</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sou Erick, desenvolvedor full-stack e especialista em automações com IA.
                Eu crio sistemas que resolvem gargalos operacionais e entregam métricas
                reais.
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Há mais de 2 anos transformando processos manuais em fluxos inteligentes. Minha missão é ajudar empresas a escalarem sem perder qualidade no atendimento, usando automação estratégica e IA.
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Tecnologias & Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => <motion.div key={tech} initial={{
                opacity: 0,
                scale: 0.8
              }} animate={isInView ? {
                opacity: 1,
                scale: 1
              } : {}} transition={{
                delay: 0.4 + index * 0.1
              }}>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors px-4 py-1.5">
                      {tech}
                    </Badge>
                  </motion.div>)}
              </div>
            </div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={isInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            delay: 0.6
          }}>
              <Button onClick={() => scrollToSection("projetos")} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                Ver Portfólio
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>;
};