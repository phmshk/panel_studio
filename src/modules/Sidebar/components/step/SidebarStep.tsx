import { cn } from "@/shared/utils";

interface SidebarStepProps {
  isActive: boolean;
  isLast?: boolean;
  onClick?: () => void;
  count: number;
}

export const SidebarStep = (props: SidebarStepProps) => {
  const { isActive, onClick, count } = props;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex h-12 min-w-12 shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-300 ease-out",
        isActive
          ? "border-primary bg-primary text-primary-foreground scale-105 shadow-md"
          : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-secondary-foreground border-transparent",
      )}
    >
      <span className="z-10 text-sm font-bold">0{count}</span>

      {isActive && (
        <span className="bg-background/50 absolute -bottom-1 h-1 w-1 rounded-full" />
      )}
    </button>
  );
};
