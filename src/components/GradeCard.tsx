import { Grade } from "@/data/standards";
import { ShinyButton } from "@/components/ui/shiny-button";
import threeIcon from "@/assets/three-icon.png";
import sixIcon from "@/assets/six-icon.png";

interface GradeCardProps {
  grade: Grade;
  onClick: () => void;
}

const GradeCard = ({ grade, onClick }: GradeCardProps) => {
  // استخدام أيقونات مخصصة لكل صف
  const isGrade3 = grade.id === "grade-3";
  const isGrade6 = grade.id === "grade-6";

  // رقم الصف للعرض
  const gradeNumber = isGrade3 ? "٣" : isGrade6 ? "٦" : "";
  const gradeLabel = isGrade3 ? "الصف الثالث الابتدائي" : isGrade6 ? "الصف السادس الابتدائي" : grade.name;

  return (
    <ShinyButton 
      onClick={onClick}
      className="w-full p-4 md:p-8 text-center bg-card border-2 border-border hover:border-primary rounded-xl"
    >
      <div className="flex flex-col items-center">
        {/* أيقونة رقم الصف بتصميم مطابق للصورة */}
        <div className="w-14 h-14 md:w-20 md:h-20 mb-2 md:mb-4 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-bold text-primary-foreground arabic-nums">
            {gradeNumber}
          </span>
        </div>
        <h3 className="text-sm md:text-xl font-bold text-foreground leading-tight">{gradeLabel}</h3>
        <p className="text-muted-foreground text-xs md:text-base mt-1 md:mt-2">اختر الصف</p>
      </div>
    </ShinyButton>
  );
};

export default GradeCard;
