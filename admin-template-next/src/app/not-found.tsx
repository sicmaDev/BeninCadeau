import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center">
          <div className="mb-4">
            <Link href="/" className="d-inline-block mb-4 text-decoration-none">
              <img src="/assets/images/logo-icon.svg" alt="" width="36" />
              <span className="ms-2">
                <img src="/assets/images/logo.svg" alt="" />
              </span>
            </Link>
          </div>

          <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
          <h2 className="h4 mb-3 text-dark">Page Not Found</h2>
          <p className="text-muted mb-4">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <Link href="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
