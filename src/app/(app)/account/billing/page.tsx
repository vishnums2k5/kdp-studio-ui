import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Account / billing" />
      <div className="p-6">
        <EmptyState title="Account / billing" description="Phase 9 builds this screen." />
      </div>
    </>
  );
}
