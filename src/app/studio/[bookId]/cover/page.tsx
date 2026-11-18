import { CoverEditor } from "@/components/studio/cover-editor";

export default async function CoverPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  return <CoverEditor bookId={bookId} />;
}
