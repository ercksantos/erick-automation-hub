import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMobileMenuOpen(false);
      }
    } else {
      navigate(`/#${id}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Sobre", id: "sobre" },
    { label: "Projetos", id: "projetos" },
    { label: "Como Funciona", id: "processo" },
    { label: "Depoimentos", id: "depoimentos" },
    { label: "Contato", id: "contato" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      // ALTERAÇÃO AQUI:
      // Mudei de 'top-10' para 'top-7 md:top-8'.
      // Isso faz o menu "colar" logo abaixo da UrgencyBar (que tem +- 30px de altura).
      className={`fixed top-7 md:top-8 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/70 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-background/10 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-display font-bold text-gradient cursor-pointer"
            >
              Erick.AI
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center gap-3"
          >
            <Link to="/teste-gratis">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 font-semibold"
              >
                Testar Grátis
              </Button>
            </Link>
            <Button
              onClick={() => scrollToSection("contato")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary"
            >
              Solicitar Demo
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <Link to="/teste-gratis" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 w-full"
                >
                  Testar Grátis
                </Button>
              </Link>
              <Button
                onClick={() => scrollToSection("contato")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                Solicitar Demo
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};