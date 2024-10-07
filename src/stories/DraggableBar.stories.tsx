import { Meta, StoryObj } from "@storybook/react";
import { DraggableBar } from "@/components/Calendario/Draggable/DraggableBar";
import { expect, userEvent, within } from "@storybook/test";
import { DndContext, DragOverlay } from "@dnd-kit/core"; // Importando o DndContext
import { useState } from "react";
import { Box, Button } from "@mui/material";

// Define os metadados da story
const meta = {
  title: "Example/DraggableBar", // O título determina o caminho no Storybook
  component: DraggableBar,
  parameters: {
    layout: "fullscreen", // Layout de tela cheia para facilitar a visualização
  },
  argTypes: {
    direction: {
      control: { type: "select" },
      options: ["row", "column"],
    },
  },
} as Meta<typeof DraggableBar>;

export default meta;

type Story = StoryObj<typeof meta>;

// Template da história
export const DraggableBarStory: Story = {
  args: {
    id: "elements-sidebar",
    itens: [
      { id: 1, nome: "Raifran Silva" },
      { id: 2, nome: "Luis Marques" },
      { id: 3, nome: "Paula Souza" },
      { id: 4, nome: "Rafaela Silva" },
    ],
    direction: "row",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Testar múltiplos botões de colaboradores
    const collaborators = [
      "Raifran Silva",
      "Luis Marques",
      "Paula Souza",
      "Rafaela Silva",
    ];

    for (const collaborator of collaborators) {
      const draggableBarButton = canvas.getByRole("button", {
        name: new RegExp(collaborator, "i"),
      });
      await expect(draggableBarButton).toBeInTheDocument();
      await userEvent.click(draggableBarButton);
      // Adapte o que acontece após o clique conforme necessário
    }
  },
  render: (args) => {
    // Estado para armazenar o item ativo sendo arrastado
    const [activeItem, setActiveItem] = useState<{
      id: number;
      nome: string;
    } | null>(null);

    // Funções para lidar com o início e o fim do arraste
    const handleDragStart = (event: { active: { id: any } }) => {
      const itemId = event.active.id;
      const item = args.itens.find((item) => item.id === parseInt(itemId));
      if (item) {
        setActiveItem(item);
      } else {
        setActiveItem(null);
      }
    };

    const handleDragEnd = () => {
      setActiveItem(null); // Limpa o item ativo quando o arraste termina
    };

    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DraggableBar
          id={args.id}
          itens={args.itens}
          direction={args.direction} // Usar diretamente args.direction
        />
        <DragOverlay>
          {activeItem ? (
            <Box
              sx={{
                position: "fixed",
                pointerEvents: "none",
                zIndex: 9999,
                padding: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Mostrar o nome do item ativo */}
              {activeItem?.nome}
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  },
};
