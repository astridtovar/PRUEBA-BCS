import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export function LoadingSpinner({
  size = "md",
  className,
  label = "Cargando...",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeMap[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function LoadingPage({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
