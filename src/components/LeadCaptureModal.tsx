import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { email: string; phone: string }) => void;
  automationName: string;
}

const formatPhone = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");
  
  // Aplica a máscara (XX) XXXXX-XXXX
  if (numbers.length <= 2) {
    return numbers.length ? `(${numbers}` : "";
  }
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export const LeadCaptureModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  automationName 
}: LeadCaptureModalProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simula um pequeno delay para UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onSubmit({ email, phone });
    setIsSubmitting(false);
  };

  const isValid = email.includes("@") && phone.replace(/\D/g, "").length >= 10;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            Teste Grátis
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha seus dados para testar a automação "{automationName}" agora mesmo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
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
          >
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full bg-[hsl(var(--cta))] hover:bg-[hsl(var(--cta))]/90 text-[hsl(var(--cta-foreground))] font-bold shadow-lg shadow-[hsl(var(--cta-glow))]/30"
            >
              {isSubmitting ? "Liberando acesso..." : "Liberar Chat de Teste"}
            </Button>
          </motion.div>

          <p className="text-xs text-muted-foreground text-center">
            Seus dados estão seguros. Não enviamos spam.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
