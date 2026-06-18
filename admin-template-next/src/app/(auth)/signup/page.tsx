"use client";

import React from "react";
import Link from "next/link";

export default function SignupPage() {
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
            <h1 className="card-title mb-5 h5 text-dark">Create your account</h1>
          </div>

          <form className="needs-validation mt-3" noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label text-dark fw-medium">
                Full name
              </label>
              <input id="fullName" type="text" className="form-control" placeholder="Jane Doe" required />
              <div className="invalid-feedback">Please enter your name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark fw-medium">
                Email address
              </label>
              <input id="email" type="email" className="form-control" placeholder="name@example.com" required />
              <div className="invalid-feedback">Please enter a valid email.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark fw-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Create a password"
                required
                minLength={6}
              />
              <div className="invalid-feedback">Please provide a password (min 6 characters).</div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label text-dark fw-medium">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Repeat password"
                required
              />
              <div className="invalid-feedback">Passwords must match.</div>
            </div>

            <div className="mb-3 form-check">
              <input id="terms" className="form-check-input" type="checkbox" required />
              <label className="form-check-label small text-secondary" htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-decoration-none">
                  terms and privacy
                </a>
              </label>
              <div className="invalid-feedback">You must agree before continuing.</div>
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Sign up
            </button>
          </form>

          <div className="text-center mt-3 small text-muted">
            Already have an account?{" "}
            <Link href="/signin" className="link-primary text-decoration-none">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
