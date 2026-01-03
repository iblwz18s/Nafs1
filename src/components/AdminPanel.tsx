import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, UserPlus, LogOut, Trash2, Image } from "lucide-react";

interface TrainingImage {
  id: string;
  file_path: string;
  file_name: string;
  created_at: string;
}

interface Student {
  id: string;
  student_name: string;
  parent_name: string;
  phone_number: string;
  pin_code: string;
  grade: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [trainingImages, setTrainingImages] = useState<TrainingImage[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  // Student form state
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  useEffect(() => {
    fetchTrainingImages();
    fetchStudents();
  }, []);

  const fetchTrainingImages = async () => {
    setIsLoadingImages(true);
    const { data, error } = await supabase
      .from("training_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching images:", error);
    } else {
      setTrainingImages(data || []);
    }
    setIsLoadingImages(false);
  };

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("grade", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []);
    }
    setIsLoadingStudents(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `training/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("training-images")
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`خطأ في رفع ${file.name}: ${uploadError.message}`);
          continue;
        }

        // Save metadata to database
        const { error: dbError } = await supabase
          .from("training_images")
          .insert({
            file_path: filePath,
            file_name: file.name,
          });

        if (dbError) {
          toast.error(`خطأ في حفظ بيانات ${file.name}`);
        }
      }

      toast.success("تم رفع الصور بنجاح");
      fetchTrainingImages();
    } catch (error) {
      toast.error("حدث خطأ أثناء رفع الصور");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (image: TrainingImage) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("training-images")
        .remove([image.file_path]);

      if (storageError) {
        toast.error("خطأ في حذف الصورة من التخزين");
        return;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("training_images")
        .delete()
        .eq("id", image.id);

      if (dbError) {
        toast.error("خطأ في حذف بيانات الصورة");
        return;
      }

      toast.success("تم حذف الصورة بنجاح");
      fetchTrainingImages();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الصورة");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName || !parentName || !phoneNumber || !selectedGrade) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    // Validate phone number (should be 10 digits)
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      toast.error("رقم الجوال يجب أن يكون 10 أرقام");
      return;
    }

    setIsAddingStudent(true);

    try {
      // Generate PIN from last 4 digits of phone number
      const pinCode = phoneNumber.slice(-4);

      const { error } = await supabase.from("students").insert({
        student_name: studentName,
        parent_name: parentName,
        phone_number: phoneNumber,
        pin_code: pinCode,
        grade: selectedGrade,
      });

      if (error) {
        toast.error("خطأ في إضافة الطالب: " + error.message);
        return;
      }

      toast.success("تم إضافة الطالب بنجاح");
      setStudentName("");
      setParentName("");
      setPhoneNumber("");
      setSelectedGrade("");
      fetchStudents();
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", student.id);

      if (error) {
        toast.error("خطأ في حذف الطالب");
        return;
      }

      toast.success("تم حذف الطالب بنجاح");
      fetchStudents();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الطالب");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    toast.success("تم تسجيل الخروج");
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from("training-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">لوحة تحكم المسؤول</h2>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>

      <Tabs defaultValue="images" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">شواهد التدريب</TabsTrigger>
          <TabsTrigger value="students">إدارة الطلاب</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                رفع شواهد التدريب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="images">اختر الصور للرفع</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="mt-2"
                  />
                </div>
                {isUploading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري رفع الصور...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                الصور المرفوعة ({trainingImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingImages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : trainingImages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد صور مرفوعة حتى الآن
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {trainingImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative group rounded-lg overflow-hidden border"
                    >
                      <img
                        src={getImageUrl(image.file_path)}
                        alt={image.file_name}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteImage(image)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                إضافة طالب جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">اسم الطالب</Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="أدخل اسم الطالب"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentName">اسم ولي الأمر</Label>
                    <Input
                      id="parentName"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="أدخل اسم ولي الأمر"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">رقم جوال ولي الأمر</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="05xxxxxxxx"
                      maxLength={10}
                      required
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الصف</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الصف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">الصف الثالث</SelectItem>
                        <SelectItem value="6">الصف السادس</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" disabled={isAddingStudent}>
                  {isAddingStudent ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 ml-2" />
                  )}
                  إضافة الطالب
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>قائمة الطلاب ({students.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : students.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا يوجد طلاب مسجلين
                </p>
              ) : (
                <div className="space-y-4">
                  {["3", "6"].map((grade) => {
                    const gradeStudents = students.filter((s) => s.grade === grade);
                    if (gradeStudents.length === 0) return null;
                    return (
                      <div key={grade}>
                        <h3 className="font-semibold mb-2">
                          الصف {grade === "3" ? "الثالث" : "السادس"} ({gradeStudents.length} طالب)
                        </h3>
                        <div className="grid gap-2">
                          {gradeStudents.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{student.student_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ولي الأمر: {student.parent_name} | الجوال: {student.phone_number}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteStudent(student)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
