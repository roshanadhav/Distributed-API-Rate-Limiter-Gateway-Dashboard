import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="gw-card gw-card-pad"
          style={{
            position: "fixed",
            bottom: 22,
            right: 26,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderColor: "var(--accent)",
          }}
        >
          <CheckCircle2 size={15} color="var(--accent)" />
          <span style={{ fontSize: 12.5 }}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
