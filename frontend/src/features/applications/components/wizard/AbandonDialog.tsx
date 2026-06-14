"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAbandonApplication } from "@/features/applications/hooks/useApplicationMutations";
import { toast } from "sonner";
import { t } from "@/shared/i18n";

const d = t.wizard.abandon;

interface AbandonDialogProps {
  applicationId: string;
  open: boolean;
  onClose: () => void;
  onAbandoned: () => void;
}

export function AbandonDialog({
  applicationId,
  open,
  onClose,
  onAbandoned,
}: AbandonDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const abandonMutation = useAbandonApplication(applicationId);

  function handleClose() {
    setReason("");
    setError("");
    onClose();
  }

  async function handleAbandon() {
    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setError(d.reason.error);
      return;
    }
    setError("");
    try {
      await abandonMutation.mutateAsync({ reason: trimmed });
      toast.info(d.toasts.success);
      onAbandoned();
    } catch {
      toast.error(d.toasts.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{d.title}</DialogTitle>
          <DialogDescription>{d.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="abandon-reason">{d.reason.label}</Label>
          <Textarea
            id="abandon-reason"
            placeholder={d.reason.placeholder}
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "abandon-reason-error" : undefined}
            maxLength={500}
          />
          {error && (
            <p id="abandon-reason-error" role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground text-right">
            {d.reason.counter(reason.length)}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={abandonMutation.isPending}
          >
            {d.buttons.goBack}
          </Button>
          <Button
            variant="destructive"
            onClick={handleAbandon}
            disabled={abandonMutation.isPending}
            className="gap-2"
          >
            {abandonMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {d.buttons.confirming}
              </>
            ) : (
              d.buttons.confirm
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
