"use client";
import React from "react";
import { SidebarItem } from "./SidebarItem";
import { Box } from "@mui/material"; // Importando o Box do MUI
import { useDroppable } from "@dnd-kit/core";

export function ElementsSidebar() {
  const items = [
    {
      id: 1,
      nome: "Raifran Silva",
    },
    {
      id: 2,
      nome: "Luis Mendes",
    },
    {
      id: 3,
      nome: "Juan Ferreira",
    },
    {
      id: 4,
      nome: "Rafaela Silva",
    },
    {
      id: 5,
      nome: "Maria Mendes",
    },
    {
      id: 6,
      nome: "João Ferreira",
    },
    {
      id: 7,
      nome: "Pedro Silva",
    },
    {
      id: 8,
      nome: "Lucas Mendes",
    },
    {
      id: 9,
      nome: "Marcos Ferreira",
    },
    {
      id: 10,
      nome: "José Silva",
    },
  ];

  const { setNodeRef } = useDroppable({
    id: "elements-sidebar", // Identificador da barra lateral
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "10px",
        // backgroundColor: "#f0f0f0",
        borderRadius: "5px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        flexWrap: "wrap", // Permitir a quebra de linha
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            textAlign: "center", // Centralizar o texto dos itens
            marginBottom: "10px", // Espaçamento entre os itens
          }}
        >
          <SidebarItem id={item.id} itemName={item.nome} />{" "}
          {/* Passa o nome do item para o Draggable */}
        </Box>
      ))}
    </Box>
  );
}
