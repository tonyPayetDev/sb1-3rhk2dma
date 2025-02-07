import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import { VideoGenerator } from './VideoGenerator';
import { Question, QuizStyle } from './types';

// Données par défaut pour tester l'application
const defaultQuestions: Question[] = [
  {
    text: 'Quel est le capital de la France ?',
    options: [
      { text: 'Paris', correct: true },
      { text: 'Lyon', correct: false },
      { text: 'Marseille', correct: false },
      { text: 'Bordeaux', correct: false },
    ],
    duration: 5,
  },
];

const defaultStyle: QuizStyle = {
  backgroundColor: '#000',
  textColor: '#fff',
  font: 'Arial',
  accentColor: '#FF0000',
};

const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VideoGenerator"
      component={VideoGenerator}
      durationInFrames={defaultQuestions.length * 5 * 30} // Ajustez selon vos besoins
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        questions: defaultQuestions,
        style: defaultStyle,
        onComplete: () => console.log('Vidéo terminée'),
        onError: (error) => console.error('Erreur lors du rendu', error),
      }}
    />
  );
};

registerRoot(RemotionRoot);
