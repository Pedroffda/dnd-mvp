import React from "react";
import { Typography, Button, Grid2 } from "@mui/material";

interface DateDisplayProps {
  mensal?: boolean;
  dataAtual: Date;
  irParaProximaSemana: () => void;
  voltarSemana: () => void;
  irParaProximoMes?: () => void;
  voltarMes?: () => void;
}

export default function DateDisplay({
  mensal = false,
  dataAtual,
  irParaProximaSemana,
  voltarSemana,
  irParaProximoMes,
  voltarMes,
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
    return formatadorMes.format(date);
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
        onClick={mensal ? voltarMes : voltarSemana}
        disabled={!voltarSemana && !voltarMes}
        sx={{
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {"<"}
      </Button>
      <Typography variant="h6">
        {mensal ? `${formatarMes(dataAtual)}` : `${formatarSemana(dataAtual)}`}
      </Typography>
      <Button
        variant="text"
        onClick={mensal ? irParaProximoMes : irParaProximaSemana}
        disabled={!irParaProximaSemana && !irParaProximoMes}
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
