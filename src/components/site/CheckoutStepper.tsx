import { Check } from "lucide-react";

export type StepperStep = { id: string; label: string };

export function CheckoutStepper({ steps, current }: { steps: StepperStep[]; current: number }) {
  return (
    <nav aria-label="Checkout progress" className="border border-border bg-card">
      {/* Desktop View Layout */}
      <ol className="hidden items-stretch md:flex">
        {steps.map((s, i) => {
          // FIX 1: Convert the 0-indexed iterator loop index into a 1-indexed metric
          const stepNumber = i + 1;
          const done = stepNumber < current;
          const active = stepNumber === current;

          return (
            <li key={s.id} className="flex flex-1 items-center">
              <div
                className={`flex flex-1 items-center gap-3 px-4 py-4 ${active ? "bg-primary/5" : ""}`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center text-xs font-bold transition-all ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "border-2 border-primary text-primary"
                        : "border border-border text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : stepNumber}
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-[10px] uppercase tracking-wider ${active ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Step {stepNumber}
                  </div>
                  <div
                    className={`truncate text-sm font-semibold ${active || done ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-6 ${done ? "bg-primary" : "bg-border"}`} />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile View Layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div>
            {/* FIX 2: Correct Mobile Step Tracker String Interpolation boundaries */}
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Step {current} of {steps.length}
            </div>
            <div className="text-sm font-bold text-primary">{steps[current - 1]?.label}</div>
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            {Math.round((current / steps.length) * 100)}%
          </div>
        </div>
        <div className="flex items-center gap-1 p-3">
          {steps.map((s, i) => {
            const stepNumber = i + 1;
            const done = stepNumber < current;
            const active = stepNumber === current;

            return (
              <div key={s.id} className="flex flex-1 items-center gap-1">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center text-[10px] font-bold ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "border-2 border-primary text-primary"
                        : "border border-border text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : stepNumber}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 ${done ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// FIX 3: Re-align steps matrix count to match your active checkout panels sequence
export const CHECKOUT_STEPS: StepperStep[] = [
  { id: "info", label: "Shipping Information" },
  { id: "payment", label: "Payment Method" },
  { id: "review", label: "Review & Confirm" },
];
