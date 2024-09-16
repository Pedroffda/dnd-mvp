"use client";
import React from 'react';
import { SidebarItem } from './SidebarItem';

export function ElementsSidebar() {
  const items = ['Item 1', 'Item 2', 'Item 3']; // Itens disponíveis no header

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '10px',
      backgroundColor: '#f0f0f0',
      borderBottom: '2px solid #ccc'
    }}>
      {items.map((item) => (
        <SidebarItem key={item} id={item} itemName={item} /> // Passa o nome do item para o Draggable
      ))}
    </div>
  );
}
