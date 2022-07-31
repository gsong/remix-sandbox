import { Outlet } from "@remix-run/react";

export default function Posts() {
  return <Outlet />;
}

export { ErrorBoundary } from "~/components/ErrorBoundary";
