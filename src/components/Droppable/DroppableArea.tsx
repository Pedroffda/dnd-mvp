"use client";
import React from "react";
import { DraggableItem } from "@/components/Draggable/DraggableItem";
import { Droppable } from ".";
import { Box } from "@mui/material"; // Importando o Box do Material-UI

interface DroppableAreaProps {
  id: string;
  items: { id: string; item: string }[];
  areaId: string;
  limit?: number; // Número de vagas (limite)
  borderColor?: string; // Cor da borda
}

export function DroppableArea({
  id,
  items,
  areaId,
  limit = 1,
  borderColor = "#ddd",
}: DroppableAreaProps) {
  return (
    <Droppable id={id}>
      <Box display="flex" flexDirection="column">
        {[...Array(limit)].map((_, index) => (
          <Box
            key={`${id}-${index}`}
            sx={{
              border: "1px solid #e0e0e0",
              minHeight: "30px",
              padding: "8px",
              textAlign: "center",
              backgroundColor: items[index] ? "#fefefe" : "#fefefe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: items[index] ? `5px solid ${borderColor}` : "none", // Borda à esquerda se houver item
              fontWeight: items[index] ? "bold" : "normal",
            }}
          >
            {items[index] ? (
              <DraggableItem
                key={items[index].id}
                id={items[index].id}
                item={items[index].item}
                area={areaId}
              />
            ) : (
              "-" // Exibe um traço quando não há item
            )}
          </Box>
        ))}
      </Box>
    </Droppable>
  );
}
