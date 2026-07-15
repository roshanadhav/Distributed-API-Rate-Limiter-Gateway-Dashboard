import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer, large }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="gw-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`gw-modal ${large ? "gw-modal-lg" : ""}`}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gw-modal-head">
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</div>
              <div className="gw-icon-btn" onClick={onClose}>
                <X size={16} />
              </div>
            </div>
            <div className="gw-modal-body">{children}</div>
            {footer && <div className="gw-modal-foot">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
