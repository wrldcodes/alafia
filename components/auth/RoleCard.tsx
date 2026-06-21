"use client";

// components/auth/RoleCard.tsx

import { motion } from "framer-motion";

type Props = {
  icon: React.ReactNode;
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
};

export default function RoleCard({
  icon,
  label,
  sub,
  selected,
  onClick,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={[
        "relative text-left p-3 rounded-xl border-[1.5px] cursor-pointer w-full transition-all duration-150 overflow-hidden",
        selected
          ? "border-[#0F6E56] bg-[#f0faf6]"
          : "border-[#e8e6e0] bg-white hover:border-[#c8e8df] hover:bg-[#fafdf9]",
      ].join(" ")}
    >
      {/* Selected glow */}
      {selected && (
        <motion.div
          layoutId="role-glow"
          className="absolute inset-0 bg-gradient-to-br from-[#f0faf6] to-[#e8f7f0]"
          style={{ zIndex: 0 }}
        />
      )}

      <div className="relative z-10">
        {/* Icon + radio */}
        <div className="flex items-center justify-between mb-2">
          <div
            className={[
              "w-7 h-7 rounded-lg flex items-center justify-center text-[13px] transition-all duration-150",
              selected
                ? "bg-[#0F6E56] text-white"
                : "bg-[#f0ede8] text-[#9a9890]",
            ].join(" ")}
          >
            {icon}
          </div>
          {/* Radio indicator */}
          <div
            className={[
              "w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150",
              selected ? "border-[#0F6E56] bg-[#0F6E56]" : "border-[#d0cdc8]",
            ].join(" ")}
          >
            {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </div>

        <div
          className={[
            "text-[12px] font-medium transition-colors duration-150",
            selected ? "text-[#0F6E56]" : "text-[#1a1a18]",
          ].join(" ")}
        >
          {label}
        </div>
        <div className="text-[10px] text-[#9a9890] mt-0.5">{sub}</div>
      </div>
    </motion.button>
  );
}
