import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Loader2,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ClipboardList,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useTrackShipment } from "@/hooks/useShipment";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/order-tracking")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: (search.orderId as string) || "",
  }),
  head: () => ({ meta: [{ title: "Package Tracking Trace — FerroCore" }] }),
  component: OrderTrackingPage,
});

function OrderTrackingPage() {
  const { orderId } = Route.useSearch();
  const { data: user, isLoading: authLoading } = useAuth();
  const {
    data: trackingData,
    isLoading: trackingLoading,
    isError,
    error,
  } = useTrackShipment(orderId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
    if (!authLoading && !orderId) {
      navigate({ to: "/orders", replace: true });
    }
  }, [user, authLoading, orderId, navigate]);

  if (authLoading || trackingLoading) {
    return (
      <SiteLayout>
        <div className="container-page flex items-center justify-center gap-2 py-32 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Connecting to carrier network nodes...
        </div>
      </SiteLayout>
    );
  }

  if (!user || !orderId) return null;

  // Extract core parameters safely out of your Shiprocket service matrix response
  const trackInfo = trackingData?.tracking_data?.shipment_track?.[0];
  const activities = trackingData?.tracking_data?.shipment_track_activities ?? [];

  const currentStatus = trackInfo?.current_status || "Processing Order";
  const courierName = trackInfo?.courier_name || "Partner Carrier";
  const awbCode = trackInfo?.awb_code || "N/A";

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to history
          </Link>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">Trace Shipments</h1>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            AWB Code Manifest: <span className="font-bold text-foreground">{awbCode}</span>
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {isError ? (
          <div className="border border-border p-8 text-center bg-card max-w-xl mx-auto">
            <Clock className="h-8 w-8 text-amber-500 mx-auto" />
            <h2 className="text-base font-bold mt-3 text-foreground">Logistics sync in progress</h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {(error as any)?.message ||
                "The courier partner has received the shipment manifest but hasn't updated its live routing nodes yet. Please check back in 12–24 hours."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left Column: Live Progress Checkpoints Timeline */}
            <div className="space-y-6">
              <div className="border border-border bg-card p-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 mb-6">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Routing Transit Milestones
                </h2>

                {activities.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary animate-pulse" />
                    Shipment created. Waiting for carrier pickup trucks to scan the manifest parcel.
                  </div>
                ) : (
                  <ol className="relative border-l border-border ml-3 pl-6 space-y-6">
                    {activities.map((act, index) => {
                      const isFirst = index === 0;
                      return (
                        <li key={index} className="relative">
                          {/* Timeline node icon separator element indicator status indicators */}
                          <span
                            className={`absolute -left-[31px] top-0.5 grid h-5 w-5 place-items-center rounded-full border bg-background text-white ${
                              isFirst
                                ? "border-primary bg-primary"
                                : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            <MapPin className="h-3 w-3" />
                          </span>

                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <h3
                              className={`text-sm font-bold ${isFirst ? "text-primary font-bold text-base" : "text-foreground"}`}
                            >
                              {act.activity}
                            </h3>
                            <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                              {new Date(act.date).toLocaleString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          {act.location && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                              Location Node:{" "}
                              <span className="text-foreground font-semibold">{act.location}</span>
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary Info & Logistics Metadata Sidebar Card */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="border border-border bg-card p-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground border-b border-border pb-3">
                  Shipment Parameters
                </h2>

                <dl className="mt-4 space-y-4 text-xs">
                  <div>
                    <dt className="text-muted-foreground uppercase tracking-wider font-semibold">
                      Active Carrier
                    </dt>
                    <dd className="text-sm font-bold text-foreground mt-1 flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-primary" />
                      {courierName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground uppercase tracking-wider font-semibold">
                      Consignment Status
                    </dt>
                    <dd className="mt-1.5">
                      <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
                        {currentStatus}
                      </span>
                    </dd>
                  </div>

                  {trackInfo?.pickup_date && (
                    <div>
                      <dt className="text-muted-foreground uppercase tracking-wider font-semibold">
                        Hub Dispatched Date
                      </dt>
                      <dd className="text-sm font-semibold text-foreground mt-1">
                        {new Date(trackInfo.pickup_date).toLocaleDateString("en-IN")}
                      </dd>
                    </div>
                  )}

                  {trackInfo?.awb_code && (
                    <div className="pt-2 border-t border-border">
                      <a
                        href={`https://shiprocket.co/tracking/${trackInfo.awb_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 bg-surface border border-border px-4 py-2.5 font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-all text-[11px]"
                      >
                        Shiprocket Web Tracker <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </dl>
              </div>

              <div className="border border-blue-200 bg-blue-50/40 p-4 text-xs text-blue-700 leading-relaxed">
                <h4 className="font-bold flex items-center gap-1 text-blue-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> B2B Procurement Policy Notice
                </h4>
                <p className="mt-1.5">
                  Cargo weights and container dimension manifests have been logged under standard
                  freight regulations. If you note any handling anomalies or structural package
                  deformations upon transit delivery, please capture photographic evidence before
                  signing off on the carrier's invoice.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
