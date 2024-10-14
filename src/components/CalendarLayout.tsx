import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { Box, Card } from "@mui/material";
import { DraggableBar } from "./Calendar/Draggable/DraggableBar";
import DateDisplay from "./DateDisplay";
import ShiftsTable from "./ShiftsTable";
import { styles } from "./styles";

interface CalendarLayoutProps {
  dataAtual: Date;
  irParaProximaSemana: () => void;
  irParaProximoMes: () => void;
  voltarSemana: () => void;
  voltarMes: () => void;
  headers: { id: string; title: string }[];
  diasDaSemana: Date[];
  turnos: {
    id: string;
    title: string;
    inicio: string;
    fim: string;
    color: string;
  }[];
  areas: { id: string; limit: number }[];
  droppedItems: { [key: string]: { id: string; item: string; uId: string }[] };
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  activeItem: { id: string; item: string; uId: string };
  modoMes: boolean; // Adicione a prop para alternar entre mês e semana
}

const CalendarLayout = ({
  dataAtual,
  irParaProximaSemana,
  irParaProximoMes,
  voltarSemana,
  voltarMes,
  headers,
  diasDaSemana,
  turnos,
  areas,
  droppedItems,
  onDragStart,
  onDragEnd,
  activeItem,
  modoMes,
}: Readonly<CalendarLayoutProps>) => {
  return (
    <DndContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      collisionDetection={closestCenter}
    >
      <Card
        sx={{
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <DraggableBar
          id="elements-sidebar"
          itens={[
            { id: 1, nome: "Raifran Silva" },
            { id: 2, nome: "Luis Marques" },
            { id: 3, nome: "Paula Souza" },
            { id: 4, nome: "Rafaela Silva" },
          ]}
        />
      </Card>

      <Box
        sx={{
          flexGrow: 1,
          mt: 2,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          borderRadius: "5px",
          paddingBottom: 2,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <DateDisplay
          dataAtual={dataAtual}
          irParaProximaSemana={irParaProximaSemana}
          voltarSemana={voltarSemana}
          irParaProximoMes={irParaProximoMes}
          voltarMes={voltarMes}
          mensal={modoMes} // Adicione a prop para alternar entre mês e semana
        />

        <ShiftsTable
          headers={headers}
          diasDaSemana={diasDaSemana}
          turnos={turnos}
          areas={areas}
          droppedItems={droppedItems}
          modoMes={modoMes} // Alterna o modo mês
        />
      </Box>

      <DragOverlay>
        {activeItem ? (
          <Box sx={styles.overlayBox}>{activeItem.item}</Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CalendarLayout;
