import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export const UrgencyBar = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      // Usei 'fixed' e z-[60] para garantir que fique acima de tudo
      // py-1.5 deixa a barra mais fina
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[hsl(var(--urgency))] via-[hsl(30,100%,55%)] to-[hsl(var(--urgency))] text-white py-1.5 px-4 text-center font-semibold text-xs md:text-sm shadow-md"
    >
      <div className="flex items-center justify-center gap-2">
        <Flame className="w-3 h-3 md:w-4 md:h-4 animate-pulse text-white fill-white/20" />
        <span className="truncate">🚀 Janeiro 2026: Comece o ano vendendo 24h no automático!</span>
        <Flame className="w-3 h-3 md:w-4 md:h-4 animate-pulse text-white fill-white/20" />
      </div>
    </motion.div>
  );
};