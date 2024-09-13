"use client";
import React from 'react';
import { DraggableItem } from '@/components/Draggable/DraggableItem';
import { Droppable } from '.';

interface DroppableAreaProps {
  id: string;
  items: { id: string; item: string }[];
  areaId: string;
}

export function DroppableArea({ id, items, areaId }: DroppableAreaProps) {
  return (
    <Droppable id={id}>
        {items.map((item) => (
          <DraggableItem key={item.id} id={item.id} item={item.item} area={areaId} />
        ))}
    </Droppable>
  );
}
