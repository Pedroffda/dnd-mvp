"use client";
import React from "react";
import { DraggableItem } from "@/components/Calendar/Draggable/DraggableItem";
import { Box } from "@mui/material"; // Importando o Box do Material-UI
import { useDroppable } from "@dnd-kit/core";

interface DroppableAreaProps {
  id: string;
  items: { id: string; item: string, uId: string}[];
  areaId: string;
  limit?: number; // Número de vagas (limite)
  borderColor?: string; // Cor da borda
}

const styles = {
  // border: "1px solid #e0e0e0",
  // backgroundColor: "red",
  minHeight: "30px",
  padding: "1px",
  textAlign: "center",
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
}: Readonly<DroppableAreaProps>) {

    const { isOver, setNodeRef } = useDroppable({
      id, // Cada área de dropagem tem um ID único
    });

  return (
      <Box display="flex" flexDirection="column">
        {[...Array(limit)].map((_, index) => (
          <Box
          ref={setNodeRef} // Define a referência do `droppable`
            key={`${id}-${index}`}
            sx={{
              ...styles,
              borderLeft: items[index] ? `5px solid ${borderColor}` : "none",
              fontWeight: items[index] ? "bold" : "normal",
              backgroundColor: isOver ? "#f0f0f0" : "#fefefe",
            }}
            onClick={
              () => alert(`Clicou na área ${areaId} (em construção) [adicionar form]`) 
            }
          >
            {items[index] ? (
              <DraggableItem
                uId={items[index].uId}
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
  );
}
