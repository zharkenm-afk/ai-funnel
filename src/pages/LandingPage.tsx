import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Play,
  Clock,
  Users,
  TrendingUp,
  Send,
  X,
  CheckCircle2,
  MousePointerClick,
  Bot,
  PenLine,
  Wand2,
  Clapperboard,
  LayoutGrid,
  Headphones,
  CalendarClock,
  Image as ImageIcon,
} from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useFunnel } from '@/context/FunnelContext';
import { WEBHOOK_STEP_1 } from '@/config/webhooks';

const PAINS = [
  {
    icon: Clock,
    title: 'Выгорание от рутины',
    text: 'Каждый день искать идеи, писать тексты и монтировать Reels — это часы работы, которые отнимают время у вашего бизнеса.',
  },
  {
    icon: Send,
    title: 'Reels не залетают',
    text: 'Тратите силы на монтаж, а охваты стоят на месте. Алгоритмы Instagram требуют регулярности и качества, которые трудно держать вручную.',
  },
  {
    icon: Users,
    title: 'Слив бюджета на команду',
    text: 'Дизайнер, монтажёр, копирайтер — содержание Instagram съедает сотни тысяч рублей каждый месяц, а результат непредсказуем.',
  },
  {
    icon: TrendingUp,
    title: 'Реклама не приносит заявок',
    text: 'Запускаете рекламу, но креативы не цепляют аудиторию, а заявки так и не приходят. Бюджет уходит впустую.',
  },
];

const TASKS = [
  {
    icon: Clapperboard,
    title: 'Создание и монтаж Reels',
    text: 'ИИ генерирует сценарии под вашу нишу, автоматически монтирует видео, создаёт цепляющие обложки и заголовки. Готовые Reels выходят без участия монтажёра.',
    points: ['Сценарии по нише за минуты', 'Автоматический монтаж и склейки', 'Обложки и заголовки, которые цепляют'],
  },
  {
    icon: LayoutGrid,
    title: 'Дизайн экспертных каруселей',
    text: 'Карусели — главный формат для экспертов. Платформа генерирует структуру, текст и дизайн слайдов в едином стиле вашего бренда.',
    points: ['Структура и текст слайдов', 'Дизайн в фирменном стиле', 'Готово к публикации за минуты'],
  },
  {
    icon: Headphones,
    title: 'Графическая и видеореклама',
    text: 'Платформа создаёт не только креативы с говорящей головой, но и профессиональные графические рекламные ролики, а также динамичные ролики с использованием трендовых футажей — всё в едином стиле вашего бренда.',
    points: ['Креативы с живым экспертом', 'Графические рекламные ролики', 'Динамичные ролики с трендовыми футажами'],
  },
  {
    icon: CalendarClock,
    title: 'Полный автопостинг',
    text: 'Контент-план на месяц вперёд — публикации выходят автоматически по расписанию. Больше не нужно вспоминать, что выложить в сторис.',
    points: ['Контент-план на месяц', 'Публикации по расписанию', 'Сторис и посты автоматически'],
  },
];



