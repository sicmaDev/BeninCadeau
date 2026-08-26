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

interface AdminStatusCountChartProps {
  statusBreakdown: StatusBreakdownItem[];
}

export default function AdminStatusCountChart({ statusBreakdown }: AdminStatusCountChartProps) {
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

  // Filter out statuses with 0 counts for better visual presentation, or keep all
  const activeStatuses = statuses.filter((s) => {
    const item = statusBreakdown.find((x) => x.status === s);
    return item ? item.count > 0 : false;
  });

  const displayStatuses = activeStatuses.length > 0 ? activeStatuses : ["EN_ATTENTE"];

  const counts = displayStatuses.map((statusKey) => {
    const item = statusBreakdown.find((s) => s.status === statusKey);
    return item ? item.count : 0;
  });

  const series = counts;

  const options: ApexOptions = {
    colors: displayStatuses.map((statusKey) => colorsMap[statusKey] || "#1A2B6D"),
    labels: displayStatuses.map((statusKey) => labelsMap[statusKey]),
    chart: {
      type: "donut",
      height: 240,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Poppins, serif",
      fontSize: "12px",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  if (!isMounted) {
    return <div style={{ minHeight: "240px" }}></div>;
  }

  return (
    <div style={{ minHeight: "240px", display: "flex", justifyContent: "center" }}>
      <Chart options={options} series={series} type="donut" height={240} width={280} />
    </div>
  );
}
