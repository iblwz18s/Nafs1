import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, ArrowRight, Lock } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ParentLoginProps {
  students: string[];
  gradeName: string;
  onBack: () => void;
  onSuccess: (studentName: string) => void;
}

const ParentLogin = ({ students, gradeName, onBack, onSuccess }: ParentLoginProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // الرمز الافتراضي - يمكن تغييره لاحقاً
  const correctPin = "1234";

  const handlePinComplete = (value: string) => {
    setPin(value);
    if (value.length === 4) {
      if (value === correctPin) {
        setError("");
        if (selectedStudent) {
          onSuccess(selectedStudent);
        }
      } else {
        setError("الرمز غير صحيح");
        setPin("");
      }
    }
  };

  // اختيار الطالب
  if (!selectedStudent) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-secondary/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">دخول ولي الأمر</h2>
          <p className="text-muted-foreground">{gradeName} - اختر اسم الطالب</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            رجوع
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map((student) => (
              <Card
                key={student}
                className="cursor-pointer card-hover border-2 border-border hover:border-secondary bg-card"
                onClick={() => setSelectedStudent(student)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{student}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // إدخال رمز PIN
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-secondary/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Lock className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">أدخل رمز ولي الأمر</h2>
        <p className="text-muted-foreground">الطالب: {selectedStudent}</p>
      </div>

      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedStudent(null);
            setPin("");
            setError("");
          }}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          اختر طالب آخر
        </Button>

        <Card className="border-2 border-border bg-card">
          <CardContent className="p-8 flex flex-col items-center">
            <p className="text-muted-foreground mb-6">أدخل الرمز المكون من 4 أرقام</p>
            
            <div dir="ltr">
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={handlePinComplete}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-destructive mt-4 text-sm">{error}</p>
            )}

            <p className="text-xs text-muted-foreground mt-6">
              الرمز الافتراضي: 1234
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentLogin;
