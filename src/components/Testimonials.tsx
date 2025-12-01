import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Diretor Comercial",
      company: "Concessionária Premium",
      content:
        "A automação com IA reduziu nosso tempo de resposta de 4 horas para 2 minutos. As conversões aumentaram 35% no primeiro mês.",
      metric: "+35% conversão",
      avatar: "/placeholder.svg",
    },
    {
      name: "Dra. Ana Santos",
      role: "Proprietária",
      company: "Clínica Saúde +",
      content:
        "As faltas em consultas caíram 60% com os lembretes automatizados. Economizamos horas de ligações manuais toda semana.",
      metric: "-60% faltas",
      avatar: "/placeholder.svg",
    },
    {
      name: "Roberto Martins",
      role: "Sócio",
      company: "Contabilidade Express",
      content:
        "O processamento de documentos que levava dias agora é feito em minutos. Nossa equipe foca no que realmente importa: atendimento.",
      metric: "-70% tempo processamento",
      avatar: "/placeholder.svg",
    },
  ];

  return (
    <section id="depoimentos" ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Resultados <span className="text-gradient">Comprovados</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            O que meus clientes dizem sobre as automações
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-card border border-border rounded-2xl p-8 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground/90 mb-6 flex-1 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Metric Badge */}
                  <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6 self-start">
                    <span className="text-lg">📈</span>
                    <span className="font-semibold text-sm">{testimonial.metric}</span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-primary/20"
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </div>
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
