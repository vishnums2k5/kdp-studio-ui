import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Overview" />
      <div className="p-6">
        <EmptyState title="Overview" description="Phase 3 builds this screen." />
      </div>
    </>
  );
}
