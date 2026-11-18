import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default async function Page({ params }: { params: Promise<{ flow: string }> }) {
  const { flow } = await params;
  return (
    <>
      <Topbar title={flow} />
      <div className="p-6">
        <EmptyState title={flow} description="Phase 5 builds this generator screen." />
      </div>
    </>
  );
}
