import { EditApplicationLoader } from "@/features/applications/components/wizard/EditApplicationLoader";

export const metadata = {
  title: "Editar solicitud",
};

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditApplicationLoader id={id} />;
}
