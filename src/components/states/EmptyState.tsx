import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({
  title = "Nothing found",
  description = "Try changing your search or filters.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground" />

      <h2 className="mt-4 text-xl font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
