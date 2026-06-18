"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export default function NavigationLayout({ children }: NavigationLayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: "ti ti-home" },
    { label: "Inventory", href: "/inventory", icon: "ti ti-box-seam" },
    { label: "Add Product", href: "/create-product", icon: "ti ti-plus" },
    { label: "Reports", href: "/reports", icon: "ti ti-receipt" },
    { label: "404 Error", href: "/404-error", icon: "ti ti-alert-circle" },
    { label: "Docs", href: "/docs", icon: "ti ti-file-text" },
  ];

  return (
    <>
      {/* OVERLAY */}
      <div
        id="overlay"
        className={`overlay ${isMobileOpen ? "show" : ""}`}
        onClick={closeMobileSidebar}
      ></div>

      {/* TOPBAR */}
      <nav
        id="topbar"
        className={`navbar bg-white border-bottom fixed-top topbar px-3 ${
          isCollapsed ? "full" : ""
        }`}
      >
        <button
          id="toggleBtn"
          className="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm"
          onClick={toggleSidebar}
        >
          <i className="ti ti-layout-sidebar-left-expand"></i>
        </button>

        {/* MOBILE BUTTON */}
        <button
          id="mobileBtn"
          className="btn btn-light btn-icon btn-sm d-lg-none me-2"
          onClick={toggleMobileSidebar}
        >
          <i className="ti ti-layout-sidebar-left-expand"></i>
        </button>

        <div>
          <ul className="list-unstyled d-flex align-items-center mb-0 gap-1">
            {/* Bell icon */}
            <li className="position-relative">
              <button
                className="position-relative btn-icon btn-sm btn-light btn rounded-circle border-0"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-bell"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                  <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2">
                  2
                  <span className="visually-hidden">unread messages</span>
                </span>
              </button>

              {/* Notifications Dropdown */}
              <div
                className={`dropdown-menu dropdown-menu-end dropdown-menu-md p-0 ${
                  isNotificationsOpen ? "show" : ""
                }`}
                style={{
                  position: "absolute",
                  inset: "auto 0px 0px auto",
                  transform: "translate(0px, 40px)",
                  display: isNotificationsOpen ? "block" : "none",
                }}
              >
                <ul className="list-unstyled p-0 m-0">
                  <li className="p-3 border-bottom">
                    <div className="d-flex gap-3">
                      <img
                        src="/assets/images/avatar/avatar-1.jpg"
                        alt=""
                        className="avatar avatar-sm rounded-circle"
                      />
                      <div className="flex-grow-1 small">
                        <p className="mb-0">New order received</p>
                        <p className="mb-1">Order #12345 has been placed</p>
                        <div className="text-secondary">5 minutes ago</div>
                      </div>
                    </div>
                  </li>
                  <li className="p-3 border-bottom">
                    <div className="d-flex gap-3">
                      <img
                        src="/assets/images/avatar/avatar-4.jpg"
                        alt=""
                        className="avatar avatar-sm rounded-circle"
                      />
                      <div className="flex-grow-1 small">
                        <p className="mb-0">New user registered</p>
                        <p className="mb-1">User @john_doe has signed up</p>
                        <div className="text-secondary">30 minutes ago</div>
                      </div>
                    </div>
                  </li>
                  <li className="p-3 border-bottom">
                    <div className="d-flex gap-3">
                      <img
                        src="/assets/images/avatar/avatar-2.jpg"
                        alt=""
                        className="avatar avatar-sm rounded-circle"
                      />
                      <div className="flex-grow-1 small">
                        <p className="mb-0">Payment confirmed</p>
                        <p className="mb-1">Payment of $299 has been received</p>
                        <div className="text-secondary">1 hour ago</div>
                      </div>
                    </div>
                  </li>
                  <li className="px-4 py-3 text-center">
                    <a href="#" className="text-primary">
                      View all notifications
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            {/* User Dropdown */}
            <li className="ms-3 position-relative">
              <button
                className="bg-transparent border-0 p-0"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
              >
                <img
                  src="/assets/images/avatar/avatar-1.jpg"
                  alt=""
                  className="avatar avatar-sm rounded-circle"
                />
              </button>

              <div
                className={`dropdown-menu dropdown-menu-end p-0 ${
                  isProfileOpen ? "show" : ""
                }`}
                style={{
                  position: "absolute",
                  inset: "auto 0px 0px auto",
                  transform: "translate(0px, 40px)",
                  minWidth: "200px",
                  display: isProfileOpen ? "block" : "none",
                }}
              >
                <div>
                  <div className="d-flex gap-3 align-items-center border-dashed border-bottom px-3 py-3">
                    <img
                      src="/assets/images/avatar/avatar-1.jpg"
                      alt=""
                      className="avatar avatar-md rounded-circle"
                    />
                    <div>
                      <h4 className="mb-0 small fw-bold">Shrina Tesla</h4>
                      <p className="mb-0 small text-secondary">@imshrina</p>
                    </div>
                  </div>
                  <div className="p-3 d-flex flex-column gap-1 small lh-lg">
                    <Link href="/" className="text-decoration-none text-dark">
                      Home
                    </Link>
                    <a href="#!" className="text-decoration-none text-dark">
                      Inbox
                    </a>
                    <a href="#!" className="text-decoration-none text-dark">
                      Chat
                    </a>
                    <a href="#!" className="text-decoration-none text-dark">
                      Activity
                    </a>
                    <a href="#!" className="text-decoration-none text-dark">
                      Account Settings
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside
        id="sidebar"
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-show" : ""
        }`}
      >
        <div className="logo-area">
          <Link href="/" className="d-inline-flex align-items-center text-decoration-none">
            <img src="/assets/images/logo-icon.svg" alt="" width="24" />
            <span className="logo-text ms-2">
              <img src="/assets/images/logo.svg" alt="" />
            </span>
          </Link>
        </div>
        <ul className="nav flex-column">
          <li className="px-4 py-2">
            <small className="nav-text text-secondary text-uppercase fw-semibold" style={{ fontSize: "11px" }}>
              Main
            </small>
          </li>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={index}>
                <Link
                  className={`nav-link ${isActive ? "active" : ""}`}
                  href={item.href}
                  onClick={closeMobileSidebar}
                >
                  <i className={item.icon}></i>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            );
          })}

          <li className="px-4 pt-4 pb-2">
            <small className="nav-text text-secondary text-uppercase fw-semibold" style={{ fontSize: "11px" }}>
              Account
            </small>
          </li>
          <li>
            <Link className="nav-link" href="/signin" onClick={closeMobileSidebar}>
              <i className="ti ti-logout"></i>
              <span className="nav-text">Log in</span>
            </Link>
          </li>
          <li>
            <Link className="nav-link" href="/signup" onClick={closeMobileSidebar}>
              <i className="ti ti-user-plus"></i>
              <span className="nav-text">Sign up</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main
        id="content"
        className={`content py-10 ${isCollapsed ? "full" : ""}`}
      >
        <div className="container-fluid">{children}</div>
      </main>
    </>
  );
}
