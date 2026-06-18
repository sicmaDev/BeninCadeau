"use client";

import React from "react";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="fs-3 mb-1 text-dark">Add Inventory</h1>
              <p className="mb-0 text-secondary">Manage your inventory items</p>
            </div>
            <div>
              <Link href="/inventory" className="btn btn-primary">
                Go to Inventory List
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <form id="addProductForm" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productName" className="form-label text-dark fw-medium">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productName"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productSKU" className="form-label text-dark fw-medium">
                      SKU
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productSKU"
                      placeholder="Enter SKU"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productPrice" className="form-label text-dark fw-medium">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="productPrice"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="productStock" className="form-label text-dark fw-medium">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="productStock"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="productCategory" className="form-label text-dark fw-medium">
                    Category
                  </label>
                  <select className="form-select" id="productCategory" required defaultValue="">
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="food">Food</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="productImage" className="form-label text-dark fw-medium">
                    Product Image
                  </label>
                  <input type="file" className="form-control" id="productImage" accept="image/*" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label text-dark fw-medium">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    rows={4}
                    placeholder="Enter product description"
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Add Product
                  </button>
                  <button type="reset" className="btn btn-secondary">
                    Clear
                  </button>
                </div>
              </form>
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
