export const teacherData: Record<string, { name: string; subject: string }> = {
  "math-3": {
    name: "أستاذ الرياضيات",
    subject: "معلم الرياضيات"
  },
  "reading-3": {
    name: "أستاذ القراءة",
    subject: "معلم لغتي"
  },
  "reading-6": {
    name: "أستاذ القراءة 6",
    subject: "معلم لغتي"
  },
  "math-6": {
    name: "أستاذ الرياضيات 6",
    subject: "معلم الرياضيات"
  },
  "science-6": {
    name: "أستاذ العلوم",
    subject: "معلم العلوم"
  }
};

export const grade3Students: string[] = [];

export const grade6Students: string[] = [];

export const studentsData: Record<string, string[]> = {
  "math-3": grade3Students,
  "reading-3": grade3Students,
  "reading-6": grade6Students,
  "math-6": grade6Students,
  "science-6": grade6Students
};
