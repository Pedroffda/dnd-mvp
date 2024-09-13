"use client";
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export function Droppable({ id, children }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id, // Cada área de dropagem tem um ID único
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '200px',
        height: '300px',
        border: '2px dashed gray',
        padding: '20px',
        backgroundColor: isOver ? '#e0f7fa' : '#fff',
      }}
    >
      {children} {/* Renderiza os itens dropados aqui */}
    </div>
  );
}
