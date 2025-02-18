import React, { useState, useEffect } from 'react';
import { QuestionForm } from './components/QuestionForm';
import { StyleEditor } from './components/StyleEditor';
import { QuestionPreview } from './components/QuestionPreview';
import { QuestionList } from './components/QuestionList';
import { VideoGenerator } from './components/VideoGenerator';
import { QuestionGenerator } from './components/QuestionGenerator';
import { ApiSettings } from './components/ApiSettings';
import type { Question, QuizStyle, QuizState, GeneratedQCM } from './types';
import { Video, Settings, Download, FileVideo, Wand2, Key, Brain } from 'lucide-react';
  const generateUUID = () => window.crypto?.randomUUID?.() || "fallback-uuid";

function App() {
  const [showGame, setShowGame] = useState(false);

  if (!showGame) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <Brain className="w-20 h-20 text-indigo-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Quiz Master Pro
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300">
              Créez des quiz captivants et générez des vidéos interactives en quelques clics
            </p>

            <button
              onClick={() => setShowGame(true)}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Video className="w-6 h-6 mr-2" />
              Commencer
            </button>

            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg">
                <div className="flex justify-center mb-4">
                  <Brain className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">IA Créative</h3>
                <p className="text-gray-300">
                  Générez des questions pertinentes grâce à l'intelligence artificielle
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg">
                <div className="flex justify-center mb-4">
                  <Settings className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personnalisation</h3>
                <p className="text-gray-300">
                  Adaptez le style et l'apparence selon vos préférences
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg">
                <div className="flex justify-center mb-4">
                  <FileVideo className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Export Vidéo</h3>
                <p className="text-gray-300">
                  Exportez vos quiz au format vidéo pour les réseaux sociaux
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <GameInterface />;
}

function GameInterface() {
  const [state, setState] = useState<QuizState>({
    questions: [],
    style: {
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      accentColor: '#4f46e5',
      font: 'Inter'
    },
    autoMode: false,
    keyword: ''
  });

  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatgpt_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('chatgpt_api_key', newApiKey);
  };

  const handleAddQuestion = (question: Question) => {
    if (editingQuestion) {
      setState(prev => ({
        ...prev,
        questions: prev.questions.map(q => 
          q.id === question.id ? question : q
        )
      }));
      setEditingQuestion(undefined);
    } else {
      setState(prev => ({
        ...prev,
        questions: [...prev.questions, question]
      }));
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
    if (selectedQuestion >= state.questions.length - 1) {
      setSelectedQuestion(Math.max(0, state.questions.length - 2));
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleReorderQuestions = (questions: Question[]) => {
    setState(prev => ({ ...prev, questions }));
  };

  const handleStyleChange = (style: QuizStyle) => {
    setState(prev => ({ ...prev, style }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quiz.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleGenerateVideo = () => {
    if (state.questions.length === 0) {
      setVideoError('Add at least one question before generating a video');
      return;
    }
    setIsGeneratingVideo(true);
    setVideoError(null);
    setShowVideoPreview(true);
  };

  const handleVideoComplete = (url: string) => {
    setIsGeneratingVideo(false);
    setShowVideoPreview(false);
  };

  const handleVideoError = (error: string) => {
    setIsGeneratingVideo(false);
    setVideoError(error);
    setShowVideoPreview(false);
  };

  const handleToggleAutoMode = () => {
    setState(prev => ({ ...prev, autoMode: !prev.autoMode }));
  };

  const handleNextQuestion = () => {
    if (selectedQuestion < state.questions.length - 1) {
      setSelectedQuestion(prev => prev + 1);
    } else {
      setSelectedQuestion(0);
    }
  };

  const handleGenerateQuestions = async (keyword: string) => {
    if (!apiKey) {
      setIsApiSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    setState(prev => ({ ...prev, keyword }));
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "Génère un QCM en JSON. Format: { \"qcm\": [{ \"question\": \"?\", \"answers\": [{ \"text\": \"?\", \"correct\": boolean }] }] }"
          }, {
            role: "user",
            content: `Génère un QCM sur le thème: ${keyword}`
          }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const generatedQCM: GeneratedQCM = JSON.parse(data.choices[0].message.content);

      const questions: Question[] = generatedQCM.qcm.map(item => ({
        id: generateUUID,
        text: item.question,
        options: item.answers.map(a => ({
          text: a.text,
          correct: a.correct
        })),
        duration: 10
      }));

      setState(prev => ({ ...prev, questions }));
      setShowVideoPreview(true);
    } catch (error) {
      console.error('Error generating questions:', error);
      setVideoError('Failed to generate questions. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Quiz Video Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsApiSettingsOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Key className="w-4 h-4 mr-2" />
                API Settings
              </button>
              <button
                onClick={handleToggleAutoMode}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  state.autoMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {state.autoMode ? 'Désactiver Auto' : 'Activer Auto'}
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Quiz
              </button>
              <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileVideo className="w-4 h-4 mr-2" />
                {isGeneratingVideo ? 'Generating...' : 'Generate Video'}
              </button>
            </div>
          </div>
          {videoError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {videoError}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Question Generator and Form */}
          <div className="space-y-8">
            <QuestionGenerator
              onGenerate={handleGenerateQuestions}
              isGenerating={isGenerating}
            />
            <QuestionForm
              onSave={handleAddQuestion}
              editingQuestion={editingQuestion}
              onCancelEdit={() => setEditingQuestion(undefined)}
            />
            <QuestionList
              questions={state.questions}
              selectedQuestion={selectedQuestion}
              onSelect={setSelectedQuestion}
              onDelete={handleDeleteQuestion}
              onEdit={handleEditQuestion}
              onReorder={handleReorderQuestions}
            />
          </div>

          {/* Middle column - Preview */}
          <div className="space-y-8">
            {state.questions.length > 0 ? (
              <QuestionPreview
                question={state.questions[selectedQuestion]}
                style={state.style}
                keyword={state.keyword}
                autoMode={state.autoMode}
                onNextQuestion={handleNextQuestion}
              />
            ) : (
              <div className="aspect-video bg-white rounded-lg shadow-md flex items-center justify-center text-gray-500">
                Add a question to see preview
              </div>
            )}

            {state.questions.length > 0 && (
              <div className="flex justify-center space-x-2">
                {state.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestion(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === selectedQuestion
                        ? 'bg-indigo-600'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right column - Style Editor */}
          <div>
            <StyleEditor
              style={state.style}
              onStyleChange={handleStyleChange}
            />
          </div>
        </div>
      </main>

      {showVideoPreview && (
        <VideoGenerator
          questions={state.questions}
          style={state.style}
          onComplete={handleVideoComplete}
          onError={handleVideoError}
        />
      )}

      <ApiSettings
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}

export default App;
