import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import GradeCard from "@/components/GradeCard";
import SubjectCard from "@/components/SubjectCard";
import StandardCard from "@/components/StandardCard";
import TeacherSelector from "@/components/TeacherSelector";
import StudentSelector from "@/components/StudentSelector";
import { Button } from "@/components/ui/button";
import { grades, getSubjectsByGrade, getStandardsBySubject, getGradeById, getSubjectById } from "@/data/standards";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { teacherData, studentsData } from "@/data/classData";

const Index = () => {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const subjects = selectedGrade ? getSubjectsByGrade(selectedGrade) : [];
  const standards = selectedSubject ? getStandardsBySubject(selectedSubject) : [];
  const currentGrade = selectedGrade ? getGradeById(selectedGrade) : null;
  const currentSubject = selectedSubject ? getSubjectById(selectedSubject) : null;

  // Check if this grade+subject has teacher/student selection
  const hasClassData = selectedSubject ? !!teacherData[selectedSubject] : false;
  const teacher = hasClassData && selectedSubject ? teacherData[selectedSubject] : null;
  const classStudents = hasClassData && selectedSubject ? studentsData[selectedSubject] : null;

  const handleBack = () => {
    if (hasClassData && selectedStudent) {
      setSelectedStudent(null);
    } else if (hasClassData && selectedTeacher) {
      setSelectedTeacher(false);
    } else if (selectedSubject) {
      setSelectedSubject(null);
      setSelectedTeacher(false);
      setSelectedStudent(null);
    } else if (selectedGrade) {
      setSelectedGrade(null);
    }
  };

  const handleStartQuiz = (standardId: string) => {
    navigate(`/quiz/${standardId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* مسار التنقل */}
        {(selectedGrade || selectedSubject) && (
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
              <ArrowRight className="w-4 h-4 ml-1" />
              رجوع
            </Button>
            <span className="text-muted-foreground">/</span>
            {currentGrade && <span className="text-foreground font-medium">{currentGrade.name}</span>}
            {currentSubject && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium">{currentSubject.name}</span>
              </>
            )}
          </div>
        )}

        {/* اختيار الصف */}
        {!selectedGrade && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <img src={logo} alt="شعار وزارة التعليم" className="h-40 md:h-56 lg:h-64 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">اختبارات محاكية نافس 2026</h1>
              <h2 className="text-3xl font-bold text-foreground mb-3">اختر الصف الدراسي</h2>
              <p className="text-muted-foreground">حدد صفك للبدء في الاختبارات المحاكية</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {grades.map((grade) => (
                <GradeCard
                  key={grade.id}
                  grade={grade}
                  onClick={() => setSelectedGrade(grade.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* اختيار المادة */}
        {selectedGrade && !selectedSubject && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">اختر المادة</h2>
              <p className="text-muted-foreground">{currentGrade?.name}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={() => setSelectedSubject(subject.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* اختيار المعلم - فقط للصف الثالث رياضيات */}
        {selectedSubject && hasClassData && !selectedTeacher && (
          <TeacherSelector 
            teacherName={teacher!.name} 
            onSelect={() => setSelectedTeacher(true)} 
          />
        )}

        {/* اختيار الطالب */}
        {selectedSubject && hasClassData && selectedTeacher && !selectedStudent && (
          <StudentSelector 
            students={classStudents!} 
            onSelect={(student) => setSelectedStudent(student)} 
          />
        )}

        {/* عرض المعايير */}
        {selectedSubject && (!hasClassData || (selectedTeacher && selectedStudent)) && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              {selectedStudent && (
                <div className="mb-4 bg-primary/10 rounded-lg p-3 inline-block">
                  <p className="text-muted-foreground text-sm">الطالب:</p>
                  <p className="text-primary font-bold">{selectedStudent}</p>
                </div>
              )}
              <h2 className="text-3xl font-bold text-foreground mb-3">معايير {currentSubject?.name}</h2>
              <p className="text-muted-foreground">اختر المعيار لبدء الاختبار</p>
            </div>
            <div className="grid gap-4 max-w-3xl mx-auto">
              {standards.map((standard, index) => (
                <StandardCard
                  key={standard.id}
                  standard={standard}
                  index={index}
                  onClick={() => handleStartQuiz(standard.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-muted-foreground border-t border-border mt-12">
        <p>ابتدائية سعد بن أبي وقاص © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
