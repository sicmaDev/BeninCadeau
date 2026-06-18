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
      height: 200,
      type: "radialBar",
    },
    // Template Colors: green and dark orange
    colors: ["#5BE49B", "#E66239"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
            fontFamily: "Poppins, sans-serif",
          },
          value: {
            fontSize: "16px",
            fontFamily: "Poppins, sans-serif",
          },
          total: {
            show: false,
          },
        },
        hollow: {
          margin: 3,
          size: "40%",
          background: "transparent",
          position: "front",
        },
        track: {
          show: true,
          background: "#f0f0f0",
          strokeWidth: "45%",
          opacity: 1,
          margin: 5,
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
    <div style={{ minHeight: "200px" }}>
      <Chart options={options} series={series} type="radialBar" height={200} />
    </div>
  );
}
