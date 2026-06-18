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

  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

  // Re-scale values to thousands/millions to match formatting if needed, but formatter will handle it
  const series = [
    {
      name: "Année précédente",
      data: lastYear,
    },
    {
      name: "Année en cours",
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
      position: "top",
      horizontalAlign: "right",
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
        columnWidth: "70%",
        borderRadius: 3,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: months,
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
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Poppins, sans-serif",
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
