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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        {/* Header de Itens Draggables */}
        <ElementsSidebar />

        {/* Tabela de turnos */}
        <div style={{ flexGrow: 1 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      border: "1px solid #ccc",
                      width: "100px",
                      padding: "10px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => (
                <tr key={turno.id}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderLeft: `5px solid ${turno.color}`,
                      alignContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // fontWeight: "bold",
                      }}
                    >
                      {turno.title}
                    </div>
                  </td>
                  {headers
                    .filter((header) => header.id !== "turno") // Ignorar o cabeçalho de turno
                    .map((header) => {
                      // Filtra áreas por turnoId e diaDaSemana
                      const area = areas.find(
                        (area) =>
                          area.turnoId === turno.id &&
                          area.diaDaSemana === header.id
                      );
                      return (
                        <td
                          key={`${turno.id}-${header.id}`}
                          style={{ border: "1px solid #ccc" }}
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
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lixeira */}
        <TrashBin />

        {/* Overlay do item sendo arrastado */}
        <DragOverlay>
          {activeItem ? (
            <div
              style={{
                padding: "10px",
                width: "200px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                // borderRadius: "5px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              {activeItem}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
