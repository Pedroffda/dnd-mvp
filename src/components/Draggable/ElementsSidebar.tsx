"use client";
import React from 'react';
import { SidebarItem } from './SidebarItem';
import { Box } from '@mui/material'; // Importando o Box do MUI

export function ElementsSidebar() {
  const items = ['Raifran Silva', 'Luis Mendes', 'Juan Ferreira', 
    "Rafaela Silva", "Maria Mendes", "João Ferreira", "Pedro Silva",
    "Lucas Mendes", "Marcos Ferreira", "José Silva", "Carlos Mendes",
    "Antonio Ferreira", "Cristina Silva", "Ana Mendes", "Julia Ferreira",
    // "Larissa Silva", "Amanda Mendes", "Carla Ferreira", "Fernanda Silva",
    // "Mariana Mendes", "Renata Ferreira", "Tatiana Silva", "Camila Mendes",
    // "Viviane Ferreira", "Patricia Silva", "Sandra Mendes", "Luciana Ferreira",
  ]; // Itens disponíveis no header

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        // rowGap: '10px',
        // borderBottom: '2px solid #ccc',
        flexWrap: 'wrap',          // Permitir a quebra de linha
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item}
          sx={{
            // flex: '1 1 10%',       // Cada item ocupa 10% da largura, quebrando a linha após 10 itens
            // maxWidth: '10%',
            textAlign: 'center',   // Centralizar o texto dos itens
            marginBottom: '10px',  // Espaçamento entre os itens
          }}
        >
          <SidebarItem id={item} itemName={item} /> {/* Passa o nome do item para o Draggable */}
        </Box>
      ))}
    </Box>
  );
}
