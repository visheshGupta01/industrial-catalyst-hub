import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Layers, Search, Loader2, Mail, Phone, Building2, Eye } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductImage } from "@/components/site/ProductImage";
import { useAdminQuotes, useUpdateQuoteStatus } from "@/hooks/useQuote";
import { QuoteItem } from "@/lib/api/quote";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/quotes")({
  head: () => ({ meta: [{ title: "Admin Quotes & RFQs — FerroCore" }] }),
  component: AdminQuotesPage,
});

function AdminQuotesPage() {
  const { data: quotes, isLoading, isError } = useAdminQuotes();
  const updateStatus = useUpdateQuoteStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setFilterStatus] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading quotation requests...
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-destructive">
          Failed to load quotation requests. Please refresh.
        </div>
      </AdminLayout>
    );
  }

  const filteredQuotes = (quotes ?? []).filter((q) => {
    // FIX 1: Optional chaining & fallback checks to prevent calling .toLowerCase() on undefined
    const clientName = q.fullName || q.user?.name || "";
    const clientEmail = q.email || q.user?.email || "";
    const company = q.companyName || "";
    const sku = q.product?.sku || "";
    const productName = q.product?.name || "";

    const searchTerm = search.toLowerCase();

    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm) ||
      clientEmail.toLowerCase().includes(searchTerm) ||
      company.toLowerCase().includes(searchTerm) ||
      sku.toLowerCase().includes(searchTerm) ||
      productName.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || (q.status && q.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Pending
          </span>
        );
      case "Reviewed":
        return (
          <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Reviewed
          </span>
        );
      case "Responded":
        return (
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Responded
          </span>
        );
      case "Cancelled":
        return (
          <span className="bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">B2B Quotations & RFQs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review custom specification inquiries and wholesale bulk order pricing requests.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Name, Email, Company, or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-input bg-background py-2 pl-9 pr-3 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["all", "pending", "reviewed", "responded", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background hover:bg-surface"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Quotations Table */}
        <div className="border border-border bg-card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Customer / Company</th>
                <th className="px-4 py-3">Target SKU / Item</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No quotation requests found.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => {
                  // FIX 2: Safely extract display names and contact information
                  const name = q.fullName || q.user?.name || "Anonymous User";
                  const email = q.email || q.user?.email || "N/A";

                  return (
                    <tr key={q._id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        {q.requirementType === "bulk" ? (
                          <span className="inline-flex items-center gap-1 text-primary font-bold">
                            <Layers className="h-3.5 w-3.5" /> Bulk RFQ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                            <FileText className="h-3.5 w-3.5" /> Quote
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{name}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{email}</span>
                          {q.companyName && (
                            <span className="font-mono bg-surface px-1">{q.companyName}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium line-clamp-1">
                          {q.product?.name || "Deleted Product"}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {q.product?.sku || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(q.status)}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="inline-flex items-center gap-1 border border-border bg-background px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
                        >
                          <Eye className="h-3 w-3" /> View RFQ
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Action Dialog Modal */}
      {selectedQuote && (
        <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
          <DialogContent className="sm:max-w-[600px] border border-border bg-card p-6 rounded-none">
            <DialogHeader className="border-b border-border pb-3">
              <DialogTitle className="text-sm font-semibold uppercase tracking-[0.15em] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {selectedQuote.requirementType === "bulk" ? (
                    <Layers className="h-4 w-4 text-primary" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-600" />
                  )}
                  {selectedQuote.requirementType === "bulk"
                    ? "Bulk Buying RFQ Inquiry"
                    : "Custom Freight Quotation"}
                </span>
                {getStatusBadge(selectedQuote.status)}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs mt-3">
              {/* Product Info Banner */}
              <div className="bg-surface border p-3 flex items-center gap-3">
                <ProductImage
                  image={selectedQuote.product?.images?.[0]?.url}
                  className="h-12 w-12 border object-cover bg-background shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground truncate">
                    {selectedQuote.product?.name || "Product Record Removed"}
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    SKU: <span className="font-mono">{selectedQuote.product?.sku || "N/A"}</span> ·
                    Requested Qty:{" "}
                    <span className="font-bold text-primary">
                      {selectedQuote.quantity || 1} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Contact Card */}
              <div className="grid grid-cols-2 gap-3 border p-3 bg-card">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Client Contact
                  </div>
                  <div className="font-bold text-sm mt-0.5">
                    {selectedQuote.fullName || selectedQuote.user?.name || "N/A"}
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" />{" "}
                    {selectedQuote.email || selectedQuote.user?.email || "N/A"}
                  </div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {selectedQuote.phone || "Not Provided"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Organization
                  </div>
                  <div className="font-bold text-sm mt-0.5 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    {selectedQuote.companyName || "Individual Procurement"}
                  </div>
                  <div className="text-muted-foreground mt-2 font-mono text-[10px]">
                    Submitted: {new Date(selectedQuote.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Requirements Note */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Customer Specification Notes
                </div>
                <div className="p-3 border bg-surface/50 text-foreground text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.notes || "No specification notes attached."}
                </div>
              </div>

              {/* Action Buttons: Quick Status Switcher */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                  Mark Status:
                </span>
                <div className="flex gap-2">
                  {(["Pending", "Reviewed", "Responded", "Cancelled"] as const).map((st) => (
                    <button
                      key={st}
                      disabled={updateStatus.isPending || selectedQuote.status === st}
                      onClick={async () => {
                        console.log("Changing")
                        await updateStatus.mutateAsync({ id: selectedQuote._id, status: st });
                        setSelectedQuote((prev) => (prev ? { ...prev, status: st } : null));
                      }}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                        selectedQuote.status === st
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-surface border-border text-muted-foreground"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
