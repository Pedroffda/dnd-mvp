"use client";
import React from 'react';
import { SidebarItem } from './SidebarItem';

export function ElementsSidebar() {
  const items = ['Item 1', 'Item 2', 'Item 3']; // Os itens disponíveis na sidebar

  return (
    <div style={{ width: '200px', padding: '20px', border: '1px solid gray' }}>
      {items.map((item) => (
        <SidebarItem key={item} id={item} itemName={item} /> // Passa o nome do item para o Draggable
      ))}
    </div>
  );
}
