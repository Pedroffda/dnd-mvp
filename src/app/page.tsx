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
  >({
    "segunda-manha": [],
    "segunda-tarde": [],
    "terca-manha": [],
    "terca-tarde": [],
    "quarta-manha": [],
    "quarta-tarde": [],
    "quinta-manha": [],
    "quinta-tarde": [],
    "sexta-manha": [],
    "sexta-tarde": [],
    "sabado-manha": [],
    "sabado-tarde": [],
    "domingo-manha": [],
    "domingo-tarde": [],
    "segunda-noite": [],
    "terca-noite": [],
    "quarta-noite": [],
    "quinta-noite": [],
    "sexta-noite": [],
    "sabado-noite": [],
    "domingo-noite": [],
    // Adicione mais turnos se necessário
  });

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const turnos = [
    { id: "manha", title: "Manhã (07:00 - 13:00)", color: "#d9534f" },
    { id: "tarde", title: "Tarde (13:00 - 19:00)", color: "#f0ad4e" },
    { id: "noite", title: "Noite (19:00 - 01:00)", color: "#5bc0de" },
    // Adicione outros turnos dinamicamente se necessário
  ];

  const areas = [
    { id: "segunda-manha", title: "Segunda Manhã", limit: 2 }, // Define 3 vagas, por exemplo
    { id: "segunda-tarde", title: "Segunda Tarde", limit: 2 },
    { id: "terca-manha", title: "Terça Manhã", limit: 2 },
    { id: "terca-tarde", title: "Terça Tarde", limit: 2 },
    { id: "quarta-manha", title: "Quarta Manhã", limit: 2 },
    { id: "quarta-tarde", title: "Quarta Tarde", limit: 2 },
    { id: "quinta-manha", title: "Quinta Manhã", limit: 2 },
    { id: "quinta-tarde", title: "Quinta Tarde", limit: 2 },
    { id: "sexta-manha", title: "Sexta Manhã", limit: 2 },
    { id: "sexta-tarde", title: "Sexta Tarde", limit: 2 },
    { id: "sabado-manha", title: "Sábado Manhã", limit: 2 },
    { id: "sabado-tarde", title: "Sábado Tarde", limit: 2 },
    { id: "domingo-manha", title: "Domingo Manhã", limit: 2 },
    { id: "domingo-tarde", title: "Domingo Tarde", limit: 2 },
    { id: "segunda-noite", title: "Noite", limit: 2 },
    { id: "terca-noite", title: "Noite", limit: 2 },
    { id: "quarta-noite", title: "Noite", limit: 2 },
    { id: "quinta-noite", title: "Noite", limit: 2 },
    { id: "sexta-noite", title: "Noite", limit: 2 },
    { id: "sabado-noite", title: "Noite", limit: 2 },
    { id: "domingo-noite", title: "Noite", limit: 2 },
  ];

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = String(active.id);

    if (over) {
      const areaId = over.id;

      if (areaId === "trash-bin") {
        const sourceArea = active.data.current?.area;
        if (sourceArea) {
          setDroppedItems((prev) => ({
            ...prev,
            [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId),
          }));
        }
      } else if (
        active.data.current?.area &&
        active.data.current.area !== areaId &&
        droppedItems[areaId].length <
          areas.find((area) => area.id === areaId)?.limit!
      ) {
        const sourceArea = active.data.current.area;
        setDroppedItems((prev) => ({
          ...prev,
          [sourceArea]: prev[sourceArea].filter((item) => item.id !== itemId),
          [areaId]: [
            ...prev[areaId],
            { id: itemId, item: String(active.data.current?.item) },
          ],
        }));
      } else if (
        !active.data.current?.area &&
        droppedItems[areaId].length <
          areas.find((area) => area.id === areaId)?.limit!
      ) {
        setDroppedItems((prev) => ({
          ...prev,
          [areaId]: [...prev[areaId], { id: uuidv4(), item: itemId }],
        }));
      }
    }

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
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                    width: "150px",
                  }}
                >
                  Escalas
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Segunda
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Terça
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Quarta
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Quinta
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Sexta
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Sábado
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Domingo
                </th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => (
                <tr key={turno.id}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      // display: "flex",
                      // alignItems: "center",
                      // height: "10px", // Ajusta a altura mínima da célula do turno
                      borderLeft: `5px solid ${turno.color}`,
                      // borderRight: `5px solid ${turno.color}`,
                    }}
                  >
                    {turno.title}
                  </td>
                  {areas
                    .filter((area) => area.id.includes(turno.id)) // Filtra as áreas para o turno específico
                    .map((area) => (
                      <td key={area.id} style={{ border: "1px solid #ccc" }}>
                        <DroppableArea
                          id={area.id}
                          items={droppedItems[area.id] || []}
                          areaId={area.id}
                          limit={area.limit}
                          borderColor={turno.color}
                        />
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lixeira */}
        <TrashBin />

        {/* Overlay do item sendo arrastado */}
        <DragOverlay>{activeItem ? <div
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
        >{activeItem}</div> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
