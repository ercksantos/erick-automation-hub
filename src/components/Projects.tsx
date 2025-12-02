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
  video?: string; // suporte a vídeo
  features: string[];
  technologies: string[];
};

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState("Todos");

  const projects: Project[] = [
    {
      id: 1,
      title: "Automação CRM + WhatsApp",
      description: "Sistema completo de atendimento automatizado para concessionária",
      tags: ["n8n", "CRM", "WhatsApp"],
      thumbnail: "/crm-carros.png",
      video: "/crm-carros-video.mp4", // <<< aqui está o vídeo
      features: [
        "Respostas automáticas via WhatsApp",
        "Qualificação de leads com IA",
        "Integração com CRM existente",
        "Gestão de veículos interativa",
        "Dashboard de métricas em tempo real",
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
      video: "/video-secretaria.mp4",
      features: [
        "Lembretes automáticos por WhatsApp",
        "Confirmação de presença via chatbot",
        "Reagendamento inteligente",
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
      video: "/crm-contabil-video.mp4",
      features: [
        "Extração automática de dados de NF-e",
        "Classificação com IA",
        "Geração de relatórios mensais",
        "Integração com sistema contábil",
        "Alertas de vencimentos",
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
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="projetos" ref={ref} className="py-24">
      <div className="container mx-auto px-4">
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

        {/* Filters */}
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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              onClick={() => setSelectedProject(project)}
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

      {/* Project Modal */}
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

                {/* Media: vídeo ou imagem */}
                {selectedProject.video ? (
                  <video
                    src={selectedProject.video}
                    controls
                    className="w-full rounded-lg"
                  />
                ) : (
                  <img
                    src={selectedProject.thumbnail}
                    alt={selectedProject.title}
                    className="w-full rounded-lg"
                  />
                )}

                <p className="text-muted-foreground">{selectedProject.description}</p>

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
