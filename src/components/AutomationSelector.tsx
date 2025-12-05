import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Automation } from "@/pages/TesteGratis";

interface AutomationSelectorProps {
  automations: Automation[];
  selectedAutomation: Automation | null;
  onSelect: (automation: Automation) => void;
}

export const AutomationSelector = ({
  automations,
  selectedAutomation,
  onSelect
}: AutomationSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {automations.map((automation, index) => {
        const isSelected = selectedAutomation?.id === automation.id;
        
        return (
          <motion.div
            key={automation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card 
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isSelected 
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSelect(automation)}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="text-4xl mb-2">{automation.icon}</div>
                <CardTitle className="text-xl">{automation.name}</CardTitle>
                <CardDescription>{automation.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button 
                  className={`w-full ${isSelected ? "bg-primary" : ""}`}
                  variant={isSelected ? "default" : "outline"}
                >
                  {isSelected ? "Selecionado" : "Testar agora"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
