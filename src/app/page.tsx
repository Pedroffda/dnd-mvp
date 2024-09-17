"use client";
import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { ElementsSidebar } from "@/components/Draggable/ElementsSidebar"; // Agora é um header
import { v4 as uuidv4 } from "uuid";
import { TrashBin } from "@/components/Draggable/TrashBin";
import { DroppableArea } from "@/components/Droppable/DroppableArea";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function Page() {
  const [droppedItems, setDroppedItems] = useState<
    Record<string, { id: string; item: string }[]>
  >({});

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const turnos = [
    { id: "manha", title: "Manhã (07:00 - 13:00)", color: "#d9534f" },
    { id: "tarde", title: "Tarde (13:00 - 19:00)", color: "#f0ad4e" },
    { id: "noite", title: "Noite (19:00 - 01:00)", color: "#5bc0de" },
    // Adicione outros turnos dinamicamente se necessário
  ];

  const areas = [
    { id: "1", turnoId: "manha", diaDaSemana: "segunda", limit: 2 },
    { id: "2", turnoId: "manha", diaDaSemana: "terca", limit: 2 },
    { id: "3", turnoId: "tarde", diaDaSemana: "segunda", limit: 2 },
    { id: "4", turnoId: "tarde", diaDaSemana: "terca", limit: 2 },
    { id: "5", turnoId: "noite", diaDaSemana: "segunda", limit: 2 },
    { id: "6", turnoId: "noite", diaDaSemana: "terca", limit: 2 },
    { id: "7", turnoId: "manha", diaDaSemana: "quarta", limit: 2 },
    { id: "8", turnoId: "manha", diaDaSemana: "quinta", limit: 2 },
    { id: "9", turnoId: "tarde", diaDaSemana: "quarta", limit: 2 },
    { id: "10", turnoId: "tarde", diaDaSemana: "quinta", limit: 2 },
    { id: "11", turnoId: "noite", diaDaSemana: "quarta", limit: 2 },
    { id: "12", turnoId: "noite", diaDaSemana: "quinta", limit: 2 },
    { id: "13", turnoId: "manha", diaDaSemana: "sexta", limit: 2 },
    { id: "14", turnoId: "manha", diaDaSemana: "sabado", limit: 2 },
    { id: "15", turnoId: "tarde", diaDaSemana: "sexta", limit: 2 },
    { id: "16", turnoId: "tarde", diaDaSemana: "sabado", limit: 2 },
    { id: "17", turnoId: "noite", diaDaSemana: "sexta", limit: 2 },
    { id: "18", turnoId: "noite", diaDaSemana: "sabado", limit: 2 },
    { id: "19", turnoId: "manha", diaDaSemana: "domingo", limit: 2 },
    { id: "20", turnoId: "tarde", diaDaSemana: "domingo", limit: 2 },
    { id: "21", turnoId: "noite", diaDaSemana: "domingo", limit: 2 },
  ];
  const headers = [
    { id: "turno", title: "Turno" },
    { id: "segunda", title: "Segunda" },
    { id: "terca", title: "Terça" },
    { id: "quarta", title: "Quarta" },
    { id: "quinta", title: "Quinta" },
    { id: "sexta", title: "Sexta" },
    { id: "sabado", title: "Sábado" },
    { id: "domingo", title: "Domingo" },
  ];

  // Datas correspondentes aos dias da semana
  const dates = [
    { id: "segunda", date: "12/12" },
    { id: "terca", date: "13/12" },
    { id: "quarta", date: "14/12" },
    { id: "quinta", date: "15/12" },
    { id: "sexta", date: "16/12" },
    { id: "sabado", date: "17/12" },
    { id: "domingo", date: "18/12" },
  ];

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = String(active.id);

    if (over) {
      const areaId = over.id;

      if (areaId === "trash-bin") {
        const sourceArea = active.data.current?.area;
        if (sourceArea) {
          // Remover o item da área de origem (sourceArea)
          setDroppedItems((prev) => ({
            ...prev,
            [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId),
          }));
        }
      } else {
        const sourceArea = active.data.current?.area;

        // Verifica se está mudando de área e se a nova área tem espaço
        if (
          active.data.current?.area &&
          active.data.current.area !== areaId &&
          (droppedItems[areaId]?.length ?? 0) <
            (areas.find((area) => area.id === areaId)?.limit ?? 0)
        ) {
          // Remover da área de origem e adicionar à nova área
          setDroppedItems((prev) => ({
            ...prev,
            [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId), // Remove da origem
            [areaId]: [
              ...(prev[areaId] || []),
              { id: itemId, item: String(active.data.current?.item) }, // Adiciona na nova área
            ],
          }));
        } else if (
          !active.data.current?.area &&
          (droppedItems[areaId]?.length ?? 0) <
            (areas.find((area) => area.id === areaId)?.limit ?? 0)
        ) {
          // Se o item for novo (vindo da sidebar), adiciona diretamente à nova área
          setDroppedItems((prev) => ({
            ...prev,
            [areaId]: [
              ...(prev[areaId] || []),
              { id: uuidv4(), item: itemId }, // Adiciona o novo item
            ],
          }));
        }
      }
    }

    // Limpa o item ativo após o drop
    setActiveItem(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    const itemId = String(event.active.id);
    const itemName = event.active.data.current?.item || null;
    setActiveItem(itemName);
  };

  return (
    <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {/* Header de Itens Draggables */}
      <ElementsSidebar />

      {/* Tabela de turnos */}
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {header.title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell
                sx={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}
              ></TableCell>
              {dates.map((date) => (
                <TableCell
                  key={date.id}
                  sx={{
                    border: "1px solid #ccc",
                    padding: 0,
                    backgroundColor: "#f0f0f0",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {date.date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.map((turno) => (
              <TableRow key={turno.id}>
                <TableCell
                  sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    borderLeft: `5px solid ${turno.color}`,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    fontWeight: "bold",
                    maxWidth: "50px",
                  }}
                >
                  {turno.title}
                </TableCell>
                {headers
                  .filter((header) => header.id !== "turno")
                  .map((header) => {
                    const area = areas.find(
                      (area) =>
                        area.turnoId === turno.id &&
                        area.diaDaSemana === header.id
                    );
                    return (
                      <TableCell
                        key={`${turno.id}-${header.id}`}
                        sx={{ border: "1px solid #ccc", padding: 0, minWidth: "150px" }}
                      >
                        {area ? (
                          <DroppableArea
                            id={area.id}
                            items={droppedItems[area.id] || []}
                            areaId={area.id}
                            limit={area.limit}
                            borderColor={turno.color}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    );
                  })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Lixeira */}
      <TrashBin />

      {/* Overlay do item sendo arrastado */}
      <DragOverlay>
        {activeItem ? (
          <Box
            sx={{
              padding: 2,
              width: "200px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            {activeItem}
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
