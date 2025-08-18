import * as React from "react";
import { cn } from "@/shared/lib/utils";

const MaterialProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...props}
    >
      <div className="absolute h-full w-full animate-indeterminate-long bg-primary" />
      <div className="absolute h-full w-full animate-indeterminate-short bg-primary" />
    </div>
  );
});
MaterialProgress.displayName = "MaterialProgress";

export { MaterialProgress };
