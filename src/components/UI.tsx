"use client";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ title, children, onClose }: any) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-[min(650px,95vw)] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="pt-4">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Input({ label, ...props }: any) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <input
        {...props}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-gray-800/30 outline-none transition"
      />
    </label>
  );
}

export function Button({ children, color = "black", ...props }: any) {
  const styles =
    color === "black"
      ? "bg-black text-white hover:bg-gray-800"
      : color === "red"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-gray-900 text-white hover:bg-gray-800";
  return (
    <button
      {...props}
      className={`${styles} px-4 py-2 rounded-lg text-sm font-medium transition`}
    >
      {children}
    </button>
  );
}
