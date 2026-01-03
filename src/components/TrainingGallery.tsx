import Stack from "@/components/Stack";

// صور مؤقتة للعرض - سيتم استبدالها لاحقاً
const placeholderImages = [
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=500&auto=format",
];

const cards = placeholderImages.map((src, i) => (
  <div key={i} className="w-full h-full">
    <img
      src={src}
      alt={`شاهد التدريب ${i + 1}`}
      className="w-full h-full object-cover"
    />
  </div>
));

const TrainingGallery = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">شواهد التدريب</h1>
      <p className="text-muted-foreground mb-8 text-center">اسحب الصورة للتنقل بين الشواهد</p>
      <Stack
        cards={cards}
        randomRotation={true}
        sensitivity={200}
        sendToBackOnClick={true}
        autoplay={true}
        autoplayDelay={4000}
        pauseOnHover={true}
      />
    </div>
  );
};

export default TrainingGallery;
