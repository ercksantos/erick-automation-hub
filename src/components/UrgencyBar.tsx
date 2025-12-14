import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export const UrgencyBar = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[hsl(var(--urgency))] via-[hsl(30,100%,55%)] to-[hsl(var(--urgency))] text-[hsl(var(--urgency-foreground))] py-2 px-4 text-center font-semibold text-sm md:text-base"
    >
      <div className="flex items-center justify-center gap-2">
        <Flame className="w-4 h-4 animate-pulse" />
        <span>Agenda de Dezembro: Últimas 2 vagas para implementação imediata.</span>
        <Flame className="w-4 h-4 animate-pulse" />
      </div>
    </motion.div>
  );
};
