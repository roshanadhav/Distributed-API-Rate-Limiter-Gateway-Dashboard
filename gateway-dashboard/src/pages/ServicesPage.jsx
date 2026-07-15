import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEngine } from "../context/EngineContext.jsx";
import ServiceCard from "../components/services/ServiceCard.jsx";
import ServiceDetailModal from "../components/services/ServiceDetailModal.jsx";
import Modal from "../components/ui/Modal.jsx";
import { randInt } from "../lib/utils.js";

export default function ServicesPage() {
  const { services, setServices } = useEngine();
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const groups = useMemo(() => [...new Set(services.map((s) => s.group))], [services]);
  const [tab, setTab] = useState(groups[0]);
  const [confirmAction, setConfirmAction] = useState(null);

  const applyAction = (svc, action) => {
    if (action === "restart") {
      setServices((prev) => prev.map((s) => (s.id === svc.id ? { ...s, status: "healthy", cpu: randInt(20, 40) } : s)));
      return;
    }
    setConfirmAction({ svc, action });
  };

  const confirmed = () => {
    const { svc, action } = confirmAction;
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== svc.id) return s;
        if (action === "disable") return { ...s, status: "disabled" };
        if (action === "enable") return { ...s, status: "healthy" };
        if (action === "removeTraffic") return { ...s, rps: 0, status: s.status === "healthy" ? "warning" : s.status };
        return s;
      })
    );
    setConfirmAction(null);
  };

  const list = services.filter((s) => s.group === tab);
  const detailSvc = serviceId ? services.find((s) => s.id === serviceId) : null;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Services</div>
          <div className="gw-page-sub">Manage backend service groups and their instances.</div>
        </div>
      </div>

      <div className="gw-tabs" style={{ marginBottom: 18 }}>
        {groups.map((g) => (
          <div key={g} className={`gw-tab ${tab === g ? "active" : ""}`} onClick={() => setTab(g)}>
            {g} <span className="gw-mono" style={{ color: "var(--text-faint)" }}>({services.filter((s) => s.group === g).length})</span>
          </div>
        ))}
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {list.map((svc) => (
          <ServiceCard key={svc.id} svc={svc} onAction={applyAction} />
        ))}
      </div>

      {detailSvc && <ServiceDetailModal svc={detailSvc} onClose={() => navigate("/services")} />}

      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={
          confirmAction
            ? `${confirmAction.action === "disable" ? "Disable" : confirmAction.action === "enable" ? "Enable" : "Remove traffic from"} ${confirmAction.svc.id}?`
            : ""
        }
        footer={
          <>
            <button className="gw-btn ghost" onClick={() => setConfirmAction(null)}>Cancel</button>
            <button className="gw-btn danger" onClick={confirmed}>Confirm</button>
          </>
        }
      >
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
          {confirmAction?.action === "disable" && "This instance will stop receiving new traffic and will be marked disabled until re-enabled."}
          {confirmAction?.action === "enable" && "This instance will rejoin the pool and start receiving traffic again."}
          {confirmAction?.action === "removeTraffic" && "In-flight traffic will be drained from this instance immediately."}
        </div>
      </Modal>
    </div>
  );
}
