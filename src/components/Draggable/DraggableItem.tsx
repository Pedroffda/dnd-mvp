"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: string; // Identificador único do item
  item: string; // Nome/label do item
  area: string; // Área atual do item
}

export function DraggableItem({ id, item, area }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id, // Usamos o id para controle de identificação
    data: { item, area }, // Passamos o nome e a área atual
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        padding: "5px",
        width: "100%",
        backgroundColor: isDragging ? "lightblue" : "white", // Estilo diferente quando arrastado
        boxShadow: isDragging ? "0px 4px 12px rgba(0,0,0,0.2)" : "none",
        border: isDragging ? "1px solid lightblue" : "",
        cursor: "grab",
      }}
    >
      {item} 
      {/* " - " {area} " - "
      {id}  */}
    </div>
  );
}
