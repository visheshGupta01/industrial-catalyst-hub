import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Factory, ShieldCheck, Mail, Lock, User, Building2, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { authStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FerroCore" },
      { name: "description", content: "Sign in or create a business account to access enterprise pricing, framework agreements, and procurement tools." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    if (!email || !password) return toast.error("Please enter your email and password");
    try {
      if (mode === "signin") {
        await authStore.login(email, password);
        toast.success("Welcome back");
      } else {
        await authStore.signup({
          name: String(fd.get("name") || "Procurement Lead"),
          email,
          password,
          company: String(fd.get("company") || ""),
          phone: String(fd.get("phone") || ""),
        });
        toast.success("Business account created");
      }
      navigate({ to: "/profile" });
    } catch (err) {
      toast.error((err as Error).message || "Authentication failed");
    }
  };

  return (
    <SiteLayout>
      <section className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden bg-secondary text-secondary-foreground lg:flex lg:flex-col lg:justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center bg-accent text-accent-foreground">
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">FERROCORE</div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">Industrial Supply Co.</div>
            </div>
          </div>
          <div>
            <div className="eyebrow text-accent">Enterprise procurement</div>
            <h2 className="mt-3 max-w-md text-4xl font-bold leading-tight">
              One account for every<br /> industrial program.
            </h2>
            <p className="mt-5 max-w-md text-sm opacity-75">
              Access tier pricing, framework agreements, Net-30 terms, compliance documentation, and named technical engineers — all under a single business login.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "ISO 9001:2015 certified supply chain",
                "MTC, CoC & traceability before purchase",
                "Volume-tier pricing and Net-30 terms",
                "Dedicated procurement engineer",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 opacity-90">
                  <ShieldCheck className="h-4 w-4 text-accent" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs opacity-50">© 2026 FerroCore Industrial Supply Co.</div>
        </aside>

        {/* Form panel */}
        <div className="flex items-center justify-center bg-background px-6 py-16">
          <div className="w-full max-w-md">
            <div className="eyebrow">{mode === "signin" ? "Sign in" : "Create account"}</div>
            <h1 className="mt-2 text-3xl font-bold">
              {mode === "signin" ? "Access your business account" : "Open a business account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Enter your work email to continue. This is a demo — any credentials work."
                : "Tell us about your company. Approval is instant in this demo environment."}
            </p>

            <div className="mt-6 inline-flex border border-border bg-card p-1 text-xs font-semibold uppercase tracking-wider">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {m === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              {mode === "signup" && (
                <>
                  <Field icon={User} name="name" label="Full name" placeholder="Priya Sharma" required />
                  <Field icon={Building2} name="company" label="Company" placeholder="Acme Manufacturing Ltd." required />
                  <Field icon={Phone} name="phone" label="Work phone" placeholder="+91 98100 12345" />
                </>
              )}
              <Field icon={Mail} name="email" label="Work email" placeholder="procurement@acme.com" type="email" required />
              <Field icon={Lock} name="password" label="Password" placeholder="••••••••" type="password" required />

              {mode === "signin" && (
                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="accent-primary" /> Remember this device
                  </label>
                  <button type="button" className="text-primary hover:underline">Forgot password?</button>
                </div>
              )}

              <button type="submit" className="w-full bg-primary py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>

              <div className="relative my-2 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="bg-background px-2">or continue with</span>
                <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["SSO / SAML", "Microsoft 365"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => { authStore.login("demo@acme.com"); toast.success(`Signed in via ${p}`); navigate({ to: "/profile" }); }}
                    className="border border-border bg-card px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <p className="pt-4 text-center text-xs text-muted-foreground">
                By continuing you agree to FerroCore's{" "}
                <Link to="/" className="underline">Terms</Link> and{" "}
                <Link to="/" className="underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  icon: Icon, name, label, placeholder, type = "text", required,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string; label: string; placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full border border-input bg-background py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </label>
  );
}
