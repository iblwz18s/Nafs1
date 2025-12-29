import { Grade } from "@/data/standards";
import { ShinyButton } from "@/components/ui/shiny-button";
import threeIcon from "@/assets/three-icon.png";

interface GradeCardProps {
  grade: Grade;
  onClick: () => void;
}

const GradeCard = ({ grade, onClick }: GradeCardProps) => {
  // استخدام أيقونة مخصصة للصف الثالث
  const isGrade3 = grade.id === "grade-3";

  return (
    <ShinyButton 
      onClick={onClick}
      className="w-full p-8 text-center bg-card border-2 border-border hover:border-primary rounded-xl"
    >
      <div className="flex flex-col items-center">
        {isGrade3 ? (
          <img src={threeIcon} alt="الصف الثالث" className="w-20 h-20 mb-4 rounded-xl" />
        ) : (
          <div className="w-20 h-20 mb-4 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-foreground">٦</span>
          </div>
        )}
        <h3 className="text-xl font-bold text-foreground">{grade.name}</h3>
        <p className="text-muted-foreground mt-2">اختر للبدء</p>
      </div>
    </ShinyButton>
  );
};

export default GradeCard;
