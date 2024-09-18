"use client";
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface SidebarItemProps {
  id: number;
  itemName: string;
}

export function SidebarItem({ id, itemName }: SidebarItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { item: itemName, area: null }, // Envia o nome do item nos dados
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        padding: '10px',
        border: '1px solid black',
        margin: '0 10px', // Ajuste horizontal
        backgroundColor: 'white',
        cursor: 'grab'
      }}
    >
      {itemName} {/* Exibe o nome do item */}
    </div>
  );
}
