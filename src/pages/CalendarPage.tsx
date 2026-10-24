import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CalendarClock } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { useFunnel } from '@/context/FunnelContext';
import { WEBHOOK_CAL } from '@/config/webhooks';

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void;
      q?: unknown[];
      ns?: Record<string, unknown>;
      loaded?: boolean;
    };
  }
}

const CAL_LINK = 'жаркен-усенов-zhfbdg/30min';
const CAL_ORIGIN = 'https://cal.com';

export default function CalendarPage() {
  const { lead } = useFunnel();
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const name = (lead.fullName || `${lead.firstName} ${lead.lastName}`).trim();
  const phone = lead.phone;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (function (C: Window, A: Document, L: string) {
      const p = function (a: Window['Cal'], ar: unknown[]) { a!.q!.push(ar); };
      const d = A.createElement(L) as HTMLScriptElement;
      let cal = C.Cal;
      if (!cal) {
        const calFn = function (...args: unknown[]) { p(calFn as unknown as Window['Cal'], args); };
        (calFn as Window['Cal'])!.q = [];
        (calFn as Window['Cal'])!.ns = {};
        cal = C.Cal = calFn as Window['Cal'];
        d.async = true;
        d.src = `${CAL_ORIGIN}/embed/embed.js`;
        const s = A.getElementsByTagName(L)[0] as HTMLScriptElement;
        s.parentNode!.insertBefore(d, s);
      }
    })(window, document, 'script');

    const tryInit = () => {
      if (!window.Cal) { setTimeout(tryInit, 100); return; }
      window.Cal('init', { origin: CAL_ORIGIN });
      window.Cal('ui', {
        hideEventTypeDetails: false,
        styles: { branding: { brandColor: '#2dd4bf' } },
        theme: 'dark',
      });
      window.Cal('on', {
        action: 'bookingSuccessfulV2',
        callback: (e: CustomEvent) => {
          const data = e.detail?.data || {};
          fetch(WEBHOOK_CAL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone,
              fullName: name,
              bookingUid: data.uid || '',
              startTime: data.startTime || '',
              step: 'cal',
              source: 'calendar',
            }),
          }).catch(() => {});
        },
      });
      if (containerRef.current) {
        window.Cal('inline', {
          elementOrSelector: containerRef.current,
          calLink: CAL_LINK,
          config: { name: name || undefined, phone: phone || undefined, theme: 'dark' },
        });
      }
    };
    tryInit();
  }, [name, phone]);

  return (
    <PageTransition>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary-600/20 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary-500/15 blur-3xl animate-glow-pulse" />
      </div>
      <nav className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-white">Виртуальный СММщик</span>
          </div>
          <div className="text-base text-zinc-400">Шаг 4 · Запись</div>
        </div>
      </nav>
      <section className="px-4 sm:px-5 pt-10 pb-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Выберите удобное время
          </motion.h1>
        </div>
      </section>
      <section className="px-2 sm:px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="w-full min-h-[700px] rounded-xl overflow-hidden"
            style={{ minHeight: '700px' }}
          />
        </div>
      </section>
      <section className="px-4 sm:px-5 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
            <CalendarClock className="w-4 h-4 text-primary" />
            После записи мы пришлём подтверждение в WhatsApp
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
