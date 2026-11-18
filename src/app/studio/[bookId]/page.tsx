import { StudioClient } from "@/components/studio/studio-client";

export default async function StudioPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  return <StudioClient bookId={bookId} />;
}
