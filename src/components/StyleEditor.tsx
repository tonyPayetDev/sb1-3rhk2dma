import React from 'react';
import type { QuizStyle } from '../types';
import { Palette } from 'lucide-react';

interface StyleEditorProps {
  style: QuizStyle;
  onStyleChange: (style: QuizStyle) => void;
}

export function StyleEditor({ style, onStyleChange }: StyleEditorProps) {
  const fonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Playfair Display'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex items-center space-x-2">
        <Palette className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Style Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <input
            type="color"
            value={style.backgroundColor}
            onChange={(e) => onStyleChange({ ...style, backgroundColor: e.target.value })}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Text Color
          </label>
          <input
            type="color"
            value={style.textColor}
            onChange={(e) => onStyleChange({ ...style, textColor: e.target.value })}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Accent Color
          </label>
          <input
            type="color"
            value={style.accentColor}
            onChange={(e) => onStyleChange({ ...style, accentColor: e.target.value })}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Font Family
          </label>
          <select
            value={style.font}
            onChange={(e) => onStyleChange({ ...style, font: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}