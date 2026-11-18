import { Sidebar } from "@/components/shell/sidebar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[var(--shell-sidebar-w)]">
        <main id="main">{children}</main>
      </div>
    </div>
  );
}
