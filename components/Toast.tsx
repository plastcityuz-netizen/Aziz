'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Toast() {
  const { toast } = useStore();
  const [visibleId, setVisibleId] = useState<number | null>(null);

  useEffect(() => {
    if (toast) {
      setVisibleId(toast.id);
      const id = window.setTimeout(() => setVisibleId(null), 2400);
      return () => window.clearTimeout(id);
    }
  }, [toast]);

  const show = toast && visibleId === toast.id;

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[72] flex justify-center px-4 md:bottom-10">
      <AnimatePresence>
        {show && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-[#0C1411]/95 py-2.5 pl-4 pr-6 shadow-[0_18px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <CheckCircle2 size={18} strokeWidth={1.8} className="text-emerald-400" />
            <span className="text-[13px] font-semibold text-emerald-100">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
