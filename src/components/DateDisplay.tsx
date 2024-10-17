import React from "react";
import { Typography, Button, Grid2 } from "@mui/material";

interface DateDisplayProps {
  modo?: "diario" | "semanal" | "mensal";
  dataAtual: Date;
  irParaProximaSemana: () => void;
  voltarSemana: () => void;
  irParaProximoMes?: () => void;
  voltarMes?: () => void;
  irParaProximoDia?: () => void;
  voltarDia?: () => void;
}

export default function DateDisplay({
  modo = "semanal",
  dataAtual,
  irParaProximaSemana,
  voltarSemana,
  irParaProximoMes,
  voltarMes,
  irParaProximoDia,
  voltarDia,
}: Readonly<DateDisplayProps>) {
  const getInicioSemana = (date: Date) => {
    const inicio = new Date(date);
    const dia = inicio.getDay();
    const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1);
    inicio.setDate(diff);
    return inicio;
  };

  const getFimSemana = (inicioSemana: Date) => {
    const fim = new Date(inicioSemana);
    fim.setDate(fim.getDate() + 6);
    return fim;
  };

  const formatarSemana = (date: Date) => {
    const inicioSemana = getInicioSemana(date);
    const fimSemana = getFimSemana(inicioSemana);

    const formatadorData1 = new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
    });

    const formatadorData = new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formatarMes = (dataFormatada: string) => {
      return dataFormatada.replace(
        /(\d+\s+de\s+)([a-záéíóúàèìòùâêîôûãõç]+)/i,
        (match, diaEDe, mes) => `${diaEDe}${mes.slice(0, 3).toUpperCase()}`
      );
    };

    const inicioFormatado = formatarMes(formatadorData1.format(inicioSemana));
    const fimFormatado = formatarMes(formatadorData.format(fimSemana));

    return `${inicioFormatado} a ${fimFormatado}`;
  };

  const formatarMes = (date: Date) => {
    const formatadorMes = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    });
    // so a primeira letra do mes em maiusculo    
    return formatadorMes.format(date).replace(/^\w/, (c) => c.toUpperCase());
  };

  const formatarDia = (date: Date) => {
    const formatadorDia = new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatadorDia.format(date);
  };

  return (
    <Grid2
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="text"
        onClick={modo === "diario" ? voltarDia : modo === "semanal" ? voltarSemana : voltarMes}
        disabled={!voltarSemana && !voltarMes && !voltarDia}
        sx={{
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {"<"}
      </Button>
      <Typography variant="h6">
        {/* {modo === "diario" ? `${formatarSemana(dataAtual)}` : `${formatarMes(dataAtual)}`} */}
        {(() => {
          if (modo === "diario") {
            return `${formatarDia(dataAtual)}`;
          } else if (modo === "semanal") {
            return `${formatarSemana(dataAtual)}`;
          } else {
            return `${formatarMes(dataAtual)}`;
          }
        })()}
      </Typography>
      <Button
        variant="text"
        onClick={modo === "diario" ? irParaProximoDia : modo === "semanal" ? irParaProximaSemana : irParaProximoMes}
        disabled={!irParaProximaSemana && !irParaProximoMes && !irParaProximoDia}
        sx={{
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {">"}
      </Button>
    </Grid2>
  );
}
