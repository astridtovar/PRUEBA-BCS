"use client";

import { useState } from "react";
import { Users, User, ArrowRight, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { APPLICATION_CHANNEL, type ApplicationChannel } from "@/features/applications/types/application.types";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { useCreateApplication } from "@/features/applications/hooks/useApplicationMutations";
import { toast } from "sonner";
import { t } from "@/shared/i18n";

const channels: {
  id: ApplicationChannel;
  title: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    id: "SELF_SERVICE",
    title: t.wizard.channel.options.selfService.label,
    description: t.wizard.channel.options.selfService.description,
    icon: User,
  },
  {
    id: "ASSISTED",
    title: t.wizard.channel.options.assisted.label,
    description: t.wizard.channel.options.assisted.description,
    icon: Users,
  },
];

export function StepChannelSelect() {
  const { step1, setStep1, setApplicationId, nextStep } = useWizardStore();
  const [selected, setSelected] = useState<ApplicationChannel | null>(
    step1.channel ?? null
  );
  const [advisorId, setAdvisorId] = useState(step1.advisorId ?? "");
  const createMutation = useCreateApplication();

  async function handleNext() {
    if (!selected) return;

    try {
      const app = await createMutation.mutateAsync({
        channel: selected,
        advisorId: selected === APPLICATION_CHANNEL.ASSISTED ? advisorId || undefined : undefined,
      });
      setApplicationId(app.id);
      setStep1({
        channel: selected,
        advisorId: selected === APPLICATION_CHANNEL.ASSISTED ? advisorId || undefined : undefined,
      });
      nextStep();
    } catch {
      toast.error(t.wizard.channel.errors.createFailed);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {t.wizard.channel.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.wizard.channel.subtitle}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={t.wizard.channel.title}
        className="grid gap-4 sm:grid-cols-2"
      >
        {channels.map(({ id, title, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected === id}
            onClick={() => setSelected(id)}
            className={cn(
              "relative flex flex-col items-start gap-3 rounded-xl border-2 p-6 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              selected === id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                selected === id
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {selected === APPLICATION_CHANNEL.ASSISTED && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.wizard.channel.advisorId.instruction}</span>
          </div>
          <Label htmlFor="advisorId">{t.wizard.channel.advisorId.label}</Label>
          <Input
            id="advisorId"
            placeholder={t.wizard.channel.advisorId.placeholder}
            value={advisorId}
            onChange={(e) => setAdvisorId(e.target.value)}
            maxLength={30}
            aria-describedby="advisorId-hint"
          />
          <p id="advisorId-hint" className="text-xs text-muted-foreground">
            {t.wizard.channel.advisorId.hint}
          </p>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleNext}
          disabled={!selected || createMutation.isPending}
          className="gap-2"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.wizard.channel.buttons.creating}
            </>
          ) : (
            <>
              {t.wizard.channel.buttons.continue}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
