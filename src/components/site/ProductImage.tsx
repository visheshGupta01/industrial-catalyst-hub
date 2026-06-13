import {
  Cog,
  Zap,
  Cpu,
  Bot,
  Fan,
  Microchip,
  Settings2,
  CircuitBoard,
  Gauge,
  Wrench,
  Flame,
  ConstructionIcon,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cog: Cog,
  bolt: Zap,
  press: Gauge,
  robot: Bot,
  fan: Fan,
  chip: Microchip,
  gear: Settings2,
  cpu: CircuitBoard,
  valve: Cpu,
  motor: Wrench,
  spark: Flame,
  crane: ConstructionIcon,
};

export function ProductImage({ image, className = "" }: { image: string; className?: string }) {
  const Icon = ICONS[image] ?? Cog;
  return (
    <div
      className={`product-visual relative flex items-center justify-center overflow-hidden bg-surface ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 hairline-grid opacity-50" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <Icon className="product-visual-icon relative h-24 w-24 text-secondary/80 stroke-[1.25]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-secondary/5" />
    </div>
  );
}
