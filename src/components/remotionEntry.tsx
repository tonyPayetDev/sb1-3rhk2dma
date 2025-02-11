// import { registerRoot } from "remotion";
// import { Composition } from "remotion";
// import { VideoGenerator } from "./VideoGenerator";
// import { Question, QuizStyle } from "./types";

// const defaultQuestions: Question[] = [
//   {
//     text: "Quel est la capitale de la France ?",
//     options: [
//       { text: "Paris", correct: true },
//       { text: "Lyon", correct: false },
//     ],
//     duration: 5,
//   },
// ];

// const defaultStyle: QuizStyle = {
//   backgroundColor: "#222", // 👈 Test avec une autre couleur
//   textColor: "#fff",
//   font: "Arial",
//   accentColor: "#FF0000",
// };

// export const RemotionRoot: React.FC = () => {
//   return (
//     <>
//       <Composition
//         id="VideoGenerator"
//         component={VideoGenerator}
//         durationInFrames={defaultQuestions.length * 5 * 30}
//         fps={30}
//         width={1080}
//         height={1920}
//         defaultProps={{
//           questions: defaultQuestions,
//           style: defaultStyle,
//         }}
//       />
//     </>
//   );
// };

// // 🔥 Vérifie si la composition est bien enregistrée
// console.log("✅ Composition enregistrée avec ID : VideoGenerator");

// registerRoot(RemotionRoot);
import { registerRoot } from "remotion";
import { Composition, getInputProps } from "remotion";
import { VideoGenerator } from "./VideoGenerator";
import { Question, QuizStyle } from "./types";

// 🔹 Récupérer les props dynamiques envoyées depuis le backend
const inputProps = getInputProps();

// ✅ Vérifie si les questions ont bien été envoyées
console.log("📌 Props reçues dans RemotionEntry:", inputProps);

// 🔥 Sécurisation : S'assurer que `questions` est bien un tableau
const questions: Question[] = Array.isArray(inputProps.questions)
  ? inputProps.questions
  : [
      {
        text: "Exemple de question ?",
        options: [
          { text: "Réponse A", correct: true },
          { text: "Réponse B", correct: false },
        ],
        duration: 5,
      },
    ];

// 🔥 Sécurisation : S'assurer que `style` est bien un objet
const style: QuizStyle = inputProps.style || {
  backgroundColor: "#222",
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
        durationInFrames={questions.length * 5 * 30} // Ajuste la durée en fonction du nombre de questions
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          questions,
          style,
        }}
      />
    </>
  );
};

// 🔥 Vérifie que la composition est bien enregistrée
console.log("✅ Composition enregistrée avec ID : VideoGenerator");

registerRoot(RemotionRoot);
