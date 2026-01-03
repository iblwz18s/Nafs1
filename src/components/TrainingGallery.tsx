import Stack from "@/components/Stack";
import training1 from "@/assets/training/training-1.png";
import training2 from "@/assets/training/training-2.png";
import training3 from "@/assets/training/training-3.png";
import training4 from "@/assets/training/training-4.png";
import training5 from "@/assets/training/training-5.png";

const trainingImages = [training1, training2, training3, training4, training5];

const cards = trainingImages.map((src, i) => (
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
      <p className="text-muted-foreground mb-8 text-center">اسحب الصورة أو انقر للتنقل بين الشواهد</p>
      <Stack
        cards={cards}
        randomRotation={true}
        sensitivity={80}
        sendToBackOnClick={true}
        autoplay={true}
        autoplayDelay={4000}
        pauseOnHover={true}
      />
    </div>
  );
};

export default TrainingGallery;
