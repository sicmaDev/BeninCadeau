"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AdminCustomerChartProps {
  firstTimeCount: number;
  returningCount: number;
}

export default function AdminCustomerChart({ firstTimeCount, returningCount }: AdminCustomerChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate percentages
  const total = firstTimeCount + returningCount;
  const firstTimePercent = total > 0 ? Math.round((firstTimeCount / total) * 100) : 0;
  const returningPercent = total > 0 ? Math.round((returningCount / total) * 100) : 0;

  const series = [firstTimePercent, returningPercent];

  if (!isMounted) {
    return <div style={{ minHeight: "200px" }}></div>;
  }

  const options: ApexOptions = {
    chart: {
      height: 280,
      type: "radialBar",
    },
    // Template Colors: green and dark orange
    colors: ["#5BE49B", "#E66239"],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          show: false,
        },
        hollow: {
          margin: 5,
          size: "50%",
          background: "transparent",
          position: "front",
        },
        track: {
          show: true,
          background: "#f3f4f6",
          strokeWidth: "100%",
          opacity: 1,
          margin: 6,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#007867", "#FFD666"],
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Nouveaux", "Fidèles"],
  };

  return (
    <div style={{ minHeight: "280px" }} className="d-flex align-items-center justify-content-center">
      <Chart options={options} series={series} type="radialBar" height={280} width="100%" />
    </div>
  );
}
