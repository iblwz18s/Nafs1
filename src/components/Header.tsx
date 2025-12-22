import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="bg-background py-4 px-4 shadow-medium border-b border-border">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="شعار وزارة التعليم" className="h-16 md:h-20" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">ابتدائية سعد بن أبي وقاص</h1>
            <p className="text-sm text-muted-foreground">اختبارات محاكية لاختبارات نافس الوطنية</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
