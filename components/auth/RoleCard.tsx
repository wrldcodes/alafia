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
          ? "border-[#0F6E56] bg-[#f0faf6] dark:bg-[#0F3028]"
          : "border-[#e8e6e0] dark:border-[#2c2c2a] bg-white dark:bg-[#1a1a18] hover:border-[#c8e8df] dark:hover:border-[#0F6E56]/40",
      ].join(" ")}
    >
      {selected && (
        <motion.div
          layoutId="role-glow"
          className="absolute inset-0 bg-gradient-to-br from-[#f0faf6] to-[#e8f7f0] dark:from-[#0F3028] dark:to-[#0a2018]"
          style={{ zIndex: 0 }}
        />
      )}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div
            className={[
              "w-7 h-7 rounded-lg flex items-center justify-center text-[13px] transition-all duration-150",
              selected
                ? "bg-[#0F6E56] text-white"
                : "bg-[#f0ede8] dark:bg-[#2c2c2a] text-[#9a9890]",
            ].join(" ")}
          >
            {icon}
          </div>
          <div
            className={[
              "w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150",
              selected
                ? "border-[#0F6E56] bg-[#0F6E56]"
                : "border-[#d0cdc8] dark:border-[#3a3a38]",
            ].join(" ")}
          >
            {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </div>
        <div
          className={[
            "text-[12px] font-medium transition-colors duration-150",
            selected ? "text-[#0F6E56]" : "text-[#1a1a18] dark:text-[#f0ede8]",
          ].join(" ")}
        >
          {label}
        </div>
        <div className="text-[10px] text-[#9a9890] dark:text-[#555450] mt-0.5">
          {sub}
        </div>
      </div>
    </motion.button>
  );
}
