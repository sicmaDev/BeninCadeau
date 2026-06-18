import React from "react";
import Link from "next/link";

export default function InventoryPage() {
  const products = [
    { id: "PRD001", name: "Gaming Joy Stick", category: "Electronics", brand: "Brand Name", price: "$99.99", unit: "pcs", stock: 150, image: "/assets/images/product-1.png" },
    { id: "PRD002", name: "Wireless Earphones", category: "Electronics", brand: "Tech Pro", price: "$89.99", unit: "pcs", stock: 320, image: "/assets/images/product-2.png" },
    { id: "PRD003", name: "Smart Watch Pro", category: "Electronics", brand: "Tech Pro", price: "$98.00", unit: "pcs", stock: 200, image: "/assets/images/product-3.png" },
    { id: "PRD004", name: "USB-C Fast Charger", category: "Electronics", brand: "Tech Pro", price: "$86.00", unit: "pcs", stock: 80, image: "/assets/images/product-4.png" },
    { id: "PRD005", name: "Portable Bluetooth Speaker", category: "Electronics", brand: "Tech Pro", price: "$32.00", unit: "pcs", stock: 110, image: "/assets/images/product-5.png" },
    { id: "PRD006", name: "Magic Keyboard", category: "Electronics", brand: "Tech Pro", price: "$49.00", unit: "pcs", stock: 10, image: "/assets/images/product-6.png" },
    { id: "PRD007", name: "MacBook Pro 16\"", category: "Electronics", brand: "Tech Pro", price: "$99.00", unit: "pcs", stock: 10, image: "/assets/images/product-7.png" },
    { id: "PRD008", name: "Wireless Earphones", category: "Electronics", brand: "Tech Pro", price: "$109.00", unit: "pcs", stock: 200, image: "/assets/images/product-8.png" },
  ];

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fs-3 mb-1 text-dark">Inventory</h1>
              <p className="mb-0 text-secondary">Manage your product inventory</p>
            </div>
            <div>
              <Link href="/create-product" className="btn btn-primary">
                Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div>
            <div className="d-flex gap-2 mb-3 flex-wrap justify-content-between">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                style={{ maxWidth: "250px" }}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary">
                  <i className="ti ti-filter"></i> Filter
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="ti ti-file-excel"></i> Excel
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="ti ti-file-pdf"></i> PDF
                </button>
              </div>
            </div>
          </div>

          <div className="card table-responsive">
            <table className="table mb-0 text-nowrap table-hover">
              <thead className="table-light border-light">
                <tr>
                  <th className="text-dark">Image</th>
                  <th className="text-dark">Code</th>
                  <th className="text-dark">Category</th>
                  <th className="text-dark">Brand</th>
                  <th className="text-dark">Price</th>
                  <th className="text-dark">Unit</th>
                  <th className="text-dark">Quantity</th>
                  <th className="text-dark">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={idx} className="align-middle">
                    <td>
                      <a href="#" className="d-flex align-items-center text-decoration-none text-dark">
                        <img src={p.image} alt="" className="avatar avatar-md rounded" />
                        <span className="ms-3">{p.name}</span>
                      </a>
                    </td>
                    <td className="text-secondary">{p.id}</td>
                    <td className="text-secondary">{p.category}</td>
                    <td className="text-secondary">{p.brand}</td>
                    <td className="text-dark fw-semibold">{p.price}</td>
                    <td className="text-secondary">{p.unit}</td>
                    <td className="text-secondary">{p.stock}</td>
                    <td>
                      <a href="#" className="text-decoration-none">
                        <i className="ti ti-edit"></i>
                      </a>
                      <a href="#" className="link-danger text-decoration-none">
                        <i className="ti ti-trash ms-2"></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border-bottom-0 text-secondary">Showing product per page</td>
                  <td colSpan={7} className="border-bottom-0">
                    <nav aria-label="Page navigation" className="d-flex justify-content-end">
                      <ul className="pagination mb-0">
                        <li className="page-item disabled">
                          <a className="page-link" href="#" tabIndex={-1}>
                            Previous
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#">
                            1
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            3
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </td>
                </tr>
              </tfoot>
            </table>
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
