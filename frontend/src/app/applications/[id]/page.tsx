import { ApplicationDetail } from "@/features/applications/components/detail/ApplicationDetail";

export const metadata = {
  title: "Detalle de solicitud",
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <ApplicationDetail id={id} />
      </div>
    </div>
  );
}
