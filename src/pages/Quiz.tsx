import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStandardById } from "@/data/standards";
import { getQuestionsByStandard } from "@/data/questions";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const Quiz = () => {
  const { standardId } = useParams<{ standardId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const standard = standardId ? getStandardById(standardId) : null;
  const questions = standardId ? getQuestionsByStandard(standardId) : [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (!standard || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground">لا توجد أسئلة لهذا المعيار</p>
          <Button onClick={() => navigate("/")} className="mt-4">العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-xl mx-auto shadow-medium animate-scale-in">
            <CardContent className="p-8 text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${percentage >= 60 ? 'bg-primary' : 'bg-destructive'}`}>
                {percentage >= 60 ? (
                  <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
                ) : (
                  <XCircle className="w-12 h-12 text-destructive-foreground" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">نتيجة الاختبار</h2>
              <p className="text-muted-foreground mb-6">{standard.name}</p>
              <div className="text-5xl font-bold text-foreground mb-2">{percentage}%</div>
              <p className="text-lg text-muted-foreground mb-6">
                {score} من {questions.length} إجابات صحيحة
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/")} variant="outline">
                  العودة للرئيسية
                </Button>
                <Button onClick={() => {
                  setCurrentQuestionIndex(0);
                  setAnswers([]);
                  setSelectedAnswer(null);
                  setShowResult(false);
                }} className="btn-primary-gradient">
                  إعادة الاختبار
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 text-muted-foreground">
          <ArrowRight className="w-4 h-4 ml-1" />
          العودة
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">{standard.name}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground font-medium">السؤال {currentQuestionIndex + 1} من {questions.length}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-soft animate-fade-in">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">{currentQuestion.text}</h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-right p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card hover:border-muted-foreground text-foreground"
                    }`}
                  >
                    <span className="font-medium ml-3">{["أ", "ب", "ج", "د"][index]}.</span>
                    {option}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="w-full mt-6 btn-primary-gradient disabled:opacity-50"
              >
                {currentQuestionIndex < questions.length - 1 ? "التالي" : "إنهاء الاختبار"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
