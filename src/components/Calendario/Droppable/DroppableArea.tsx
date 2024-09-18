"use client";
import React from "react";
import { DraggableItem } from "@/components/Calendario/Draggable/DraggableItem";
import { Droppable } from ".";
import { Box } from "@mui/material"; // Importando o Box do Material-UI

interface DroppableAreaProps {
  id: string;
  items: { id: string; item: string }[];
  areaId: string;
  limit?: number; // Número de vagas (limite)
  borderColor?: string; // Cor da borda
}

const styles = {
  border: "1px solid #e0e0e0",
  minHeight: "30px",
  padding: "8px",
  textAlign: "center",
  backgroundColor: "#fefefe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

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
              ...styles,
              borderLeft: items[index] ? `5px solid ${borderColor}` : "none",
              fontWeight: items[index] ? "bold" : "normal",
            }}
            onClick={
              () => alert(`Clicou na área ${areaId} (em construção) [adicionar form]`) 
            }
          >
            {items[index] ? (
              <DraggableItem
                key={items[index].id}
                id={items[index].id}
                item={items[index].item}
                area={areaId}
              />
            ) : (
              "" // Exibe um traço quando não há item
            )}
          </Box>
        ))}
      </Box>
    </Droppable>
  );
}
