import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { DroppableArea } from "./Calendar/Droppable/DroppableArea";
import { styles } from "./styles";

interface ShiftsTableProps {
  headers: Array<{ id: string; title: string }>;
  diasDaSemana: Date[];
  turnos: Array<{
    id: string;
    title: string;
    inicio: string;
    fim: string;
    color: string;
  }>;
  areas: Array<{ id: string; limit: number }>;
  droppedItems: { [key: string]: { id: string; item: string; uId: string }[] };
  modoMes: boolean; // Adicionando a propriedade modoMes
}


const ShiftsTable = ({
  headers,
  diasDaSemana,
  turnos,
  areas,
  droppedItems,
  modoMes,
}: Readonly<ShiftsTableProps>) => {
  // Função para agrupar as datas em semanas
  const agruparSemanas = (datas: Date[]) => {
    const semanas: Date[][] = [];
    let semanaAtual: Date[] = [];

    datas.forEach((data, index) => {
      semanaAtual.push(data);
      if (data.getDay() === 0 || index === datas.length - 1) {
        // Domingo (0) ou último dia
        semanas.push(semanaAtual);
        semanaAtual = [];
      }
    });

    return semanas;
  };

  // Agrupamos as datas em semanas se estamos no modo mensal
  const semanas = modoMes ? agruparSemanas(diasDaSemana) : [diasDaSemana];

    // Nomes dos dias da semana
    const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <>
      {/* Renderização da tabela de turnos e áreas */}
      {semanas.map((semana, index) => (
        <Table key={index} role="grid" aria-label={`Semana ${index + 1}`}>
          <TableHead>
            <TableRow>
              
              <TableCell key="turno" sx={styles.headerTableCell}></TableCell>
              {semana.map((date) => (
                <TableCell
                  key={date.toISOString().split("T")[0]}
                  sx={styles.headerTableCell}
                >
                  {date.toLocaleDateString("pt-BR", {
                    // weekday: "short",
                    day: "numeric",
                    month: "numeric",
                  })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.map((turno) => (
              <TableRow key={turno.id}>
                {/* Renderização da célula do turno */}
                <TableCell
                  sx={{
                    ...styles.turnoTableCell,
                    position: "relative",
                    "&:before": {
                      backgroundColor: turno.color,
                      content: '""',
                      height: "100%",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      width: "5px",
                    },
                  }}
                >
                  {turno.title}
                  <Box sx={styles.timeTableCell}>
                    {`${turno.inicio} - ${turno.fim}`}
                  </Box>
                </TableCell>
                {/* Renderização das células dos dias */}
                {semana.map((date) => {
                  const areaId = `${turno.id}-${date.toISOString().split("T")[0]}`;
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
                        <Box sx={styles.indisponivelBox}>Indisponível</Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
      {/* <pre>{JSON.stringify(droppedItems, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(areas, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(semanas, null, 2)}</pre> */}
    </>
  );
};

export default ShiftsTable;