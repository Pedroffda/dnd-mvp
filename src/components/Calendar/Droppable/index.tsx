"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

export function Droppable({ id, children }: Readonly<DroppableProps>) {
  const { isOver, setNodeRef } = useDroppable({
    id, // Cada área de dropagem tem um ID único
  });

  return (
    <Box ref={setNodeRef} sx={{
      border: "1px solid #e0e0e0",
      minHeight: "30px",
      padding: "8px",
      textAlign: "center",
      backgroundColor: isOver ? "#f0f0f0" : "#fefefe",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }} >
      {children} {/* Renderiza os itens dropados aqui */}
    </Box>
  );
}
