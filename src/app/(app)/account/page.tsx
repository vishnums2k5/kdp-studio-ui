import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Account settings" />
      <div className="p-6">
        <EmptyState title="Account settings" description="Phase 9 builds this screen." />
      </div>
    </>
  );
}
