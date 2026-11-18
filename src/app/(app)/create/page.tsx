import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Create book" />
      <div className="p-6">
        <EmptyState title="Create book" description="Phase 5 builds the create hub." />
      </div>
    </>
  );
}
