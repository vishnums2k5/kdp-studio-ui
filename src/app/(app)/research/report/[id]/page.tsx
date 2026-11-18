import { Topbar } from "@/components/shell/topbar";
import { EmptyState } from "@/components/ui";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Topbar title="Research report" />
      <div className="p-6">
        <EmptyState title={`Report ${id}`} description="Built with the research flow." />
      </div>
    </>
  );
}
