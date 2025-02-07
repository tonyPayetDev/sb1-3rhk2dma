import React, { useEffect, useState } from 'react';
import { Player } from '@remotion/player';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
} from 'remotion';
import { Music, Upload } from 'lucide-react';
import type { Question, QuizStyle } from '../types';

interface VideoGeneratorProps {
  questions: Question[];
  style: QuizStyle;
  onComplete: (url: string) => void;
  onError: (error: string) => void;
}

const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486520299386-6d106b22014b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?auto=format&fit=crop&q=80',
];

const QuestionSequence: React.FC<{
  question: Question;
  style: QuizStyle;
  backgroundUrl: string;
}> = ({ question, style, backgroundUrl }) => {
  const frame = useCurrentFrame();

  const questionEntrance = spring({
    frame,
    fps: 30,
    from: -50,
    to: 0,
    durationInFrames: 30,
  });
  const optionsEntrance = spring({
    frame: frame - 30,
    fps: 30,
    from: 100,
    to: 0,
    durationInFrames: 30,
  });
  const progress = interpolate(frame, [0, question.duration * 30], [0, 100], {
    extrapolateRight: 'clamp',
  });

  const showAnswer = frame > question.duration * 30 * 0.8;

  return (
    <AbsoluteFill style={{ backgroundColor: style.backgroundColor }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${questionEntrance}px)`,
          width: '90%',
          textAlign: 'center',
          color: style.textColor,
        }}
      >
        <h2
          style={{
            fontSize: 32,
            fontFamily: style.font,
            marginBottom: 30,
            fontWeight: 'bold',
            lineHeight: 1.2,
          }}
        >
          {question.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {question.options.map((option, index) => {
            const isCorrect = option.correct;
            const backgroundColor = showAnswer
              ? isCorrect
                ? '#22c55e'
                : 'rgba(255, 255, 255, 0.1)'
              : style.accentColor;

            return (
              <div
                key={index}
                style={{
                  transform: `translateX(${optionsEntrance}px)`,
                  backgroundColor,
                  padding: 15,
                  borderRadius: 12,
                  transition: 'background-color 0.3s',
                  border: `2px solid ${style.accentColor}`,
                  opacity: showAnswer && !isCorrect ? 0.6 : 1,
                  fontSize: 18,
                }}
              >
                {option.text}
              </div>
            );
          })}
        </div>

        <div
          style={{
            width: '100%',
            height: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            marginTop: 30,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: style.accentColor,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const QuizVideo: React.FC<{
  questions: Question[];
  style: QuizStyle;
}> = ({ questions, style }) => {
  return (
    <AbsoluteFill>
      {questions.map((question, index) => (
        <Sequence
          key={index}
          from={index * question.duration * 30}
          durationInFrames={question.duration * 30}
        >
          <QuestionSequence
            question={question}
            style={style}
            backgroundUrl={BACKGROUNDS[index % BACKGROUNDS.length]}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export function VideoGenerator({
  questions,
  style,
  onComplete,
  onError,
}: VideoGeneratorProps) {
  const [isRendering, setIsRendering] = useState(false);
  const totalDuration = questions.reduce((acc, q) => acc + q.duration, 0);

  const handleRenderVideo = async () => {
    try {
      setIsRendering(true);

      const response = await fetch('http://localhost:3000/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions,
          style,
          duration: totalDuration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to render video');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiz.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      onComplete(url);
    } catch (error) {
      console.error('Error rendering video:', error);
      onError(
        error instanceof Error ? error.message : 'Failed to render video'
      );
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Video Preview</h2>

        <div className="aspect-[9/16] w-full bg-gray-900 rounded-lg overflow-hidden">
          <Player
            component={QuizVideo}
            inputProps={{ questions, style }}
            durationInFrames={totalDuration * 30}
            fps={30}
            compositionWidth={1080}
            compositionHeight={1920}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls
            autoPlay
            loop
          />
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={handleRenderVideo}
            disabled={isRendering}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isRendering ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Rendering...
              </>
            ) : (
              'Generate Video'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
