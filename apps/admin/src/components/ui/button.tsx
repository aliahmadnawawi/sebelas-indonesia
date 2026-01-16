import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-noir px-4 py-2 text-sm font-semibold text-white transition hover:bg-noir/90",
        className
      )}
      {...props}
    />
  );
}
