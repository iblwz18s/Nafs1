import { Card, CardContent } from "@/components/ui/card";
import { Subject } from "@/data/standards";

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

const SubjectCard = ({ subject, onClick }: SubjectCardProps) => {
  return (
    <Card 
      className="cursor-pointer card-hover border-2 border-border hover:border-secondary bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="text-5xl mb-4">{subject.icon}</div>
        <h3 className="text-lg font-bold text-foreground">{subject.name}</h3>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
