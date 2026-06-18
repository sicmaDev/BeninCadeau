"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CustomerChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const series = [44, 55];

  if (!isMounted) {
    return <div style={{ minHeight: "200px" }}></div>;
  }

  const options: ApexOptions = {
    chart: {
      height: 200,
      type: "radialBar",
    },
    colors: ["#5BE49B", "#E66239"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
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
    labels: ["First Time", "Return"],
  };

  return (
    <div style={{ minHeight: "200px" }}>
      <Chart options={options} series={series} type="radialBar" height={200} />
    </div>
  );
}
