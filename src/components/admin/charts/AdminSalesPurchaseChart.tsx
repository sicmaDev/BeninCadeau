"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AdminSalesPurchaseChartProps {
  thisYear: number[];
  lastYear: number[];
}

export default function AdminSalesPurchaseChart({ thisYear, lastYear }: AdminSalesPurchaseChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  let categories = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  let prevLabel = "Année précédente";
  let currLabel = "Année en cours";

  if (thisYear.length === 7) {
    categories = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    prevLabel = "Semaine précédente";
    currLabel = "Semaine en cours";
  } else if (thisYear.length > 12) {
    categories = Array.from({ length: thisYear.length }, (_, i) => (i + 1).toString());
    prevLabel = "Mois précédent";
    currLabel = "Mois en cours";
  }

  const series = [
    {
      name: prevLabel,
      data: lastYear,
    },
    {
      name: currLabel,
      data: thisYear,
    },
  ];

  if (!isMounted) {
    return <div style={{ minHeight: "350px", width: "100%" }}></div>;
  }

  const options: ApexOptions = {
    // Light orange, Dark orange to match the template colors
    colors: ["#f7a085", "#E66239"],
    chart: {
      type: "bar",
      height: 350,
      width: "100%",
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      borderColor: "#e2e8f0",
    },
    legend: {
      show: true,
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        size: 5,
        shape: "square",
        strokeWidth: 0,
        offsetX: -2,
        offsetY: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "85%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
        color: "#e2e8f0",
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "12px",
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "12px",
          colors: "#64748b",
        },
        formatter: function (val) {
          return val >= 1000 ? (val / 1000).toLocaleString("fr-FR") + "k" : val.toLocaleString("fr-FR");
        },
      },
      title: {
        text: "Ventes (FCFA)",
        style: {
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString("fr-FR") + " FCFA";
        },
      },
    },
  };

  return (
    <div style={{ minHeight: "350px", width: "100%" }}>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
