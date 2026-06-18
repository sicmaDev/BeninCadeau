import React from "react";
import NavigationLayout from "@/components/NavigationLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationLayout>{children}</NavigationLayout>;
}
