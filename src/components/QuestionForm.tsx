import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import type { Question } from '../types';

interface QuestionFormProps {
  onSave: (question: Question) => void;
  editingQuestion?: Question;
  onCancelEdit?: () => void;
}

export function QuestionForm({ onSave, editingQuestion, onCancelEdit }: QuestionFormProps) {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<Array<{ text: string; correct: boolean }>>([
    { text: '', correct: false },
    { text: '', correct: false },
    { text: '', correct: false },
    { text: '', correct: false }
  ]);
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    if (editingQuestion) {
      setText(editingQuestion.text);
      setOptions([...editingQuestion.options]);
      setDuration(editingQuestion.duration);
    }
  }, [editingQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingQuestion?.id || crypto.randomUUID(),
      text,
      options,
      duration
    });
    resetForm();
  };

  const resetForm = () => {
    setText('');
    setOptions([
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false }
    ]);
    setDuration(10);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: value };
    setOptions(newOptions);
  };

  const toggleCorrect = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      correct: i === index
    }));
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Options</label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="radio"
              name="correctAnswer"
              checked={option.correct}
              onChange={() => toggleCorrect(index)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={option.text}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Option ${index + 1}`}
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duration (seconds)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="5"
          max="60"
          className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingQuestion ? 'Update' : 'Save'} Question
        </button>
        {editingQuestion && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}