import React from "react";
import SalesPurchaseChart from "@/components/charts/SalesPurchaseChart";
import CustomerChart from "@/components/charts/CustomerChart";

export default function DashboardPage() {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="mb-6">
            <h1 className="fs-3 mb-1">Dashboard</h1>
            <p>Your main content goes here…</p>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="row g-3 mb-3">
        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-primary text-white rounded-2">
                <i className="ti ti-report-analytics fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Total Sales</h2>
                <h3 className="fw-bold mb-0 text-dark">$25,000</h3>
                <p className="text-primary mb-0 small">+5% since last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-success text-white rounded-2">
                <i className="ti ti-repeat fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Total Purchase</h2>
                <h3 className="fw-bold mb-0 text-dark">$18,000</h3>
                <p className="text-success mb-0 small">+22% since last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-info bg-opacity-10 border border-info border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-info text-white rounded-2">
                <i className="ti ti-currency-dollar fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Total Expenses</h2>
                <h3 className="fw-bold mb-0 text-dark">$9,000</h3>
                <p className="text-info mb-0 small">+10% since last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-warning text-white rounded-2">
                <i className="ti ti-notes fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Invoice Due</h2>
                <h3 className="fw-bold mb-0 text-dark">$25,000</h3>
                <p className="text-warning mb-0 small">+35% since last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE COLUMN DETAILS */}
      <div className="row g-3 mb-3">
        <div className="col-lg-4 col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between border-bottom pb-5 mb-3">
                <div>
                  <h3 className="fw-bold h4 text-dark">$25,458</h3>
                  <span className="text-secondary">Total Profit</span>
                </div>
                <div>
                  <i className="ti ti-layers-subtract fs-1 text-primary"></i>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <div className="text-muted">
                  <span className="text-success">+35%</span> vs Last Month
                </div>
                <div>
                  <a href="#" className="link-primary text-decoration-underline">
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between border-bottom pb-5 mb-3">
                <div>
                  <h3 className="fw-bold h4 text-dark">$45,458</h3>
                  <span className="text-secondary">Total Payment Returns</span>
                </div>
                <div>
                  <i className="ti ti-credit-card fs-1 text-danger"></i>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <div className="text-muted">
                  <span className="text-danger">-20%</span> vs Last Month
                </div>
                <div>
                  <a href="#" className="link-primary text-decoration-underline">
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between border-bottom pb-5 mb-3">
                <div>
                  <h3 className="fw-bold h4 text-dark">$34,458</h3>
                  <span className="text-secondary">Total Expenses</span>
                </div>
                <div>
                  <i className="ti ti-cash-banknote fs-1 text-warning"></i>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <div className="text-muted">
                  <span className="text-warning">-20%</span> vs Last Month
                </div>
                <div>
                  <a href="#" className="link-primary text-decoration-underline">
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center bg-transparent px-4 py-3">
              <h3 className="h5 mb-0 text-dark">Sales vs Purchase</h3>
              <div>
                <select className="form-select form-select-sm" defaultValue="This Year">
                  <option value="This Year">This Year</option>
                  <option value="This Month">This Month</option>
                  <option value="This Week">This Week</option>
                </select>
              </div>
            </div>
            <div className="card-body p-4">
              <SalesPurchaseChart />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center bg-transparent px-4 py-3">
              <h3 className="h5 mb-0 text-dark">Overall Information</h3>
              <div>
                <select className="form-select form-select-sm" defaultValue="Last 6 Months">
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="This Month">This Month</option>
                  <option value="This Week">This Week</option>
                </select>
              </div>
            </div>
            <div className="card-body p-4">
              <h3 className="h6 text-dark">Customers Overview</h3>
              <div className="row align-items-center">
                <div className="col-sm-6">
                  <CustomerChart />
                </div>
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-6 border-end">
                      <div className="text-center">
                        <h2 className="mb-1 text-dark">5.5K</h2>
                        <p className="text-success mb-2 small">First Time</p>
                        <span className="badge bg-success">
                          <i className="ti ti-arrow-up-left me-1"></i>25%
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <h2 className="mb-1 text-dark">3.5K</h2>
                        <p className="text-warning mb-2 small">Return</p>
                        <span className="badge bg-success badge-xs d-inline-flex align-items-center">
                          <i className="ti ti-arrow-up-left me-1"></i>21%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row text-center border-top mt-4 pt-4">
                <div className="col-4 border-end">
                  <h3 className="fw-bold mb-2 text-dark">6987</h3>
                  <small className="text-secondary">Suppliers</small>
                </div>
                <div className="col-4 border-end">
                  <h3 className="fw-bold mb-2 text-dark">4896</h3>
                  <small className="text-secondary">Customers</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold mb-2 text-dark">487</h3>
                  <small className="text-secondary">Orders</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LISTS SECTION */}
      <div className="row g-3">
        {/* CARD 1 — Top Selling Products */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5 text-dark">Top Selling Products</h4>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ti ti-calendar"></i> Today
              </button>
            </div>

            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-2.png" className="rounded" width="48" alt="Product 2" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Wireless Earphones</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">$89</small>
                    <small>•</small>
                    <small>1,250 Units</small>
                  </div>
                </div>
                <span className="badge bg-danger-subtle text-danger border border-danger">18%</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-1.png" className="rounded" width="48" alt="Product 1" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Gaming Joy Stick</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">$49</small>
                    <small>•</small>
                    <small>5,420 Units</small>
                  </div>
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary">32%</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-3.png" className="rounded" width="48" alt="Product 3" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Smart Watch Pro</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">$98</small>
                    <small>•</small>
                    <small>862 Units</small>
                  </div>
                </div>
                <span className="badge bg-info-subtle text-info border border-info">22%</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-4.png" className="rounded" width="48" alt="Product 4" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">USB-C Fast Charger</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">$35</small>
                    <small>•</small>
                    <small>3,200 Units</small>
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success border border-success">28%</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-5.png" className="rounded" width="48" alt="Product 5" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Portable Bluetooth Speaker</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">$65</small>
                    <small>•</small>
                    <small>2,890 Units</small>
                  </div>
                </div>
                <span className="badge bg-warning-subtle text-warning border border-warning">25%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CARD 2 — Low Stock Products */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5 text-dark">Low Stock Products</h4>
              <a href="#" className="small text-primary text-decoration-underline">
                View All
              </a>
            </div>

            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-8.png" className="rounded" width="48" alt="Product 8" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Wireless Headphones</p>
                  <small className="text-secondary">ID: #554433</small>
                </div>
                <div className="d-flex flex-column gap-0 align-items-center">
                  <span className="fw-semibold text-primary">06</span>
                  <small className="text-muted">In Stock</small>
                </div>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-4.png" className="rounded" width="48" alt="Product 4" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">USB-C Cable Pack</p>
                  <small className="text-secondary">ID: #887766</small>
                </div>
                <div className="d-flex flex-column gap-0 align-items-center">
                  <span className="fw-semibold text-primary">09</span>
                  <small className="text-muted">In Stock</small>
                </div>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-10.png" className="rounded" width="48" alt="Product 10" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Phone Screen Protector</p>
                  <small className="text-secondary">ID: #332211</small>
                </div>
                <div className="d-flex flex-column gap-0 align-items-center">
                  <span className="fw-semibold text-primary">03</span>
                  <small className="text-muted">In Stock</small>
                </div>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-4.png" className="rounded" width="48" alt="Product 4" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Portable Charger 20000mAh</p>
                  <small className="text-secondary">ID: #998877</small>
                </div>
                <div className="d-flex flex-column gap-0 align-items-center">
                  <span className="fw-semibold text-primary">07</span>
                  <small className="text-muted">In Stock</small>
                </div>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-6.png" className="rounded" width="48" alt="Product 6" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Mechanical Keyboard RGB</p>
                  <small className="text-secondary">ID: #665544</small>
                </div>
                <div className="d-flex flex-column gap-0 align-items-center">
                  <span className="fw-semibold text-primary">02</span>
                  <small className="text-muted">In Stock</small>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* CARD 3 — Recent Sales */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5 text-dark">Recent Sales</h4>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ti ti-calendar-event"></i> Weekly
              </button>
            </div>

            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-7.png" className="rounded" width="48" alt="Product 7" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">MacBook Pro 16"</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">Computers</small>
                    <small>•</small>
                    <small>$2,499</small>
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success">Completed</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-9.png" className="rounded" width="48" alt="Product 9" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">AirPods Pro Max</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">Audio</small>
                    <small>•</small>
                    <small>$549</small>
                  </div>
                </div>
                <span className="badge bg-primary-subtle text-primary">Processing</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-8.png" className="rounded" width="48" alt="Product 8" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">iPad Air 11"</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">Tablets</small>
                    <small>•</small>
                    <small>$799</small>
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success">Completed</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-3.png" className="rounded" width="48" alt="Product 3" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Apple Watch Ultra</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">Wearables</small>
                    <small>•</small>
                    <small>$799</small>
                  </div>
                </div>
                <span className="badge bg-warning-subtle text-warning">Pending</span>
              </li>

              <li className="list-group-item d-flex align-items-center gap-3">
                <img src="/assets/images/product-6.png" className="rounded" width="48" alt="Product 6" />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark">Magic Keyboard</p>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <small className="fw-semibold text-secondary">Accessories</small>
                    <small>•</small>
                    <small>$299</small>
                  </div>
                </div>
                <span className="badge bg-danger-subtle text-danger">Cancelled</span>
              </li>
            </ul>
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
