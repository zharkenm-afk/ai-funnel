import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, User, Briefcase, Building2, Stethoscope,
  Instagram, Users, Phone,
} from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useFunnel } from '@/context/FunnelContext';
import { WEBHOOK_STEP_3 } from '@/config/webhooks';

const ROLES = [
  { value: 'Предприниматель', icon: Briefcase },
  { value: 'СММ-специалист', icon: Users },
  { value: 'Эксперт', icon: User },
  { value: 'Клиника или сервис', icon: Stethoscope },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const { lead, updateLead } = useFunnel();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const INSTAGRAM_RE = /^@?[a-zA-Z0-9._]{1,30}$/;

  const validate = (field: string, value: string) => {
    if (!value.trim()) return 'Обязательное поле';
    if (field === 'instagram' && !INSTAGRAM_RE.test(value.trim())) {
      return 'Только латинские буквы — например @yourname';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    (['phone', 'niche', 'role', 'instagram'] as const).forEach((f) => {
      const err = validate(f, lead[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setSubmitting(true);
    try {
      await fetch(WEBHOOK_STEP_3, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.leadId || undefined,
          fullName: `${lead.firstName} ${lead.lastName}`.trim(),
          firstName: lead.firstName,
          lastName: lead.lastName,
          phone: lead.phone,
          niche: lead.niche,
          role: lead.role,
          instagram: lead.instagram,
          step: 3,
          source: 'quiz',
        }),
      });
    } catch {
      // продолжаем воронку
    }
    setSubmitting(false);
    navigate('/calendar');
  };

  return (
    <PageTransition>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-primary-600/20 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary-500/15 blur-3xl animate-glow-pulse" />
      </div>

      <nav className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-white">Виртуальный СММщик</span>
          </div>
          <div className="text-base text-zinc-400">Шаг 3 · Анкета</div>
        </div>
      </nav>

      <section className="px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-base text-zinc-400 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="inline-block">Подберём решение под ваш бизнес</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-white"
          >
            Расскажите немного о себе
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-4 text-zinc-400 text-lg leading-relaxed"
          >
            Это займёт меньше минуты — и поможет решение именно под вас.
          </motion.p>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="p-7 sm:p-9">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 text-base font-medium text-zinc-400">
                    Имя и Фамилия
                  </label>
                  <div className="h-12 px-4 flex items-center rounded-xl border border-zinc-800 bg-card text-white">
                    {`${lead.firstName} ${lead.lastName}`.trim()}
                  </div>
                </div>

                <Input
                  name="phone"
                  label="WhatsApp-номер"
                  placeholder="+7 (701) 123-45-67"
                  value={lead.phone}
                  onChange={(e) => {
                    updateLead({ phone: e.target.value });
                    if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                  }}
                  error={errors.phone}
                />

                <Input
                  name="niche"
                  label="Ниша бизнеса"
                  placeholder="Например: психология, стоматология, фитнес"
                  value={lead.niche}
                  onChange={(e) => {
                    updateLead({ niche: e.target.value });
                    if (errors.niche) setErrors((p) => ({ ...p, niche: '' }));
                  }}
                  error={errors.niche}
                />

                <div>
                  <label className="block mb-2 text-base font-medium text-zinc-400">
                    Кем вы являетесь?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((r) => {
                      const active = lead.role === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => {
                            updateLead({ role: r.value });
                            if (errors.role) setErrors((p) => ({ ...p, role: '' }));
                          }}
                          className={`flex items-center gap-2.5 px-4 h-12 rounded-xl border text-base font-medium transition-all duration-200 ${
                            active
                              ? 'border-primary bg-primary/10 text-white'
                              : 'border-zinc-800 bg-card text-zinc-400 hover:border-primary/40 hover:text-white'
                          }`}
                        >
                          <r.icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-zinc-500'}`} />
                          {r.value}
                        </button>
                      );
                    })}
                  </div>
                  {errors.role && <p className="mt-1.5 text-sm text-error">{errors.role}</p>}
                </div>

                <Input
                  name="instagram"
                  label="Instagram-аккаунт"
                  placeholder="@yourname (только латинские буквы)"
                  value={lead.instagram}
                  onChange={(e) => {
                    updateLead({ instagram: e.target.value });
                    if (errors.instagram) setErrors((p) => ({ ...p, instagram: '' }));
                  }}
                  error={errors.instagram}
                />

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? 'Отправляем…' : 'Продолжить к выбору времени'}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}

