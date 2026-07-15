import React from "react";
import { MoreVertical } from "lucide-react";
import SectionCard from "../components/ui/SectionCard.jsx";
import { USER_SEED } from "../data/seed.js";

export default function UsersPage() {
  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Users</div>
          <div className="gw-page-sub">Administrators and access roles for this gateway.</div>
        </div>
        <button className="gw-btn primary">+ Invite user</button>
      </div>
      <SectionCard>
        <table className="gw-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {USER_SEED.map((u) => (
              <tr key={u.email}>
                <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="gw-avatar" style={{ width: 24, height: 24, fontSize: 10 }}>
                    {u.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  {u.name}
                </td>
                <td className="gw-mono" style={{ color: "var(--text-dim)" }}>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`gw-badge ${u.status === "active" ? "healthy" : "down"}`}>{u.status === "active" ? "Active" : "Suspended"}</span>
                </td>
                <td style={{ color: "var(--text-dim)" }}>{u.lastActive}</td>
                <td><MoreVertical size={14} color="var(--text-faint)" style={{ cursor: "pointer" }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
