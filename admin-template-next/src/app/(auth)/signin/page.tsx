"use client";

import React from "react";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body p-5">
          <div className="text-center mb-3">
            <Link href="/" className="mb-4 d-inline-block text-decoration-none">
              <img src="/assets/images/logo-icon.svg" alt="" width="36" />
              <span className="ms-2">
                <img src="/assets/images/logo.svg" alt="" />
              </span>
            </Link>
            <h1 className="card-title mb-5 h5 text-dark">Sign in to your account</h1>
          </div>

          <form className="needs-validation mt-3" noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark fw-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                required
                autoFocus
              />
              <div className="invalid-feedback">Please enter a valid email.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label d-flex justify-content-between text-dark fw-medium">
                <span>Password</span>
                <a href="#" className="small link-primary text-decoration-none">
                  Forgot Password?
                </a>
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Password"
                required
                minLength={6}
              />
              <div className="invalid-feedback">Please provide a password (min 6 characters).</div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input id="remember" className="form-check-input" type="checkbox" />
                <label className="form-check-label small text-secondary" htmlFor="remember">
                  Remember me
                </label>
              </div>
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Sign in
            </button>
          </form>

          <div className="text-center mt-3 small text-muted">
            {"Don't have an account? "}
            <Link href="/signup" className="link-primary text-decoration-none">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
