"use client";
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { ElementsSidebar } from '@/components/Draggable/ElementsSidebar';
import { v4 as uuidv4 } from 'uuid'; // Para gerar identificadores únicos
import { TrashBin } from '@/components/Draggable/TrashBin';
import { DroppableArea } from '@/components/Droppable/DroppableArea';


export default function Page() {
  const [droppedItems, setDroppedItems] = useState<Record<string, { id: string, item: string }[]>>({
    area1: [],
    area2: [],
    area3: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null); // Gerencia o ID do item sendo arrastado
  const [activeItem, setActiveItem] = useState<string | null>(null); // Gerencia o nome do item sendo arrastado

  // Definindo áreas dinamicamente com limite
  const areas = [
    { id: 'area1', title: 'Área 1', limit: 3 },
    { id: 'area2', title: 'Área 2', limit: 2 },
    { id: 'area3', title: 'Área 3', limit: 4 },
  ];

  // Função chamada quando o drag termina
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = String(active.id); // Converte o UniqueIdentifier para string

    if (over) {
      const areaId = over.id; // Pega o id da área de drop

      // Verifica se o item foi solto na lixeira
      if (areaId === 'trash-bin') {
        const sourceArea = active.data.current?.area;
        if (sourceArea) {
          setDroppedItems((prev) => ({
            ...prev,
            [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId), // Remove o item da área de origem
          }));
        }
      }
      // Verifica se o item foi arrastado para uma nova área e se há espaço na nova área
      else if (active.data.current?.area && active.data.current.area !== areaId && droppedItems[areaId].length < areas.find(area => area.id === areaId)?.limit!) {
        const sourceArea = active.data.current.area;
        setDroppedItems((prev) => ({
          ...prev,
          [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId), // Remove da área de origem
          [areaId]: [...prev[areaId], { id: itemId, item: String(active.data.current?.item) }] // Adiciona na nova área
        }));
      } else if (!active.data.current?.area && droppedItems[areaId].length < areas.find(area => area.id === areaId)?.limit!) {
        // Se o item é da sidebar e há espaço na nova área
        setDroppedItems((prev) => ({
          ...prev,
          [areaId]: [...prev[areaId], { id: uuidv4(), item: itemId }], // Adiciona um novo item
        }));
      }
    }

    setActiveId(null); // Reseta o item ativo após o drop
    setActiveItem(null); // Limpa o nome do item ativo
  };

  // Função chamada quando o drag começa
  const onDragStart = (event: DragStartEvent) => {
    const itemId = String(event.active.id);
    const itemName = event.active.data.current?.item || null; // Captura o nome do item
    setActiveId(itemId); // Armazena o ID do item
    setActiveItem(itemName); // Armazena o nome do item
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <DndContext
        onDragEnd={onDragEnd}
        onDragStart={onDragStart} // Configura o nome do item arrastado
      >
        {/* Barra lateral de itens */}
        <ElementsSidebar />

        {/* Renderizando áreas dinamicamente */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {areas.map((area) => (
            <DroppableArea
              key={area.id}
              id={area.id}
              items={droppedItems[area.id] || []}
              areaId={area.id}
              // limit={area.limit} // Passa o limite para cada área
            />
          ))}

          {/* Lixeira */}
          <TrashBin />
        </div>

        {/* Overlay do item sendo arrastado */}
        <DragOverlay>
          {activeItem ? <div>{activeItem}</div> : null} {/* Exibe o nome do item arrastado */}
        </DragOverlay>
      </DndContext>
    </div>
  );
}