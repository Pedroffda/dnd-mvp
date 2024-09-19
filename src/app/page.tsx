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
import { styles } from "./calendarStyles";
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
    Record<string, { id: string; item: string; uId: string }[]>
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
    {
      id: "2",
      title: "Manhã",
      color: "#d9534f",
      inicio: "07:00",
      fim: "13:00",
      vagas: 3,
      sequencia: 1,
      domingo: true,
      segunda: true,
      terca: true,
      quarta: true,
      quinta: true,
      sexta: true,
      sabado: true,
    },
    {
      id: "1",
      title: "Tarde",
      color: "#f0ad4e",
      inicio: "13:00",
      fim: "19:00",
      vagas: 2,
      sequencia: 1,
      domingo: true,
      segunda: true,
      terca: true,
      quarta: true,
      quinta: true,
      sexta: true,
      sabado: true,
    },
    {
      id: "3",
      title: "Noite",
      color: "#5bc0de",
      inicio: "19:00",
      fim: "01:00",
      vagas: 1,
      sequencia: 3,
      domingo: true,
      segunda: true,
      terca: true,
      quarta: true,
      quinta: true,
      sexta: false,
      sabado: true,
    },
    // Add other shifts as needed
  ];

  turnos.sort((a, b) => a.sequencia - b.sequencia);

  const dayOfWeekMap: { [key: number]: string } = {
    0: "domingo",
    1: "segunda",
    2: "terca",
    3: "quarta",
    4: "quinta",
    5: "sexta",
    6: "sabado",
  };

  const headers = [
    { id: "turno", title: "Turno" },
    ...diasDaSemana.map((date) => ({
      id: date.toISOString().split("T")[0], // Use ISO date string as id
      title: date.toLocaleDateString("pt-BR", { weekday: "long" }),
    })),
  ];

  // Generate areas based on shifts and dates
  const areas: {
    id: string;
    uId: string;
    turnoId: string;
    date: Date;
    limit: number;
  }[] = [];

  for (const turno of turnos) {
    for (const date of diasDaSemana) {
      const dayIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      const dayName = dayOfWeekMap[dayIndex];

      // Check if the turno is available on this day
      if (turno[dayName as keyof typeof turno]) {
        const areaId = `${turno.id}-${date.toISOString().split("T")[0]}`;
        areas.push({
          id: areaId,
          turnoId: turno.id,
          date: date,
          limit: turno.vagas || 2,
          uId: "",
        });
      }
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = String(active.id);
    const itemName = active.data.current?.item || null;
    const uId = active.data.current?.uId || null;

    console.log("active", active);

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
              {
                id: itemId,
                item: itemName,
                uId: uId,
              },
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
            [areaId]: [
              ...(prev[areaId] || []),
              {
                id: itemId,
                item: itemName,
                uId: uuidv4(),
              },
            ],
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
  const initialPayload: {
    turnoId: string;
    date: string;
    itemId: string;
    itemName: string;
    uId: string;
  }[] = [
    // {
    //   turnoId: "1",
    //   date: "2024-09-16",
    //   itemId: "0df828ba-4587-457c-a113-9c85d49c12e7",
    //   itemName: "Raifran Silva",
    //   uId: "some-unique-id-1",
    // },
  ];

  const processPayload = (
    payload: {
      turnoId: string;
      date: string;
      itemId: string;
      itemName: string;
      uId: string;
    }[]
  ) => {
    const newDroppedItems: Record<
      string,
      { id: string; item: string; uId: string }[]
    > = {};

    payload.forEach(({ turnoId, date, itemId, itemName, uId }) => {
      const areaId = `${turnoId}-${date}`;
      if (!newDroppedItems[areaId]) {
        newDroppedItems[areaId] = [];
      }
      newDroppedItems[areaId].push({
        id: itemId,
        item: itemName,
        uId: uId,
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

    const newDroppedItems = processPayload(currentWeekPayload || []);

    setDroppedItems(newDroppedItems || {});
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
                <TableCell key={header.id} sx={styles.headerTableCell}>
                  {header.title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={styles.weekdayTableCell}></TableCell>
              {diasDaSemana.map((date) => (
                <TableCell
                  key={date.toISOString().split("T")[0]}
                  sx={styles.weekdayTableCell}
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
                <TableCell sx={styles.turnoTableCell}>
                  {turno.title}
                  <Box sx={styles.timeTableCell}>
                    {`${turno.inicio} - ${turno.fim}`}
                  </Box>
                </TableCell>
                {diasDaSemana.map((date) => {
                  const areaId = `${turno.id}-${
                    date.toISOString().split("T")[0]
                  }`;
                  const area = areas.find((area) => area.id === areaId);
                  const isAvailable = area !== undefined;
                  return (
                    <TableCell
                      key={areaId}
                      sx={{
                        ...styles.areaTableCell,
                        backgroundColor: isAvailable ? "inherit" : "#f5f5f5",
                      }}
                    >
                      {isAvailable ? (
                        <DroppableArea
                          id={area.id}
                          items={droppedItems[area.id] || []}
                          areaId={area.id}
                          limit={area.limit}
                          borderColor={turno.color}
                        />
                      ) : (
                        <Box sx={styles.indisponivelBox}>
                          {/* You can display a message or icon here */}
                          Indisponível
                        </Box>
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
        {activeItem ? <Box sx={styles.overlayBox}>{activeItem}</Box> : null}
      </DragOverlay>
      <pre>{JSON.stringify(droppedItems, null, 2)}</pre>
    </DndContext>
  );
}
