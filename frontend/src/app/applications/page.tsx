import { ApplicationsTable } from "@/features/applications/components/list/ApplicationsTable";
import { LinkButton } from "@/shared/components/ui/LinkButton";
import { Plus } from "lucide-react";
import { t } from "@/shared/i18n";

const d = t.applications.list.header;

export const metadata = {
  title: "Mis solicitudes | Crédito Digital",
};

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{d.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
          </div>
          <LinkButton href="/applications/new" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {d.newApplication}
          </LinkButton>
        </div>

        <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
          <ApplicationsTable />
        </div>
      </div>
    </div>
  );
}
