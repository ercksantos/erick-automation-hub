import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { email: string; phone: string }) => void;
  automationName: string;
}

const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 2) {
    return numbers.length ? `(${numbers}` : "";
  }
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const STORAGE_KEY = "erickai_user_lead";

export const LeadCaptureModal = ({
  open,
  onOpenChange,
  onSubmit,
  automationName
}: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(false);

  useEffect(() => {
    if (open) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const user = JSON.parse(savedData);
          if (user.name && user.email && user.phone) {
            setIsAutoLogging(true);
            setTimeout(() => {
              toast({
                title: `Bem-vindo(a) de volta, ${user.name}!`,
                description: `Iniciando teste da automação: ${automationName}`,
              });
              onSubmit({ email: user.email, phone: user.phone });
              onOpenChange(false);
              setIsAutoLogging(false);
            }, 1000);
          }
        } catch (e) {
          console.error("Erro ao ler dados salvos", e);
        }
      }
    }
  }, [open, automationName, onSubmit, onOpenChange, toast]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const webhookData = {
      name: name,
      company: "Lead via Teste Grátis",
      whatsapp: phone,
      email: email,
      message: `Lead capturado ao iniciar teste da automação: ${automationName}`
    };

    try {
      const res = await fetch("https://bleatinglanternfish-n8n.cloudfy.cloud/webhook/contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookData),
      });

      if (!res.ok) throw new Error("Erro ao salvar lead");

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, phone }));

      toast({
        title: "Acesso liberado!",
        description: "Iniciando seu teste agora...",
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      onSubmit({ email, phone });
      onOpenChange(false);

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível registrar seu acesso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = name.length > 2 && email.includes("@") && phone.replace(/\D/g, "").length >= 10;

  if (isAutoLogging && open) {
    return (
      <Dialog open={open} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md bg-card border-border flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-display font-semibold">Identificando você...</h3>
          <p className="text-muted-foreground text-sm mt-2">Redirecionando para o teste.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            Teste Grátis
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha seus dados para testar a automação "{automationName}" agora mesmo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background border-border"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-border"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="phone">Telefone / WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(53) 91234-5678"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={15}
              required
              className="bg-background border-border"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full bg-[hsl(var(--cta))] hover:bg-[hsl(var(--cta))]/90 text-[hsl(var(--cta-foreground))] font-bold shadow-lg shadow-[hsl(var(--cta-glow))]/30 h-11"
            >
              {isSubmitting ? "Liberando acesso..." : "Liberar Chat de Teste"}
            </Button>
          </motion.div>

          <p className="text-xs text-muted-foreground text-center pb-2">
            Seus dados estão seguros. Não enviamos spam.
          </p>

          {/* NOVO: Botão Fechar explícito para Mobile */}
          <div className="md:hidden border-t border-border/50 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-muted-foreground hover:text-foreground h-10"
            >
              Fechar
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};