"use client";
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Box } from "@mui/system";

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
    <Box
    ref={setNodeRef}
    {...attributes}
    {...listeners}
    sx={{
      alignItems: "center",
      backgroundColor: "white",
      border: "1px solid black",
      borderRadius: "5px",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
      cursor: "grab",
      display: "flex",
      margin: "0 10px",
      padding: "10px",
    }}
  >
    {itemName}
  </Box>
);
}
