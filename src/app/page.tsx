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
    // Adicione mais turnos se necessário
  });

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const areas = [
    { id: "segunda-manha", title: "Segunda Manhã", limit: 3 }, // Define 3 vagas, por exemplo
    { id: "segunda-tarde", title: "Segunda Tarde", limit: 2 },
    { id: "terca-manha", title: "Terça Manhã", limit: 3 },
    { id: "terca-tarde", title: "Terça Tarde", limit: 2 },
    { id: "quarta-manha", title: "Quarta Manhã", limit: 3 },
    { id: "quarta-tarde", title: "Quarta Tarde", limit: 2 },
    { id: "quinta-manha", title: "Quinta Manhã", limit: 3 },
    { id: "quinta-tarde", title: "Quinta Tarde", limit: 2 },
    { id: "sexta-manha", title: "Sexta Manhã", limit: 3 },
    { id: "sexta-tarde", title: "Sexta Tarde", limit: 2 },
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
                  }}
                >
                  Horário
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  Manhã (07:00 - 13:00)
                </td>
                {areas.slice(0, 5).map((area) => (
                  <td
                    key={area.id}
                    style={{ border: "1px solid #ccc", padding: "10px" }}
                  >
                    <DroppableArea
                      id={area.id}
                      items={droppedItems[area.id] || []}
                      areaId={area.id}
                      limit={area.limit} // Agora passando o limite de vagas
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  Tarde (13:00 - 19:00)
                </td>
                {areas.slice(5, 10).map((area) => (
                  <td
                    key={area.id}
                    style={{ border: "1px solid #ccc", padding: "10px" }}
                  >
                    <DroppableArea
                      id={area.id}
                      items={droppedItems[area.id] || []}
                      areaId={area.id}
                      limit={area.limit} // Agora passando o limite de vagas
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Lixeira */}
        <TrashBin />

        {/* Overlay do item sendo arrastado */}
        <DragOverlay>{activeItem ? <div>{activeItem}</div> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
