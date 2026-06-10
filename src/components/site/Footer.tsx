import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary text-secondary-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center bg-accent text-accent-foreground">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">FERROCORE</div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-60">Industrial Supply Co.</div>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-70">
            A trusted procurement platform for industrial machinery, electrical systems,
            automation, and components. Serving manufacturers across 85 countries since 1987.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-wider opacity-60">
            <span className="border border-white/20 px-2 py-1">ISO 9001:2015</span>
            <span className="border border-white/20 px-2 py-1">CE Certified</span>
            <span className="border border-white/20 px-2 py-1">REACH Compliant</span>
          </div>
        </div>

        {[
          { title: "Catalog", links: ["Machinery", "Electrical", "Automation", "Pneumatics", "Instrumentation"] },
          { title: "Services", links: ["Request Quote", "Volume Pricing", "Technical Support", "Logistics", "Compliance"] },
          { title: "Company", links: ["About FerroCore", "Industries", "Newsroom", "Careers", "Contact"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{col.title}</h4>
            <ul className="mt-4 space-y-2.5 text-sm opacity-80">
              {col.links.map((l) => (
                <li key={l}><Link to="/" className="hover:text-accent">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-5 text-xs opacity-60 md:flex-row md:items-center">
          <div>© 2026 FerroCore Industrial Supply Co. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/">Terms of Sale</Link>
            <Link to="/">Privacy</Link>
            <Link to="/">Cookie Policy</Link>
            <Link to="/">Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
