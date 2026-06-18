"use client";

import React, { useState } from "react";
import SalesChart from "@/components/charts/SalesChart";

export default function ReportsPage() {
  const [salesThisYear, setSalesThisYear] = useState([
    42000, 53000, 48000, 61000, 72000, 69000, 74000, 82000, 78000, 86000, 91000, 97000,
  ]);
  const [salesLastYear, setSalesLastYear] = useState([
    38000, 45000, 47000, 56000, 65000, 63000, 68000, 70000, 69000, 75000, 80000, 84000,
  ]);
  const [showComparison, setShowComparison] = useState(true);

  const randomizeData = () => {
    const rand = () => Math.round((Math.random() * 80 + 20) * 1000);
    setSalesThisYear(Array.from({ length: 12 }, rand));
    setSalesLastYear(Array.from({ length: 12 }, rand));
  };

  const chartSeries = showComparison
    ? [
        { name: "This Year", data: salesThisYear },
        { name: "Last Year", data: salesLastYear },
      ]
    : [{ name: "This Year", data: salesThisYear }];

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fs-3 mb-1 text-dark">Reports</h1>
              <p className="mb-0 text-secondary">View your inventory analytics and reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card h-100">
            <div className="card-body p-4">
              <h6 className="mb-4 text-secondary">Total Revenue</h6>
              <h3 className="mb-1 fw-bold text-dark">$45,231</h3>
              <p className="mb-0 text-success small">
                <i className="ti ti-arrow-up"></i> 12% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card h-100">
            <div className="card-body p-4">
              <h6 className="mb-4 text-secondary">Products Sold</h6>
              <h3 className="mb-1 fw-bold text-dark">1,234</h3>
              <p className="mb-0 text-success small">
                <i className="ti ti-arrow-up"></i> 8% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card h-100">
            <div className="card-body p-4">
              <h6 className="mb-4 text-secondary">Low Stock Items</h6>
              <h3 className="mb-1 fw-bold text-dark">23</h3>
              <p className="mb-0 text-danger small">
                <i className="ti ti-arrow-down"></i> 3% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card h-100">
            <div className="card-body p-4">
              <h6 className="mb-4 text-secondary">Out of Stock</h6>
              <h3 className="mb-1 fw-bold text-dark">5</h3>
              <p className="mb-0 text-danger small">
                <i className="ti ti-arrow-down"></i> 2% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SALES OVERVIEW (CHART) */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-2">
                <div>
                  <h2 className="mb-0 fs-5 text-dark">Sales Overview</h2>
                </div>
                <div className="controls d-flex gap-2">
                  <button className="btn btn-light btn-sm" onClick={randomizeData}>
                    Randomize Data
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    {showComparison ? "Show This Year Only" : "Show Comparison"}
                  </button>
                </div>
              </div>

              <SalesChart series={chartSeries} />

              <div className="d-flex justify-content-end mt-2">
                <a href="#" className="small text-primary text-decoration-none">
                  View detailed report
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="mb-0 fs-5 text-dark">Top Products</h2>
                </div>
              </div>

              <div className="list-group list-group-flush">
                <div className="list-group-item p-3 d-flex align-items-center">
                  <div className="me-3">
                    <img
                      src="/assets/images/product-1.png"
                      alt="Product A"
                      className="rounded"
                      style={{ width: "48px", height: "48px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0 text-dark">Gaming Joy Stick</h6>
                        <small className="text-secondary">156 units sold</small>
                      </div>
                      <div className="text-end text-dark font-weight-bold">
                        <strong>$3,120</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="list-group-item p-3 d-flex align-items-center">
                  <div className="me-3">
                    <img
                      src="/assets/images/product-2.png"
                      alt="Product B"
                      className="rounded"
                      style={{ width: "48px", height: "48px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0 text-dark">Wireless Headphones</h6>
                        <small className="text-secondary">134 units sold</small>
                      </div>
                      <div className="text-end text-dark font-weight-bold">
                        <strong>$2,680</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="list-group-item p-3 d-flex align-items-center">
                  <div className="me-3">
                    <img
                      src="/assets/images/product-3.png"
                      alt="Product C"
                      className="rounded"
                      style={{ width: "48px", height: "48px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0 text-dark">Smartwatch</h6>
                        <small className="text-secondary">98 units sold</small>
                      </div>
                      <div className="text-end text-dark font-weight-bold">
                        <strong>$1,960</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <footer className="text-center py-2 mt-6 text-secondary">
            <p className="mb-0">
              Copyright © 2026 InApp Inventory Dashboard. Developed by{" "}
              <a href="https://codescandy.com/" target="_blank" className="text-primary text-decoration-none">
                CodesCandy
              </a>{" "}
              • Distributed by{" "}
              <a href="https://themewagon.com/" target="_blank" className="text-primary text-decoration-none">
                ThemeWagon
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
