import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-ink/20 bg-ink px-5 py-2 text-sm font-semibold text-sand transition hover:bg-ink/90",
        className
      )}
      {...props}
    />
  );
}
