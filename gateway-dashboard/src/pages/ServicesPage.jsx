import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEngine } from "../context/EngineContext.jsx";
import ServiceCard from "../components/services/ServiceCard.jsx";
import ServiceDetailModal from "../components/services/ServiceDetailModal.jsx";
import Toast from "../components/ui/Toast.jsx";
import { LoadingState, UnreachableState } from "../components/ui/ConnectionState.jsx";

export default function ServicesPage() {
  const { services, connection, connectionError, refreshNow } = useEngine();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const groups = useMemo(() => [...new Set(services.map((s) => s.group))], [services]);
  const [tab, setTab] = useState(groups[0]);
  const activeTab = groups.includes(tab) ? tab : groups[0];

  if (connection === "connecting" && services.length === 0) return <LoadingState />;
  if (connection === "error" && services.length === 0) return <UnreachableState onRetry={refreshNow} error={connectionError} />;

  const applyAction = (svc) => {
    setToast(`No control-plane endpoint is connected yet for ${svc.id} — this action can't be sent to the gateway.`);
    setTimeout(() => setToast(null), 3000);
  };

  const list = services.filter((s) => s.group === activeTab);
  const detailSvc = serviceId ? services.find((s) => s.id === serviceId) : null;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Services</div>
          <div className="gw-page-sub">Live status for every backend service registered with the gateway.</div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="gw-tabs" style={{ marginBottom: 18 }}>
          {groups.map((g) => (
            <div key={g} className={`gw-tab ${activeTab === g ? "active" : ""}`} onClick={() => setTab(g)}>
              {g} <span className="gw-mono" style={{ color: "var(--text-faint)" }}>({services.filter((s) => s.group === g).length})</span>
            </div>
          ))}
        </div>
      )}

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {list.map((svc) => (
          <ServiceCard key={svc.id} svc={svc} onAction={applyAction} />
        ))}
        {list.length === 0 && (
          <div className="gw-card gw-card-pad" style={{ textAlign: "center", color: "var(--text-faint)" }}>No services in this group.</div>
        )}
      </div>

      {detailSvc && <ServiceDetailModal svc={detailSvc} onClose={() => navigate("/services")} />}

      <Toast message={toast} />
    </div>
  );
}
