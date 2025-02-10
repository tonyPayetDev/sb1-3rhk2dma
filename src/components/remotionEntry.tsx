import { registerRoot } from "remotion";
import { Composition } from "remotion";
import { VideoGenerator } from "./VideoGenerator";
import { Question, QuizStyle } from "./types";

const defaultQuestions: Question[] = [
  {
    text: "Quel est la capitale de la France ?",
    options: [
      { text: "Paris", correct: true },
      { text: "Lyon", correct: false },
    ],
    duration: 5,
  },
];

const defaultStyle: QuizStyle = {
  backgroundColor: "#222", // 👈 Test avec une autre couleur
  textColor: "#fff",
  font: "Arial",
  accentColor: "#FF0000",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoGenerator"
        component={VideoGenerator}
        durationInFrames={defaultQuestions.length * 5 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          questions: defaultQuestions,
          style: defaultStyle,
        }}
      />
    </>
  );
};

// 🔥 Vérifie si la composition est bien enregistrée
console.log("✅ Composition enregistrée avec ID : VideoGenerator");

registerRoot(RemotionRoot);
