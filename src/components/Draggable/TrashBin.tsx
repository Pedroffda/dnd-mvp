"use client";
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function TrashBin() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'trash-bin', // Identificador da lixeira
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '150px',
        height: '150px',
        backgroundColor: isOver ? '#ff1744' : '#f5f5f5', // Muda a cor quando um item é arrastado sobre ela
        border: '2px dashed #d32f2f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#d32f2f',
        fontWeight: 'bold',
      }}
    >
      🗑️ Lixeira {/* Icone e texto da lixeira */}
    </div>
  );
}
