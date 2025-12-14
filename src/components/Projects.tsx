import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

type Project = {
  id: number;
  title: string;
  description: string;
  result: string; // Novo campo para destaque de resultado
  tags: string[];
  thumbnail: string;
  video?: string[];
  features: string[];
  technologies: string[];
};

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState("Todos");

  const [videoIndex, setVideoIndex] = useState(0);

  const nextVideo = () => {
    if (!selectedProject?.video) return;
    setVideoIndex((prev) => (prev + 1) % selectedProject.video.length);
  };

  const prevVideo = () => {
    if (!selectedProject?.video) return;
    setVideoIndex((prev) => (prev - 1 + selectedProject.video.length) % selectedProject.video.length);
  };

  const projects: Project[] = [
    {
      id: 1,
      title: "Automação Concessionária",
      description: "Atendimento automático que qualifica e agenda visitas.",
      result: "+40% em recuperação de leads",
      tags: ["Vendas", "CRM", "WhatsApp"],
      thumbnail: "/crm-carros.png",
      video: ["/crm-carros-video.mp4", "/conversa-carros.mp4"],
      features: [
        "Atendimento imediato 24/7",
        "Qualificação automática de leads",
        "Agendamento de Test Drive",
        "Follow-up de leads frios",
        "Integração total com CRM",
      ],
      technologies: ["n8n", "OpenAI", "WhatsApp API", "PostgreSQL"],
    },
    {
      id: 2,
      title: "Clínica Inteligente",
      description: "Gestão de agenda que elimina buracos na programação.",
      result: "Redução de 60% nas faltas",
      tags: ["Saúde", "Agenda", "IA"],
      thumbnail: "/secretaria.png",
      video: ["/video-secretaria.mp4"],
      features: [
        "Confirmação automática via WhatsApp",
        "Reagendamento sem humano",
        "Lembretes sequenciais inteligentes",
        "Lista de espera automatizada",
        "Sincronização com Google Calendar",
      ],
      technologies: ["n8n", "Google Calendar", "Twilio", "Node.js"],
    },
    {
      id: 3,
      title: "Contabilidade Digital",
      description: "Robô que processa documentos e notifica clientes.",
      result: "150h/mês economizadas",
      tags: ["Financeiro", "Docs", "Automação"],
      thumbnail: "/crm-contabil.png",
      video: ["/crm-contabil-video.mp4"],
      features: [
        "Leitura automática de notas (OCR)",
        "Classificação fiscal com IA",
        "Envio de guias de imposto via Zap",
        "Cobrança automática de inadimplentes",
        "Relatórios de pendências",
      ],
      technologies: ["n8n", "Python", "OCR", "API Gov.br"],
    },
  ];

  const filters = ["Todos", "Vendas", "Saúde", "Financeiro"];

  const filteredProjects =
    activeFilter === "Todos"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  return (
    <section id="projetos" ref={ref} className="py-24 bg-secondary/5">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Casos de <span className="text-gradient">Sucesso</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Veja como empresas estão escalando com nossas automações
          </p>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border-primary/20 hover:border-primary/50 bg-background"
              }
            >
              {filter}
            </Button>
          ))}
        </motion.div>

        {/* PROJECTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              onClick={() => {
                setSelectedProject(project);
                setVideoIndex(0);
              }}
              className="group cursor-pointer h-full"
            >
              <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
                <div className="aspect-video overflow-hidden bg-muted relative">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge de Resultado na Thumbnail */}
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    {project.result}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/5 text-primary text-xs hover:bg-primary/10"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-6 flex-grow">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-2 text-primary text-sm font-semibold mt-auto group/link">
                    Ver detalhes do case
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border p-0 gap-0">
          {selectedProject && (
            <div className="flex flex-col">
              {/* VIDEO HEADER */}
              <div className="relative aspect-video bg-black">
                {selectedProject.video && selectedProject.video.length > 0 ? (
                  <>
                    <video
                      src={selectedProject.video[videoIndex]}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                    {selectedProject.video.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={prevVideo}
                          className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={nextVideo}
                          className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={selectedProject.thumbnail}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <DialogTitle className="text-3xl font-display font-bold text-foreground">
                      {selectedProject.title}
                    </DialogTitle>
                    <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5 px-3 py-1">
                      {selectedProject.result}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* FEATURES */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      O que o sistema faz
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary text-xs font-bold">✓</span>
                          </div>
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA BOX */}
                  <div className="bg-secondary/30 rounded-xl p-6 flex flex-col justify-center space-y-4 border border-border/50">
                    <h4 className="font-semibold text-foreground">
                      Precisa de algo similar?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Podemos adaptar essa estrutura para o seu negócio em tempo recorde.
                    </p>
                    <Button
                      onClick={() => {
                        const message = `Olá Erick! Vi o case de sucesso "${selectedProject.title}" no seu site e gostaria de implementar algo parecido na minha empresa.`;
                        window.open(`https://wa.me/555391631843?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
                    >
                      <span className="flex items-center gap-2">
                        {/* Ícone do WhatsApp */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Quero Implementar no WhatsApp
                      </span>
                    </Button>
                    <p className="text-xs text-center text-muted-foreground opacity-70">
                      Consultoria inicial gratuita
                    </p>
                  </div>
                </div>

                {/* TECH TAGS */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Stack Tecnológica:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-border text-muted-foreground font-normal">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};