import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStandardById } from "@/data/standards";
import { getQuestionsByStandard, Question } from "@/data/questions";
import { ArrowRight, CheckCircle2, XCircle, Check, X, Lightbulb } from "lucide-react";

// دالة لتوليد شرح الإجابة بناءً على نوع السؤال
const generateExplanation = (question: Question): string => {
  const correctOption = question.options[question.correctAnswer];
  const arabicLetters = ["أ", "ب", "ج", "د"];
  
  // تحليل نص السؤال لتقديم شرح مناسب
  if (question.text.includes("ناتج") || question.text.includes("=")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. يمكنك التحقق من الناتج بإجراء العملية الحسابية خطوة بخطوة.`;
  }
  
  if (question.text.includes("مرادف") || question.text.includes("ضد")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. تذكر معاني الكلمات وعلاقاتها الدلالية.`;
  }
  
  if (question.text.includes("كسر") || question.text.includes("كسور")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. عند مقارنة الكسور، حاول توحيد المقامات أو تحويلها لأعداد عشرية.`;
  }
  
  if (question.text.includes("محيط")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. المحيط = مجموع أطوال جميع الأضلاع.`;
  }
  
  if (question.text.includes("مساحة")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. تذكر قوانين المساحة: المربع = الضلع²، المستطيل = الطول × العرض.`;
  }
  
  if (question.text.includes("نمط") || question.text.includes("النمط")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. لإيجاد النمط، ابحث عن العلاقة بين الأعداد المتتالية.`;
  }
  
  if (question.text.includes("ساعة") || question.text.includes("دقيقة") || question.text.includes("الوقت")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. تذكر: الساعة = 60 دقيقة، ربع ساعة = 15 دقيقة، نصف ساعة = 30 دقيقة.`;
  }
  
  if (question.text.includes("لتر") || question.text.includes("كيلو") || question.text.includes("جرام")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. تذكر: 1 كيلوجرام = 1000 جرام، 1 لتر = 1000 مليلتر.`;
  }
  
  if (question.text.includes("ريال") || question.text.includes("نقود")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. استخدم الجمع والطرح لحساب المبالغ المالية.`;
  }
  
  if (question.text.includes("زاوية") || question.text.includes("زوايا")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. الزاوية القائمة = 90°، الحادة < 90°، المنفرجة > 90°.`;
  }
  
  if (question.text.includes("نسبة") || question.text.includes("%")) {
    return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. النسبة المئوية = (الجزء ÷ الكل) × 100.`;
  }
  
  // شرح عام
  return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) ${correctOption}. راجع المفاهيم الأساسية المتعلقة بهذا السؤال.`;
};

const Quiz = () => {
  const { standardId } = useParams<{ standardId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const standard = standardId ? getStandardById(standardId) : null;
  const questions = standardId ? getQuestionsByStandard(standardId) : [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (isAnswerSubmitted) return; // منع تغيير الإجابة بعد التأكيد
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    setShowFeedback(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer!];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsAnswerSubmitted(false);
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

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

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
                  setShowFeedback(false);
                  setIsAnswerSubmitted(false);
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
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectOption = index === currentQuestion.correctAnswer;
                  
                  let buttonStyle = "border-border bg-card hover:border-muted-foreground text-foreground";
                  
                  if (showFeedback) {
                    if (isCorrectOption) {
                      buttonStyle = "border-green-500 bg-green-500/20 text-foreground";
                    } else if (isSelected && !isCorrectOption) {
                      buttonStyle = "border-red-500 bg-red-500/20 text-foreground";
                    } else {
                      buttonStyle = "border-border bg-card text-muted-foreground opacity-50";
                    }
                  } else if (isSelected) {
                    buttonStyle = "border-primary bg-primary/10 text-foreground";
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-right p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${buttonStyle} ${isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium ml-3">{["أ", "ب", "ج", "د"][index]}.</span>
                        {option}
                      </div>
                      {showFeedback && isCorrectOption && (
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                      {showFeedback && isSelected && !isCorrectOption && (
                        <X className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* صندوق التغذية الراجعة */}
              {showFeedback && (
                <div className={`mt-6 p-4 rounded-lg border-2 animate-fade-in ${isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-amber-500/10 border-amber-500'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-amber-500'}`}>
                      {isCorrect ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Lightbulb className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {isCorrect ? "إجابة صحيحة! أحسنت" : "إجابة خاطئة"}
                      </h4>
                      <p className="text-foreground text-sm">
                        {generateExplanation(currentQuestion)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full mt-6 btn-primary-gradient disabled:opacity-50"
                >
                  تأكيد الإجابة
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full mt-6 btn-primary-gradient"
                >
                  {currentQuestionIndex < questions.length - 1 ? "السؤال التالي" : "إنهاء الاختبار"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
