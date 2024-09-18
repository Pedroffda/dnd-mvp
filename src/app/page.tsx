"use client";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { ElementsSidebar } from "@/components/Calendario/Draggable/ElementsSidebar";
import { v4 as uuidv4 } from "uuid";
import { DroppableArea } from "@/components/Calendario/Droppable/DroppableArea";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import DateDisplay from "@/components/Calendario/DateDisplay";

export default function Page() {
  const [droppedItems, setDroppedItems] = useState<
    Record<string, { id: string; item: string }[]>
  >({});
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const [dataAtual, setDataAtual] = useState(new Date());

  const getInicioSemana = (date: Date) => {
    const inicio = new Date(date);
    const dia = inicio.getDay();
    const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1);
    inicio.setDate(diff);
    return inicio;
  };

  const irParaProximaSemana = () => {
    setDataAtual((prevDate) => {
      const novaData = new Date(prevDate);
      novaData.setDate(novaData.getDate() + 7);
      return novaData;
    });
  };

  const voltarSemana = () => {
    setDataAtual((prevDate) => {
      const novaData = new Date(prevDate);
      novaData.setDate(novaData.getDate() - 7);
      return novaData;
    });
  };

  // Generate dates for the current week
  const inicioSemana = getInicioSemana(dataAtual);
  const diasDaSemana: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(inicioSemana);
    date.setDate(inicioSemana.getDate() + i);
    diasDaSemana.push(date);
  }

  const turnos = [
    { id: "manha", title: "Manhã (07:00 - 13:00)", color: "#d9534f" },
    { id: "tarde", title: "Tarde (13:00 - 19:00)", color: "#f0ad4e" },
    { id: "noite", title: "Noite (19:00 - 01:00)", color: "#5bc0de" },
    // Add other shifts dynamically if needed
  ];

  const headers = [
    { id: "turno", title: "Turno" },
    ...diasDaSemana.map((date) => ({
      id: date.toISOString().split("T")[0], // Use ISO date string as id
      title: date.toLocaleDateString("pt-BR", { weekday: "long" }),
    })),
  ];

  // Generate areas based on shifts and dates
  const areas: { id: string; turnoId: string; date: Date; limit: number }[] =
    [];
  for (const turno of turnos) {
    for (const date of diasDaSemana) {
      const areaId = `${turno.id}-${date.toISOString().split("T")[0]}`;
      areas.push({
        id: areaId,
        turnoId: turno.id,
        date: date,
        limit: 2, // Adjust the limit as needed
      });
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = String(active.id);

    if (over) {
      const areaId = over.id;

      if (
        areaId === "elements-sidebar" &&
        active.data.current?.area !== undefined
      ) {
        const sourceArea = active.data.current?.area;
        if (sourceArea) {
          // Remove the item from the source area
          setDroppedItems((prev) => ({
            ...prev,
            [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId),
          }));
        }
      } else {
        const sourceArea = active.data.current?.area;

        // Check if moving to a new area and if the new area has space
        if (
          active.data.current?.area &&
          active.data.current.area !== areaId &&
          (droppedItems[areaId]?.length ?? 0) <
            (areas.find((area) => area.id === areaId)?.limit ?? 0)
        ) {
          // Remove from the source area and add to the new area
          setDroppedItems((prev) => ({
            ...prev,
            [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId),
            [areaId]: [
              ...(prev[areaId] || []),
              { id: itemId, item: String(active.data.current?.item) },
            ],
          }));
        } else if (
          !active.data.current?.area &&
          (droppedItems[areaId]?.length ?? 0) <
            (areas.find((area) => area.id === areaId)?.limit ?? 0)
        ) {
          // If the item is new (from the sidebar), add directly to the new area
          setDroppedItems((prev) => ({
            ...prev,
            [areaId]: [...(prev[areaId] || []), { id: uuidv4(), item: itemId }],
          }));
        }
      }
    }

    // Clear the active item after drop
    setActiveItem(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    const itemId = String(event.active.id);
    const itemName = event.active.data.current?.item || null;
    setActiveItem(itemName);
  };

  // Simulated payload
  const initialPayload = [
    {
      turnoId: "manha",
      date: "2024-09-16",
      itemId: "0df828ba-4587-457c-a113-9c85d49c12e7",
      itemName: "Raifran Silva",
    },
    {
      turnoId: "tarde",
      date: "2024-09-16",
      itemId: "0df828ba-4587-457c-a113-9c85d49c12e8",
      itemName: "Raifran Silva",
    },
    // ...more items
  ];

  const processPayload = (
    payload: {
      turnoId: string;
      date: string;
      itemId: string;
      itemName: string;
    }[]
  ) => {
    const newDroppedItems: Record<string, { id: string; item: string }[]> = {};

    payload.forEach(({ turnoId, date, itemId, itemName }) => {
      const areaId = `${turnoId}-${date}`; // Construct the area ID
      if (!newDroppedItems[areaId]) {
        newDroppedItems[areaId] = [];
      }
      newDroppedItems[areaId].push({
        id: itemId,
        item: itemName,
      });
    });

    return newDroppedItems;
  };

  // Process the payload to update droppedItems when dataAtual changes
  useEffect(() => {
    const currentWeekDates = diasDaSemana.map(
      (date) => date.toISOString().split("T")[0]
    );

    // Filter payload for current week
    const currentWeekPayload = initialPayload.filter(({ date }) =>
      currentWeekDates.includes(date)
    );

    const newDroppedItems = processPayload(currentWeekPayload);

    setDroppedItems(newDroppedItems);
  }, [dataAtual]);


  return (
    <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {/* Header of Draggable Items */}
      <ElementsSidebar />

      {/* Date Display */}
      <DateDisplay
        mensal={false}
        dataAtual={dataAtual}
        irParaProximaSemana={irParaProximaSemana}
        voltarSemana={voltarSemana}
      />
      {/* Shifts Table */}
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
              {diasDaSemana.map((date) => (
                <TableCell
                  key={date.toISOString().split("T")[0]}
                  sx={{
                    border: "1px solid #ccc",
                    padding: 0,
                    backgroundColor: "#f0f0f0",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
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
                {diasDaSemana.map((date) => {
                  const areaId = `${turno.id}-${
                    date.toISOString().split("T")[0]
                  }`;
                  const area = areas.find((area) => area.id === areaId);
                  return (
                    <TableCell
                      key={areaId}
                      sx={{
                        border: "1px solid #ccc",
                        padding: 0,
                        minWidth: "150px",
                      }}
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
                        ""
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Overlay of the item being dragged */}
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
      <pre>{JSON.stringify(droppedItems, null, 2)}</pre>
    </DndContext>
    
  );
}
