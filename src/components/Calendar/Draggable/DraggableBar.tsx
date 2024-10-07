"use client";
import React from "react";
import { SidebarItem } from "./BarItem";
import { Box, Grid2 } from "@mui/material"; // Importando o Box do MUI
import { useDroppable } from "@dnd-kit/core";

interface DraggableBarProps {
  id: string;
  itens: Array<{
    id: number;
    nome: string;
  }>;
  direction?: "row" | "column";
}

export function DraggableBar({
  id,
  itens,
  direction = "row",
}: Readonly<DraggableBarProps>) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Grid2
    role="draggable"
      container
      ref={setNodeRef}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        borderRadius: "5px",
        flexWrap: "wrap",
        flexDirection: direction,
        gap: "10px",
      }}
    >
      {itens.map((item) => (
        <Box key={item.id}
        >
          <SidebarItem id={item.id} itemName={item.nome} />{" "}
        </Box>
      ))}
    </Grid2>
  );
}
