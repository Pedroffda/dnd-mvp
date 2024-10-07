import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Box, Card } from "@mui/material";
import { DraggableBar } from "./Calendar/Draggable/DraggableBar";
import DateDisplay from "./DateDisplay";
import ShiftsTable from "./ShiftsTable";
import { styles } from "./styles";

interface CalendarLayoutProps {
  dataAtual: Date;
  irParaProximaSemana: () => void;
  voltarSemana: () => void;
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
}

const CalendarLayout = ({
  dataAtual,
  irParaProximaSemana,
  voltarSemana,
  headers,
  diasDaSemana,
  turnos,
  areas,
  droppedItems,
  onDragStart,
  onDragEnd,
  activeItem,
}: Readonly<CalendarLayoutProps>) => {
  return (
    <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {/* Draggable Sidebar */}
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

      {/* Date Display and Shifts Table */}
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
        />

        <ShiftsTable
          headers={headers}
          diasDaSemana={diasDaSemana.map((date) => new Date(date))}
          turnos={turnos.map((turno) => ({
            id: turno.id,
            title: turno.title,
            inicio: turno.inicio,
            fim: turno.fim,
            color: turno.color,
          }))}
          areas={areas}
          droppedItems={droppedItems}
        />
      </Box>

      {/* Overlay for Active Item */}
      <DragOverlay>
        {activeItem ? (
          <Box sx={styles.overlayBox}>{activeItem.item}</Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CalendarLayout;
