"use client";
import React from "react";
import { DraggableItem } from "@/components/Draggable/DraggableItem";
import { Droppable } from ".";

interface DroppableAreaProps {
  id: string;
  items: { id: string; item: string }[];
  areaId: string;
  limit: number; // Número de vagas (limite)
}

export function DroppableArea({
  id,
  items,
  areaId,
  limit,
}: DroppableAreaProps) {
  return (
    <Droppable id={id}>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {[...Array(limit)].map((_, index) => (
          // Dentro do `DroppableArea`
          <div
            key={`${id}-${index}`}
            style={{
              border: "1px solid #e0e0e0",
              minHeight: "30px", // Altura das células
              padding: "2px",
              textAlign: "center",
              backgroundColor: items[index] ? "#fefefe" : "#f9f9f9", // Cor para células com e sem item
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: items[index] ? "5px solid #d9534f" : "5px solid #ddd", // Bordas laterais coloridas
              fontWeight: items[index] ? "bold" : "normal", // Texto em negrito se houver item
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
          </div>
        ))}
      </div>
    </Droppable>
  );
}
