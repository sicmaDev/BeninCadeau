"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AdminSalesChartProps {
  thisYear: number[];
  lastYear: number[];
}

export default function AdminSalesChart({ thisYear, lastYear }: AdminSalesChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatCurrency = (value: number) => {
    if (value == null) return "-";
    return value.toLocaleString("fr-FR") + " FCFA";
  };

  const series = [
    { name: "Année en cours", data: thisYear },
    { name: "Année précédente", data: lastYear },
  ];

  const options: ApexOptions = {
    chart: {
      id: "sales-overview",
      type: "area",
      height: 420,
      zoom: { enabled: false },
      toolbar: {
        show: false,
      },
    },
    colors: ["#1A2B6D", "#F5A623"],
    stroke: { width: [3, 2.5], curve: "smooth" },
    markers: { size: 4, hover: { sizeOffset: 2 } },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 60, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val >= 1000 ? (val / 1000).toLocaleString("fr-FR") + "k FCFA" : val + " FCFA";
        },
      },
      title: { text: "Ventes (FCFA)" },
    },
    xaxis: {
      categories: months,
      tickPlacement: "on",
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function (val) {
          return formatCurrency(val);
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 340 },
          legend: { position: "bottom", horizontalAlign: "center" },
        },
      },
    ],
  };

  if (!isMounted) {
    return <div style={{ minHeight: "420px", width: "100%" }}></div>;
  }

  return (
    <div style={{ minHeight: "420px", width: "100%" }}>
      <Chart options={options} series={series} type="area" height={420} />
    </div>
  );
}
