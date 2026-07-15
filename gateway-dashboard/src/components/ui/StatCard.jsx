import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, unit, delta, deltaDir, tint = "var(--accent)" }) {
  return (
    <motion.div
      className="gw-card gw-statcard"
      whileHover={{ y: -2, borderColor: "var(--text-faint)" }}
      transition={{ duration: 0.15 }}
    >
      <div className="top">
        <span className="label">{label}</span>
        <span className="icon-wrap" style={{ background: `${tint}1F`, color: tint }}>
          <Icon size={15} />
        </span>
      </div>
      <div className="value">
        {value}
        {unit && <span style={{ fontSize: 13, color: "var(--text-faint)", marginLeft: 4 }}>{unit}</span>}
      </div>
      {delta && (
        <span className={`delta ${deltaDir}`}>
          {deltaDir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </span>
      )}
    </motion.div>
  );
}
