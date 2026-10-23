import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CalendarClock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const WISTIA_MEDIA_ID = 'mtfq5233z0';

const HIGHLIGHTS = [
  'Как ИИ генерирует Reels и карусели за минуты',
  'Автопостинг и контент-план без ручной работы',
  'Графические и видеорекламные креативы',
  'Реальная экономия на команде и подрядчиках',
];

export default function VideoPage() {
  const navigate = useNavigate();
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById('wistia-player-script')) {
      const script = document.createElement('script');
      script.id = 'wistia-player-script';
      script.src = 'https://fast.wistia.com/player.js';
      script.async = true;
      document.head.appendChild(script);
    }

    if (!document.getElementById('wistia-embed-script')) {
      const script = document.createElement('script');
      script.id = 'wistia-embed-script';
      script.src = `https://fast.wistia.com/embed/${WISTIA_MEDIA_ID}.js`;
      script.async = true;
      script.type = 'module';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <PageTransition>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary-600/20 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary-500/15 blur-3xl animate-glow-pulse" />
      </div>

      <nav className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-white">Виртуальный СММщик</span>
          </div>
          <Button size="sm" onClick={() => navigate('/quiz')}>
            Записаться <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <section className="px-5 pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-base text-zinc-400 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="inline-block">Шаг 2 · Видеопрезентация</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance text-white"
          >
            Как запустить <span className="gradient-text">ИИ-маркетинг</span> для вашего бизнеса:
            Видеоразбор платформы
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed"
          >
            Посмотрите короткое видео — и запишитесь на живую демо-презентацию, чтобы мы внедрили и установили этот продукт вам под ключ.
          </motion.p>
        </div>
      </section>

      {/* Wistia Player */}
      <section className="px-5 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative aspect-video w-full rounded-2xl overflow-hidden border border-primary-500/30 bg-card shadow-[0_0_40px_-10px_var(--primary-500,rgba(16,185,129,0.4))]"
          >
            <div
              ref={playerRef}
              className="w-full h-full"
              dangerouslySetInnerHTML={{
                __html: `
                  <style>
                    wistia-player[media-id='${WISTIA_MEDIA_ID}']:not(:defined) {
                      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${WISTIA_MEDIA_ID}/swatch');
                      display: block;
                      filter: blur(5px);
                      padding-top: 56.25%;
                    }
                    wistia-player {
                      display: block;
                      width: 100%;
                      height: 100%;
                    }
                  </style>
                  <wistia-player media-id="${WISTIA_MEDIA_ID}" aspect="1.7777777777777777"></wistia-player>
                `,
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-5 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-7">
            <h2 className="font-semibold mb-4 text-lg text-white">В видео разбираем:</h2>
            <div className="space-y-3">
              {HIGHLIGHTS.map((h, i) => (
                <motion.div
                  key={h}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-base leading-relaxed">{h}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-3 tracking-tight text-white">Готовы увидеть платформу в деле?</h2>
            <p className="text-zinc-400 mb-6 text-lg leading-relaxed">
              Запишитесь на короткую демо-презентацию — мы внедряем и устанавливаем этот продукт предпринимателям под ключ.
            </p>
            <Button size="lg" onClick={() => navigate('/quiz')}>
              <CalendarClock className="w-5 h-5" /> Записаться на демо-презентацию
            </Button>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}

