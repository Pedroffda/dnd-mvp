import React from "react";
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
  modo: "diario" | "semanal" | "mensal";
  dataAtual: Date;
}

const ShiftsTable = ({
  headers,
  diasDaSemana,
  turnos,
  areas,
  droppedItems,
  modo,
  dataAtual,
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
  const semanas =
    modo === "mensal" ? agruparSemanas(diasDaSemana) : [diasDaSemana];

  return (
    <Table>
      {/* Renderização do cabeçalho dos dias da semana */}
      <TableHead>
        <TableRow>
          <TableCell
            key="turno"
            sx={{
              ...styles.headerTableCell,
              border: "none",
              backgroundColor: "transparent",
            }}
          ></TableCell>
          {semanas[0].map((date) => {
            const dayName = date.toLocaleDateString("pt-BR", {
              weekday: "long",
            });
            return (
              <TableCell key={date.toISOString()} sx={styles.headerTableCell}>
                {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      {semanas.map((semana, indexSemana) => (
        <React.Fragment key={indexSemana}>
          <TableHead>
            <TableRow>
              <TableCell key="turno" sx={styles.headerTableCell}></TableCell>
              {semana.map((date) => {
                // Determinar se o dia pertence ao mês atual apenas no modo mensal
                const isCurrentMonth =
                  modo === "mensal"
                    ? date.getMonth() === dataAtual.getMonth()
                    : true;
                return (
                  <TableCell
                    key={date.toISOString().split("T")[0]}
                    sx={{
                      ...styles.headerTableCell,
                      backgroundColor: isCurrentMonth ? "inherit" : "#f0f0f0",
                      color: isCurrentMonth ? "inherit" : "#aaa",
                    }}
                  >
                    {date.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "numeric",
                    })}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.map((turno) => (
              <TableRow key={`${turno.id}-semana-${indexSemana}`}>
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
                  const areaId = `${turno.id}-${date
                    .toISOString()
                    .split("T")[0]}`;
                  const area = areas.find((area) => area.id === areaId);
                  const isAvailable = area !== undefined;
                  // Determinar se o dia pertence ao mês atual apenas no modo mensal
                  const isCurrentMonth =
                    modo === "mensal"
                      ? date.getMonth() === dataAtual.getMonth()
                      : true;
                  // Determinar se a célula deve ser interativa
                  const isSelectable = isAvailable && isCurrentMonth;
                  return (
                    <TableCell
                      key={areaId}
                      sx={{
                        ...styles.areaTableCell,
                        backgroundColor: isAvailable
                          ? isCurrentMonth
                            ? "inherit"
                            : "#f0f0f0" // Cor para dias de outros meses
                          : "#f5f5f5",
                        pointerEvents: isSelectable ? "auto" : "none", // Desabilita interação se não for selecionável
                        opacity: isSelectable ? 1 : 0.5, // Reduz opacidade para dias não selecionáveis
                      }}
                    >
                      {isAvailable && isCurrentMonth ? (
                        <DroppableArea
                          id={area.id}
                          items={droppedItems[area.id] || []}
                          areaId={area.id}
                          limit={area.limit}
                          borderColor={turno.color}
                        />
                      ) : (
                        <Box sx={styles.indisponivelBox}>
                          {isCurrentMonth ? "Indisponível" : ""}
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </React.Fragment>
      ))}
    </Table>
  );
};

export default ShiftsTable;
