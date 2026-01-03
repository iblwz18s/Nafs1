import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TrainingGallery from "@/components/TrainingGallery";

const TrainingGalleryPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-background bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/nafs-background.jpeg')" }}
    >
      <div className="min-h-screen bg-background/85 dark:bg-background/90">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")} 
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            رجوع للرئيسية
          </Button>
        </div>
        <TrainingGallery />
      </div>
    </div>
  );
};

export default TrainingGalleryPage;
