import { Card, CardContent } from "@/components/ui/card";
import { Grade } from "@/data/standards";
import { GraduationCap } from "lucide-react";

interface GradeCardProps {
  grade: Grade;
  onClick: () => void;
}

const GradeCard = ({ grade, onClick }: GradeCardProps) => {
  return (
    <Card 
      className="cursor-pointer card-hover border-2 border-border hover:border-primary bg-card"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{grade.name}</h3>
        <p className="text-muted-foreground mt-2">اختر للبدء</p>
      </CardContent>
    </Card>
  );
};

export default GradeCard;
