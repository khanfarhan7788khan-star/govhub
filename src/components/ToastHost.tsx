"use client";
import { useEffect, useState } from "react";

type ToastItem = { id: number; message: string };

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    function handler(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      const id = ++counter;
      setToasts((t) => [...t, { id, message: detail }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 1800);
    }
    window.addEventListener("govhub:toast", handler);
    return () => window.removeEventListener("govhub:toast", handler);
  }, []);

  return (
    <div id="toast-root">
      {toasts.map((t) => (
        <div key={t.id} className="toast mono fade-in">
          {t.message}
        </div>
      ))}
    </div>
  );
}