export default function LandingPage() {
  const navigate = useNavigate();
  const { lead, updateLead, markStep1Submitted } = useFunnel();
  const [popupOpen, setPopupOpen] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const exitFired = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!shownOnce) {
        setPopupOpen(true);
        setShownOnce(true);
      }
    }, 90000);
    return () => clearTimeout(t);
  }, [shownOnce]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitFired.current) {
        setPopupOpen(true);
        exitFired.current = true;
      }
    };
    document.addEventListener('mouseout', handler);
    return () => document.removeEventListener('mouseout', handler);
  }, []);

  const openPopup = () => {
    setPopupOpen(true);
    setShownOnce(true);
  };

  const validate = (field: string, value: string) => {
    if (!value.trim()) return 'Обязательное поле';
    if (field === 'phone' && !/^[+\d\s()-]{7,}$/.test(value.trim())) return 'Введите корректный номер';
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    (['firstName', 'lastName', 'phone'] as const).forEach((f) => {
      const err = validate(f, lead[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setSubmitting(true);
    try {
      await fetch(WEBHOOK_STEP_1, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: lead.firstName,
          lastName: lead.lastName,
          phone: lead.phone,
          step: 1,
          source: 'landing',
        }),
      });
    } catch {
      // продолжаем воронку
    }
    markStep1Submitted();
    setSubmitting(false);
    setPopupOpen(false);
    navigate('/video');
  };

  return (
    <PageTransition>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-15%] right-[5%] w-[500px] h-[500px] rounded-full bg-emerald-600/15 blur-3xl animate-glow-pulse" />
        <div className="absolute top-[45%] left-[-5%] w-[400px] h-[400px] rounded-full bg-teal-700/10 blur-3xl animate-glow-pulse" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white">
              Виртуальный СММщик
            </span>
          </div>
          <Button size="sm" variant="outline" className="hidden sm:inline-flex" onClick={openPopup}>
            <Play className="w-4 h-4 shrink-0" />
            <span className="truncate">Смотреть презентацию</span>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-8 sm:pb-12 px-5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-lg text-zinc-300 mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="inline-block">Виртуальный СММ-менеджер для Предпринимателей · СММ-менеджеров · Экспертов · Сервисных компаний</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[1.75rem] leading-[1.3] xs:text-3xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15] font-bold tracking-tight text-white text-balance"
          >
            <span className="inline-block">Виртуальный СММщик на базе{' '}
              <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">ИИ</span>
            </span>
            <br />
            <span className="inline-block">Reels, карусели и автопостинг под ключ за{' '}
              <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">10 минут в день</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 sm:mt-8 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed sm:leading-[1.8] text-balance"
          >
            Заменяет дизайнера, монтажёра и копирайтера. Создавайте готовый контент в едином
            стиле за пару кликов.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center"
          >
            <Button size="lg" onClick={openPopup} className="w-full sm:w-auto max-w-full">
              <MousePointerClick className="w-5 h-5 shrink-0" />
              <span className="min-w-0">Смотреть презентацию платформы</span>
            </Button>
          </motion.div>

        </div>
      </section>

      {/* Pain points */}
      <section className="px-5 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-10 tracking-tight text-white"
          >
            Знакомые проблемы?
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {PAINS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="p-6 sm:p-7 h-full hover:border-teal-500/40 transition-colors duration-300">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                    <p.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-white">{p.title}</h3>
                  <p className="text-zinc-400 text-base leading-relaxed">{p.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Кто мы */}
      <section className="px-5 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-7 sm:p-12 relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-500/15 blur-3xl rounded-full pointer-events-none" />
              <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shrink-0">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                      Кто мы
                    </h2>
                  </div>
                  <p className="text-base sm:text-lg text-zinc-400 leading-relaxed sm:leading-[1.8] mb-5">
                    «Виртуальный СММщик» — это умная ИИ-платформа, который заменяет целую команду
                    маркетологов. Он берёт на себя рутину: придумывает контент, монтирует видео,
                    рисует обложки, пишет тексты и публикует всё по расписанию.
                  </p>
                  <p className="text-base sm:text-lg text-zinc-400 leading-relaxed sm:leading-[1.8]">
                    Вам больше не нужно держать дизайнера, монтажёра и копирайтера — платформа
                    делает их работу за минуты, а не за дни. Вы фокусируетесь на бизнесе, а
                    Instagram ведётся на регулярной основе с предсказуемым результатом.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: PenLine, label: 'Пишет тексты' },
                    { icon: Wand2, label: 'Монтирует видео' },
                    { icon: ImageIcon, label: 'Дизайнит обложки' },
                    { icon: CalendarClock, label: 'Публикует по расписанию' },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl glass text-base text-white"
                    >
                      <item.icon className="w-5 h-5 text-teal-400 shrink-0" />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Tasks / Какие задачи решает */}
      <section className="px-5 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 tracking-tight text-white"
          >
            Какие задачи решает платформа?
          </motion.h2>
          <p className="text-center text-zinc-400 mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Полный цикл контент-маркетинга для Instagram — от идеи до публикации
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TASKS.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="p-6 sm:p-7 h-full hover:border-teal-500/40 transition-colors duration-300">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                    <t.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-3 leading-snug text-white">
                    {t.title}
                  </h3>
                  <p className="text-zinc-400 text-base leading-relaxed mb-4">
                    {t.text}
                  </p>
                  <ul className="space-y-2.5">
                    {t.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-base text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 sm:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/15 blur-3xl rounded-full pointer-events-none" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 tracking-tight text-white">
                  Посмотрите, как это работает
                </h2>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                  Короткая видеопрезентация платформы — за 5 минут вы поймёте, как ИИ заменяет
                  целую SMM-команду.
                </p>
                <Button size="lg" onClick={openPopup} className="w-full sm:w-auto max-w-full">
                  <Play className="w-5 h-5 shrink-0" />
                  <span className="min-w-0">Смотреть презентацию платформы</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 sm:py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center text-base text-zinc-500">
          © {new Date().getFullYear()} Виртуальный СММщик · ИИ-платформа для Instagram-маркетинга
        </div>
      </footer>

      {/* Popup */}
      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPopupOpen(false);
            }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md"
            >
              <Card className="p-7 sm:p-8 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/20 blur-3xl rounded-full pointer-events-none" />
                <button
                  onClick={() => setPopupOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center mb-5">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight text-white">
                    Откройте презентацию платформы
                  </h3>
                  <p className="text-zinc-400 mb-6 text-base leading-relaxed">
                    Оставьте контакты — и мы откроем доступ к видеоразбору платформы. Без спама,
                    только по делу.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="firstName"
                      label="Имя"
                      placeholder="Аида"
                      value={lead.firstName}
                      onChange={(e) => {
                        updateLead({ firstName: e.target.value });
                        if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                      }}
                      error={errors.firstName}
                    />
                    <Input
                      name="lastName"
                      label="Фамилия"
                      placeholder="Салимова"
                      value={lead.lastName}
                      onChange={(e) => {
                        updateLead({ lastName: e.target.value });
                        if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                      }}
                      error={errors.lastName}
                    />
                    <Input
                      name="phone"
                      label="WhatsApp-номер"
                      placeholder="+7 (701) 123-45-67"
                      value={lead.phone}
                      onChange={(e) => {
                        updateLead({ phone: e.target.value });
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      error={errors.phone}
                    />
                    <Button type="submit" size="lg" className="w-full max-w-full" disabled={submitting}>
                      {submitting ? 'Отправляем…' : 'Смотреть презентацию'}
                      {!submitting && <Play className="w-4 h-4 shrink-0" />}
                    </Button>
                    <p className="text-sm text-zinc-500 text-center">
                      Нажимая кнопку, вы соглашаетесь на обработку данных
                    </p>
                  </form>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

