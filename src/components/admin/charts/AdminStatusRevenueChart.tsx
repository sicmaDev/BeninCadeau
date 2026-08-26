"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatusBreakdownItem {
  status: string;
  count: number;
  revenue: number;
}

interface AdminStatusRevenueChartProps {
  statusBreakdown: StatusBreakdownItem[];
}

export default function AdminStatusRevenueChart({ statusBreakdown }: AdminStatusRevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const statuses = ["EN_ATTENTE", "PAYEE", "EN_PREPARATION", "EXPEDIEE", "LIVREE", "ANNULEE"];
  const labelsMap: Record<string, string> = {
    EN_ATTENTE: "En attente",
    PAYEE: "Payée",
    EN_PREPARATION: "En prép.",
    EXPEDIEE: "Expédiée",
    LIVREE: "Livrée",
    ANNULEE: "Annulée",
  };

  const colorsMap: Record<string, string> = {
    EN_ATTENTE: "#F0B100", // Yellow
    PAYEE: "#00B8DB",      // Blue/Cyan
    EN_PREPARATION: "#A855F7", // Purple
    EXPEDIEE: "#3B82F6",   // Blue
    LIVREE: "#00C951",     // Green
    ANNULEE: "#FB2C36",    // Red
  };

  // Extract revenues in order
  const revenues = statuses.map((statusKey) => {
    const item = statusBreakdown.find((s) => s.status === statusKey);
    return item ? item.revenue : 0;
  });

  const series = [
    {
      name: "Chiffre d'affaires",
      data: revenues,
    },
  ];

  const options: ApexOptions = {
    colors: [
      function ({ dataPointIndex }: { dataPointIndex: number }) {
        const statusKey = statuses[dataPointIndex];
        return colorsMap[statusKey] || "#1A2B6D";
      },
    ],
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: statuses.map((statusKey) => labelsMap[statusKey]),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val >= 1000 ? (val / 1000).toLocaleString("fr-FR") + "k FCFA" : val + " FCFA";
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString("fr-FR") + " FCFA";
        },
      },
    },
  };

  if (!isMounted) {
    return <div style={{ minHeight: "350px", width: "100%" }}></div>;
  }

  return (
    <div style={{ minHeight: "350px", width: "100%" }}>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
