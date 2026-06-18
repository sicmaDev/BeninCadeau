"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SalesPurchaseChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const series = [
    {
      name: "Sales",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Purchase",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
  ];

  if (!isMounted) {
    return <div style={{ minHeight: "350px", width: "100%" }}></div>;
  }

  const options: ApexOptions = {
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
      fontFamily: "Poppins, serif",
      fontWeight: 500,
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
        borderRadius: 3,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["28 Jan", "29 Jan", "30 Jan", "31 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb"],
      axisBorder: {
        show: false,
        color: "#e2e8f0",
        height: 1,
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: false,
        color: "#e2e8f0",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      labels: {
        formatter: function (e) {
          return e + "k";
        },
      },
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
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
