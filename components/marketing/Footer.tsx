"use client";

export function Footer() {
  return (
    <footer className="border-t border-sand-200 px-6 sm:px-13 py-7 sm:py-10 grid grid-cols-1 md:grid-cols-3 items-center gap-5">
      <p className="font-display text-[20px] text-teal-800">Aláfíà</p>
      <ul className="flex flex-wrap gap-5 sm:gap-7 list-none justify-center">
        {["For patients", "For clinics", "Privacy", "Contact"].map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-[13px] text-slate-400 no-underline transition-colors hover:text-teal-600"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[13px] font-light text-slate-400 md:text-right">
        © 2025 Aláfíà. All rights reserved.
      </p>
    </footer>
  );
}
