import { BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="gradient-hero text-primary-foreground py-6 px-4 shadow-medium">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">مدرستي</h1>
            <p className="text-sm opacity-90">ابتدائية سعد بن أبي وقاص</p>
          </div>
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm opacity-80">اختبارات محاكية لاختبارات نافس الوطنية</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
