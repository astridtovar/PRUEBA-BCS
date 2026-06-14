"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  basicDataSchema,
  type BasicDataFormValues,
} from "@/features/applications/schemas/basicData.schema";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { useUpdateApplication } from "@/features/applications/hooks/useApplicationMutations";
import { toast } from "sonner";
import { DOCUMENT_TYPE_LABELS } from "@/features/applications/types/application.types";
import { t } from "@/shared/i18n";

const d = t.wizard.basicData;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive mt-1">
      {message}
    </p>
  );
}

export function StepBasicData() {
  const { applicationId, step2, setStep2, nextStep, prevStep } =
    useWizardStore();
  const updateMutation = useUpdateApplication(applicationId ?? "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<BasicDataFormValues>({
    resolver: zodResolver(basicDataSchema),
    mode: "onChange",
    defaultValues: {
      documentType: step2.documentType,
      documentNumber: step2.documentNumber ?? "",
      firstName: step2.firstName ?? "",
      lastName: step2.lastName ?? "",
      phone: step2.phone ?? "",
      email: step2.email ?? "",
      city: step2.city ?? "",
    },
  });

  const docType = watch("documentType");

  async function onSubmit(values: BasicDataFormValues) {
    if (!applicationId) return;
    try {
      await updateMutation.mutateAsync(values);
      setStep2(values);
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
          <Label htmlFor="documentType">{d.fields.documentType}</Label>
          <Select
            value={docType}
            onValueChange={(v) =>
              setValue("documentType", v as BasicDataFormValues["documentType"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              id="documentType"
              aria-invalid={!!errors.documentType}
              aria-describedby={errors.documentType ? "documentType-error" : undefined}
            >
              {docType ? (
                <span className="flex-1 text-left text-sm truncate">
                  {DOCUMENT_TYPE_LABELS[docType]}
                </span>
              ) : (
                <span className="flex-1 text-left text-sm text-muted-foreground truncate">
                  {d.fields.documentTypePlaceholder}
                </span>
              )}
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.documentType?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="documentNumber">{d.fields.documentNumber}</Label>
          <Input
            id="documentNumber"
            placeholder={d.fields.documentNumberPlaceholder}
            aria-invalid={!!errors.documentNumber}
            aria-describedby={errors.documentNumber ? "documentNumber-error" : undefined}
            {...register("documentNumber")}
          />
          <FieldError message={errors.documentNumber?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="firstName">{d.fields.firstName}</Label>
          <Input
            id="firstName"
            placeholder={d.fields.firstNamePlaceholder}
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName">{d.fields.lastName}</Label>
          <Input
            id="lastName"
            placeholder={d.fields.lastNamePlaceholder}
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{d.fields.phone}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={d.fields.phonePlaceholder}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{d.fields.email}</Label>
          <Input
            id="email"
            type="email"
            placeholder={d.fields.emailPlaceholder}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="city">{d.fields.city}</Label>
          <Input
            id="city"
            placeholder={d.fields.cityPlaceholder}
            aria-invalid={!!errors.city}
            {...register("city")}
          />
          <FieldError message={errors.city?.message} />
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
        <Button type="submit" disabled={updateMutation.isPending || !isValid} className="gap-2">
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {d.buttons.saving}
            </>
          ) : (
            <>
              {d.buttons.continue}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
