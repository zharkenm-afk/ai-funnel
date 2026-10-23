import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CalendarClock, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CalendarClock, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { Card } from '@/components/ui/Card';
import { useFunnel } from '@/context/FunnelContext';

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
                </div>div>
                <nav className="sticky top-0 z-40 glass">
                        <div className="max-w-5xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shrink-0">
                                                            <Sparkles className="w-5 h-5 text-white" />
                                              </div>div>
                                              <span className="font-semibold tracking-tight text-white">Виртуальный СММщик</span>span>
                                  </div>div>
                                  <div className="text-base text-zinc-400">Шаг 4 · Запись</div>div>
                        </div>div>
                </nav>nav>
                <section className="px-4 sm:px-5 pt-12 pb-8">
                        <div className="max-w-2xl mx-auto text-center">
                                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-white">
                                              Выберите удобное время
                                  </motion.h1>motion.h1>
                        </div>div>
                </section>section>
                <section className="px-4 sm:px-5 pb-12">
                        <div className="max-w-3xl mx-auto">
                                  <Card className="p-2 overflow-hidden border-zinc-800">
                                              <div className="rounded-xl overflow-hidden border border-primary-500/20 bg-card">
                                                            <div ref={containerRef} className="w-full h-[600px] rounded-xl overflow-hidden" />
                                              </div>div>
                                  </Card>Card>
                        </div>div>
                </section>section>
                <section className="px-4 sm:px-5 pb-20">
                        <div className="max-w-2xl mx-auto text-center">
                                  <div className="inline-flex items-center gap-2 text-base text-zinc-400">
                                              <CalendarClock className="w-4 h-4 text-primary" />
                                              После записи мы пришлём подтверждение в WhatsApp
                                  </div>div>
                        </div>div>
                </section>section>
          </PageTransition>PageTransition>
        );
}</PageTransition>import { Card } from '@/components/ui/Card';
import { useFunnel } from '@/context/FunnelContext';

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void;
      q?: unknown[];
      ns?: Record<string, unknown>;
    };
  }
}

const CAL_LINK = 'жаркен-усенов-zhfbdg/30min';
const CAL_ORIGIN = 'https://cal.com';
const EMBED_SCRIPT_URL = `${CAL_ORIGIN}/embed/embed.js`;

export default function CalendarPage() {
  const { lead } = useFunnel();
  const containerRef = useRef<HTMLDivElement>(null);

  const name = (lead.fullName || `${lead.firstName} ${lead.lastName}`).trim();
  const phone = lead.phone;

  useEffect(() => {
    if (document.getElementById('cal-com-embed')) return;

    const s = document.createElement('script');
    s.id = 'cal-com-embed';
    s.async = true;
    s.src = EMBED_SCRIPT_URL;
    const e = document.getElementsByTagName('script')[0];
    e.parentNode!.insertBefore(s, e);
  }, []);

  useEffect(() => {
    const initEmbed = () => {
      if (!window.Cal) return;

      window.Cal('init', { origin: CAL_ORIGIN });

      window.Cal('ui', {
        hideEventTypeDetails: true,
        styles: {
          body: '#09090b',
          eventTypeListItem: '#18181b',
        },
      });

      window.Cal('inline', {
        elementOrSelector: containerRef.current,
        calLink: CAL_LINK,
        config: {
          name,
          phone,
          theme: 'dark',
        },
      });
    };

    if (window.Cal) {
      initEmbed();
    } else {
      const checkInterval = setInterval(() => {
        if (window.Cal) {
          clearInterval(checkInterval);
          initEmbed();
        }
      }, 200);
      return () => clearInterval(checkInterval);
    }
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

      <section className="px-4 sm:px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-base text-zinc-400 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="inline-block">Финальный шаг</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-white"
          >
            Выберите удобное время
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-4 text-zinc-400 max-w-lg mx-auto leading-relaxed"
          >
            Короткая демо-презентация, на которой мы внедряем и устанавливаем этот продукт предпринимателям под ключ. Ваши данные
            подставятся автоматически.
          </motion.p>
        </div>
      </section>

      <section className="px-4 sm:px-5 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="p-2 overflow-hidden border-zinc-800">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-5 pt-5 pb-4">
                {[
                  name && `Имя: ${name}`,
                  phone && `Телефон: ${phone}`,
                  lead.role && `Статус: ${lead.role}`,
                ].filter(Boolean).map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-base text-zinc-400">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary shadow-[0_0_10px_-1px_rgba(45,212,191,0.7)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </span>
                    {t}
                  </span>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden border border-primary-500/20 bg-card">
                <div
                  ref={containerRef}
                  className="w-full h-[600px] rounded-xl overflow-hidden"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-5 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-base text-zinc-400">
              <CalendarClock className="w-4 h-4 text-primary" />
              После записи мы пришлём подтверждение в WhatsApp
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}

