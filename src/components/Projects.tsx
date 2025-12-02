import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

type Project = {
  id: number;
  title: string;
  description: string;
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
      title: "Automação CRM + WhatsApp",
      description: "Sistema completo de atendimento automatizado para concessionária",
      tags: ["n8n", "CRM", "WhatsApp"],
      thumbnail: "/crm-carros.png",
      video: ["/crm-carros-video.mp4", "/conversa-carros.mp4"],
      features: [
        "Respostas automáticas via WhatsApp",
        "Qualificação de leads com IA",
        "Integração com CRM existente",
        "Gestão de veículos interativa",
        "Dashboard de métricas em tempo real",
        "IA treinada para convencer o cliente",
        "Follow-up inteligente baseado em comportamento",
      ],
      technologies: ["n8n", "OpenAI", "WhatsApp API", "PostgreSQL"],
    },

    {
      id: 2,
      title: "Agendamento Inteligente",
      description: "Sistema de lembretes e gestão de consultas para clínica",
      tags: ["n8n", "Consultório", "IA"],
      thumbnail: "/secretaria.png",
      video: ["/video-secretaria.mp4"],
      features: [
        "Lembretes automáticos por WhatsApp",
        "Confirmação de presença via chatbot",
        "Reagendamento inteligente",
        "Lembrete diário para o profissional",
        "Redução de 60% nas faltas",
        "Integração com Google Calendar",
      ],
      technologies: ["n8n", "Google Calendar API", "Twilio", "Node.js"],
    },

    {
      id: 3,
      title: "CRM + Geração de Documentos Fiscais",
      description: "Automação completa para escritório contábil",
      tags: ["n8n", "Contábil", "APIs"],
      thumbnail: "/crm-contabil.png",
      video: ["/crm-contabil-video.mp4"],
      features: [
        "Extração automática de dados de NF-e",
        "Classificação com IA",
        "Geração de relatórios mensais",
        "Integração com sistema contábil",
        "Alertas de vencimentos",
        "Atendimento humanizado",
      ],
      technologies: ["n8n", "Python", "OCR", "API Gov.br"],
    },
  ];

  const filters = ["Todos", "n8n", "CRM", "Consultório", "Contábil"];

  const filteredProjects =
    activeFilter === "Todos"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  const scrollToContact = () => {
    const element = document.getElementById("contato");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="projetos" ref={ref} className="py-24">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Projetos <span className="text-gradient">Realizados</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Resultados reais em automação e IA
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
                  ? "bg-primary text-primary-foreground"
                  : "border-primary/30 hover:border-primary/50"
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
              className="group cursor-pointer"
            >
              <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-sm">{project.description}</p>

                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    Ver case completo
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-display">
                  {selectedProject.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">

                {/* CARROSSEL DE VÍDEOS */}
                {selectedProject.video && selectedProject.video.length > 0 ? (
                  <div className="relative">
                    <video
                      src={selectedProject.video[videoIndex]}
                      controls
                      autoPlay
                      className="w-full rounded-lg"
                    />

                    {/* CONTROLES */}
                    {selectedProject.video.length > 1 && (
                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={prevVideo}
                          className="px-4 py-2 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          ◀
                        </button>

                        <span className="text-gray-600 text-sm">
                          {videoIndex + 1} / {selectedProject.video.length}
                        </span>

                        <button
                          onClick={nextVideo}
                          className="px-4 py-2 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          ▶
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={selectedProject.thumbnail}
                    alt={selectedProject.title}
                    className="w-full rounded-lg"
                  />
                )}

                <p className="text-muted-foreground">{selectedProject.description}</p>

                {/* FEATURES */}
                <div>
                  <h4 className="font-semibold mb-3">Funcionalidades</h4>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TECHNOLOGIES */}
                <div>
                  <h4 className="font-semibold mb-3">Tecnologias</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedProject(null);
                    scrollToContact();
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  Quero esse resultado
                </Button>

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
