import { Search } from "lucide-react";
import { FormEvent } from "react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBox({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
  autoFocus = false,
}: SearchBoxProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const keyword = value.trim();

    if (!keyword) return;

    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />

      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-input bg-surface py-2 pl-9 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      <button
        type="submit"
        className="absolute right-2 rounded p-1 text-muted-foreground transition hover:text-primary"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
