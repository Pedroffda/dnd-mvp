"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Box } from "@mui/material";

interface DraggableItemProps {
  id: string; 
  item: string; 
  area: string; 
  uId: string;
}

export function DraggableItem({ id, item, area, uId }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id, // Usamos o id para controle de identificação
    data: { item, area, uId }, // Passamos o nome e a área atual
  });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        padding: "5px",
        width: "100%",
        backgroundColor: isDragging ? "lightblue" : "white", 
        boxShadow: isDragging ? "0px 4px 12px rgba(0,0,0,0.2)" : "none",
        border: isDragging ? "1px solid lightblue" : "",
        cursor: "grab",
        fontWeight: "bold",
      }}
    >
      {item} 
    </Box>
  );
}
