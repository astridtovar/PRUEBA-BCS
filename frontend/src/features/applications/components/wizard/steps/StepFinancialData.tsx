"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  financialDataSchema,
  type FinancialDataFormValues,
} from "@/features/applications/schemas/financialData.schema";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { useUpdateApplication } from "@/features/applications/hooks/useApplicationMutations";
import { toast } from "sonner";
import { t } from "@/shared/i18n";

const d = t.wizard.financialData;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive mt-1">
      {message}
    </p>
  );
}

const COP = new Intl.NumberFormat("es-CO");

function CurrencyInput({
  id,
  placeholder,
  value,
  onChange,
  ariaInvalid,
  ariaDescribedBy,
}: {
  id: string;
  placeholder: string;
  value: number | undefined;
  onChange: (v: number) => void;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}) {
  const hasValue = value != null && !isNaN(value) && value > 0;
  const displayValue = hasValue ? COP.format(value!) : "";

  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        aria-hidden="true"
      >
        $
      </span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        className="pl-7"
        value={displayValue}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          onChange(raw ? Number(raw) : NaN);
        }}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
    </div>
  );
}

export function StepFinancialData() {
  const { applicationId, step3, setStep3, clearSimulationResult, nextStep, prevStep } =
    useWizardStore();
  const updateMutation = useUpdateApplication(applicationId ?? "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FinancialDataFormValues>({
    resolver: zodResolver(financialDataSchema),
    defaultValues: {
      monthlyIncome: step3.monthlyIncome,
      monthlyExpenses: step3.monthlyExpenses,
      requestedAmount: step3.requestedAmount,
      termMonths: step3.termMonths,
      creditPurpose: step3.creditPurpose ?? "",
      dataProcessingAccepted: step3.dataProcessingAccepted ?? false,
    },
  });

  async function onSubmit(values: FinancialDataFormValues) {
    if (!applicationId) return;
    try {
      await updateMutation.mutateAsync(values);
      setStep3(values);
      clearSimulationResult();
      nextStep();
    } catch {
      toast.error(d.errors.saveFailed);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{d.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{d.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="monthlyIncome">{d.fields.monthlyIncome}</Label>
          <Controller
            name="monthlyIncome"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="monthlyIncome"
                placeholder={d.fields.monthlyIncomePlaceholder}
                value={field.value}
                onChange={field.onChange}
                ariaInvalid={!!errors.monthlyIncome}
              />
            )}
          />
          <FieldError message={errors.monthlyIncome?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="monthlyExpenses">{d.fields.monthlyExpenses}</Label>
          <Controller
            name="monthlyExpenses"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="monthlyExpenses"
                placeholder={d.fields.monthlyExpensesPlaceholder}
                value={field.value}
                onChange={field.onChange}
                ariaInvalid={!!errors.monthlyExpenses}
              />
            )}
          />
          <FieldError message={errors.monthlyExpenses?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="requestedAmount">{d.fields.requestedAmount}</Label>
          <Controller
            name="requestedAmount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="requestedAmount"
                placeholder={d.fields.requestedAmountPlaceholder}
                value={field.value}
                onChange={field.onChange}
                ariaInvalid={!!errors.requestedAmount}
              />
            )}
          />
          <FieldError message={errors.requestedAmount?.message} />
          <p className="text-xs text-muted-foreground">
            {d.fields.requestedAmountHint}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="termMonths">{d.fields.termMonths}</Label>
          <Input
            id="termMonths"
            type="number"
            min={6}
            max={120}
            placeholder={d.fields.termMonthsPlaceholder}
            aria-invalid={!!errors.termMonths}
            {...register("termMonths", { valueAsNumber: true })}
          />
          <FieldError message={errors.termMonths?.message} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="creditPurpose">{d.fields.creditPurpose}</Label>
          <Textarea
            id="creditPurpose"
            placeholder={d.fields.creditPurposePlaceholder}
            rows={3}
            aria-invalid={!!errors.creditPurpose}
            {...register("creditPurpose")}
          />
          <FieldError message={errors.creditPurpose?.message} />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <Controller
              name="dataProcessingAccepted"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="dataProcessingAccepted"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  aria-invalid={!!errors.dataProcessingAccepted}
                  aria-describedby={
                    errors.dataProcessingAccepted
                      ? "dataProcessing-error"
                      : undefined
                  }
                  className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
              )}
            />
            <Label
              htmlFor="dataProcessingAccepted"
              className="cursor-pointer text-sm leading-relaxed text-foreground"
            >
              {d.fields.dataConsent}
            </Label>
          </div>
          {errors.dataProcessingAccepted && (
            <p id="dataProcessing-error" role="alert" className="text-xs text-destructive mt-1">
              {errors.dataProcessingAccepted.message}
            </p>
          )}
        </div>
      </div>

      {updateMutation.isError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {d.errors.saveFailed}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {d.buttons.back}
        </Button>
        <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {d.buttons.saving}
            </>
          ) : (
            <>
              {d.buttons.simulate}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
