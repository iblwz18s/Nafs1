import { Grade } from "@/data/standards";
import { GraduationCap } from "lucide-react";
import { ShinyButton } from "@/components/ui/shiny-button";

interface GradeCardProps {
  grade: Grade;
  onClick: () => void;
}

const GradeCard = ({ grade, onClick }: GradeCardProps) => {
  return (
    <ShinyButton 
      onClick={onClick}
      className="w-full p-8 text-center bg-card border-2 border-border hover:border-primary rounded-xl"
    >
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 mb-4 rounded-full gradient-primary flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{grade.name}</h3>
        <p className="text-muted-foreground mt-2">اختر للبدء</p>
      </div>
    </ShinyButton>
  );
};

export default GradeCard;
