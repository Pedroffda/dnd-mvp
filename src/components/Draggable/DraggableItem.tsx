"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: string; // Identificador único do item
  item: string; // Nome/label do item
  area: string; // Área atual do item
}

export function DraggableItem({ id, item, area }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
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
        // border: "1px solid black",
        // marginBottom: "10px",
        backgroundColor: "white",
      }}
    >
      {item} {/* Exibe o nome/label do item */}
    </div>
  );
}
