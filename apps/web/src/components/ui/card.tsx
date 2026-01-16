import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-sm backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
