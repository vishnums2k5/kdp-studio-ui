import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="books" />
      <div className="p-6">
        <EmptyState title="books" description="Built in an upcoming phase." />
      </div>
    </>
  );
}
