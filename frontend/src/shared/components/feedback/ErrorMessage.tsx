import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = "Algo salió mal",
  message = "Ocurrió un error inesperado. Por favor intenta de nuevo.",
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={cn("", className)} role="alert">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-1 flex flex-col gap-2">
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-fit border-destructive text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="mr-2 h-3 w-3" aria-hidden="true" />
            Intentar de nuevo
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
