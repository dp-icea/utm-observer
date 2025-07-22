import * as React from "react";
import { cn } from "@/lib/utils";

const DynamicProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-500 ease-linear"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </div>
  );
});
DynamicProgress.displayName = "DynamicProgress";

export { DynamicProgress };
