"use client";
import React from 'react';
import Button from '@mui/material/Button';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

interface DraggableProps {
  id: string;
  reusable: boolean;
}

export function Draggable({id, reusable}: DraggableProps) {
  const {attributes, isDragging, transform, setNodeRef, listeners} = useDraggable({
    id,
  });

  return (
    <Button
      ref={setNodeRef}
      sx={{
        transform: CSS.Translate.toString(transform),
        boxShadow: isDragging
          ? '-1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
          : undefined,
      }}
      variant="contained"
      {...attributes}
      {...listeners}
    >
      Drag me {id}
    </Button>
  );
}
