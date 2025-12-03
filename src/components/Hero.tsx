import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 md:pt-32">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))]">
        <div className="absolute inset-0 opacity-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20 blur-3xl"
              style={{
                width: `${260 + i * 180}px`,
                height: `${260 + i * 180}px`,
                left: `${15 + i * 30}%`,
                top: `${8 + i * 18}%`,
              }}
              animate={{
                y: [0, -25, 0],
                x: [0, 18, 0],
                scale: [1, 1.07, 1],
              }}
              transition={{
                duration: 7 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT TEXT */}
          <div className="space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight"
            >
              Automação com IA que{" "}
              <span className="text-gradient">impulsiona atendimento</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Fluxos inteligentes com n8n + IA para reduzir tarefas manuais,
              aumentar conversão e escalar seu atendimento sem aumentar equipe.
            </motion.p>

            {/* CTA BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("contato")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg group shadow-xl"
              >
                Solicitar Demo
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("projetos")}
                className="border-primary/40 text-primary hover:bg-primary/10 text-lg"
              >
                <Play className="mr-2 transition-transform group-hover:scale-110" />
                Ver Projetos
              </Button>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="grid grid-cols-3 gap-6 pt-4 md:pt-8"
            >
              {[
                { value: "30+", label: "Projetos" },
                { value: "50%", label: "Menos Tempo" },
                { value: "24/7", label: "Automação" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-display font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT IMAGE – NOW ALSO VISIBLE ON MOBILE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full max-w-sm mx-auto lg:max-w-none"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
              <video 
                src="/principal.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="relative rounded-2xl border border-primary/20 shadow-2xl w-full"
              ></video>

            </div>
          </motion.div>

        </div>
      </div>

      {/* SCROLL INDICATOR — DESKTOP ONLY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};