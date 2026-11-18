import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="research" />
      <div className="p-6">
        <EmptyState title="research" description="Built in an upcoming phase." />
      </div>
    </>
  );
}
