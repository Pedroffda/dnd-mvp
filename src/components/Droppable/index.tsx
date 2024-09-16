"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export function Droppable({ id, children }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id, // Cada área de dropagem tem um ID único
  });

  return (
    <div ref={setNodeRef}>
      {children} {/* Renderiza os itens dropados aqui */}
    </div>
  );
}
