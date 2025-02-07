export interface Question {
  id: string;
  text: string;
  options: Array<{
    text: string;
    correct: boolean;
  }>;
  duration: number;
}

export interface QuizStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  font: string;
}

export interface QuizState {
  questions: Question[];
  style: QuizStyle;
  autoMode: boolean;
  keyword: string;
}

export interface GeneratedQCM {
  qcm: Array<{
    question: string;
    answers: Array<{
      text: string;
      correct: boolean;
    }>;
  }>;
}