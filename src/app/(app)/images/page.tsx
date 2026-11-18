import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="images" />
      <div className="p-6">
        <EmptyState title="images" description="Built in an upcoming phase." />
      </div>
    </>
  );
}
