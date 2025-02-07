import React, { useEffect, useState } from 'react';
import type { Question, QuizStyle } from '../types';

interface QuestionPreviewProps {
  question: Question;
  style: QuizStyle;
  keyword: string;
  autoMode: boolean;
  onNextQuestion?: () => void;
}

// Liste de fonds Pexels au format stories
const PEXELS_BACKGROUNDS = [
  'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg',
  'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
  'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
  'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
  'https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg'
];

export function QuestionPreview({ question, style, keyword, autoMode, onNextQuestion }: QuestionPreviewProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    // Reset states when question changes
    setSelectedAnswer(null);
    setShowCorrect(false);
  }, [question]);

  useEffect(() => {
    // Select random Pexels background
    const randomBackground = PEXELS_BACKGROUNDS[Math.floor(Math.random() * PEXELS_BACKGROUNDS.length)];
    setBackgroundImage(randomBackground);
  }, [question]);

  useEffect(() => {
    if (autoMode && !selectedAnswer && !showCorrect) {
      // In auto mode, automatically select the correct answer after a delay
      const correctIndex = question.options.findIndex(opt => opt.correct);
      const timer = setTimeout(() => {
        setSelectedAnswer(correctIndex);
        setShowCorrect(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [autoMode, question, selectedAnswer, showCorrect]);

  useEffect(() => {
    if (showCorrect && onNextQuestion) {
      // Move to next question after showing the correct answer
      const timer = setTimeout(() => {
        onNextQuestion();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCorrect, onNextQuestion]);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null || showCorrect) return;
    
    setSelectedAnswer(index);
    setShowCorrect(true);
  };

  return (
    <div 
      className="aspect-video rounded-lg shadow-lg p-8 flex flex-col justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay with gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), ${style.backgroundColor}cc)`
        }}
      />
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: style.textColor }}>
          {question.text}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = option.correct;
            const showResult = showCorrect;

            let backgroundColor = 'rgba(255, 255, 255, 0.1)';
            if (showResult) {
              if (isCorrect) {
                backgroundColor = '#22c55e'; // Green for correct
              } else if (isSelected && !isCorrect) {
                backgroundColor = '#ef4444'; // Red for wrong
              }
            } else if (isSelected) {
              backgroundColor = style.accentColor;
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showResult}
                className={`p-4 rounded-lg text-center transition-all transform ${
                  showResult ? '' : 'hover:scale-105'
                } ${isSelected ? 'ring-2 ring-white' : ''}`}
                style={{
                  backgroundColor,
                  border: `2px solid ${showResult && isCorrect ? '#22c55e' : style.accentColor}`,
                  color: style.textColor,
                  opacity: showResult && !isCorrect && !isSelected ? 0.6 : 1
                }}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm" style={{ color: `${style.textColor}b3` }}>
          Duration: {question.duration} seconds
        </div>
      </div>
    </div>
  );
}