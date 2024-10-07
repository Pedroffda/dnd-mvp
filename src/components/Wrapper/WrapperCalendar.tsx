"use client";
import React, { useEffect, useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import CalendarLayout from "../CalendarLayout";
import { turnos } from "./turnos";

export default function WrapperCalendar() {
  const [droppedItems, setDroppedItems] = useState<
    Record<string, { id: string; item: string; uId: string }[]>
  >({});
  const [activeItem, setActiveItem] = useState<{
    id: string;
    item: string;
    uId: string;
  } | null>(null);

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

    // console.log("active", active);

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
          // Check if the item is new (from the sidebar) and if the new area has space
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
                id: uuidv4(),
                item: itemName,
                uId: itemId,
              },
            ],
          }));
        }
      }
    }

    // Clear the active item after drop
    setActiveItem(null);
  };

  // salvar os droppedItems no localStorage
  useEffect(() => {
    localStorage.setItem("droppedItems", JSON.stringify(droppedItems));
  }, [droppedItems]);

  const onDragStart = (event: DragStartEvent) => {
    const itemId = String(event.active.id);
    const itemName = event.active.data.current?.item || "";
    const uId = event.active.data.current?.uId || "";
    setActiveItem({ id: itemId, item: itemName, uId: uId });
  };

  // Simulated payload
  const initialPayload: {
    turnoId: string;
    date: string;
    itemId: string;
    itemName: string;
    uId: string;
  }[] = [];

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
    const currentWeekPayload = initialPayload?.filter(({ date }) =>
      currentWeekDates.includes(date)
    );

    const newDroppedItems = processPayload(currentWeekPayload || []);

    // get the droppedItems from localStorage
    const storedDroppedItems = localStorage.getItem("droppedItems");
    const parsedDroppedItems = storedDroppedItems
      ? JSON.parse(storedDroppedItems)
      : {};

    // Merge the payload with the stored droppedItems

    const mergedDroppedItems = {
      ...parsedDroppedItems,
      ...newDroppedItems,
    };

    setDroppedItems(mergedDroppedItems);
  }, [dataAtual]);

  return (
    <>
      <CalendarLayout
        areas={areas}
        turnos={turnos}
        diasDaSemana={diasDaSemana}
        droppedItems={droppedItems}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        dataAtual={dataAtual}
        irParaProximaSemana={irParaProximaSemana}
        voltarSemana={voltarSemana}
        activeItem={activeItem || { id: "", item: "", uId: "" }}
        headers={headers}
      />
      <pre>{JSON.stringify(droppedItems, null, 2)}</pre>
    </>
  );
}
