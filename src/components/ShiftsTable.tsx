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
}

const ShiftsTable = ({
  headers,
  diasDaSemana,
  turnos,
  areas,
  droppedItems,
}: Readonly<ShiftsTableProps>) => {
  return (
    <Table role="grid" aria-label="Calendar">
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
            {diasDaSemana.map((date) => {
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
  );
};

export default ShiftsTable;
