import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import type { Question } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  selectedQuestion: number;
  onSelect: (index: number) => void;
  onDelete: (id: string) => void;
  onEdit: (question: Question) => void;
  onReorder: (questions: Question[]) => void;
}

export function QuestionList({
  questions,
  selectedQuestion,
  onSelect,
  onDelete,
  onEdit,
  onReorder
}: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      
      onReorder(arrayMove(questions, oldIndex, newIndex));
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map(q => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {questions.map((question, index) => (
              <SortableItem key={question.id} id={question.id}>
                <div
                  className={`p-4 bg-white rounded-lg shadow-sm border-2 transition-colors ${
                    index === selectedQuestion
                      ? 'border-indigo-500'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelect(index)}
                      className="flex-1 text-left"
                    >
                      <h3 className="font-medium text-gray-900 truncate">
                        {question.text}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {question.duration}s • {question.options.length} options
                      </p>
                    </button>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => onEdit(question)}
                        className="p-1 text-gray-400 hover:text-indigo-500"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(question.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}