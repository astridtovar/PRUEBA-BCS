import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface LinkButtonProps
  extends React.ComponentProps<typeof Link>,
    VariantProps<typeof buttonVariants> {}

export function LinkButton({
  variant = "default",
  size = "default",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
