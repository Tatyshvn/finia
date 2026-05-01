'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Zap, Lock } from 'lucide-react'

type Tab = 'mensual' | 'recarga'

interface Plan {
  name: string
  badge?: string
  price: number
  period?: string         // "/ mes" — solo en plan mensual
  tagline: string
  credits: string
  unitPrice?: string      // "$8.45 por análisis · Ahorras 14%" — solo en recarga única
  features: string[]
  cta: string
  featured: boolean
}

const monthlyPlans: Plan[] = [
  {
    name: 'Básico',
    price: 79,
    period: '/ mes',
    tagline: 'Para quien revisa un banco cada mes y quiere hacerlo sin complicaciones.',
    credits: '4 créditos al mes',
    features: [
      '4 análisis de estados de cuenta',
      'Gráficas de gastos por categoría',
      'Exportación a Excel',
      'Reporte PDF del mes',
      'Consejos financieros con IA',
    ],
    cta: 'Empezar con Básico',
    featured: false,
  },
  {
    name: 'Plus',
    badge: '⭐ El más elegido',
    price: 149,
    period: '/ mes',
    tagline: '¿Tienes más de una cuenta o tarjeta? Este es tu plan.',
    credits: '10 créditos al mes',
    features: [
      '10 análisis de estados de cuenta',
      'Consolida BBVA, Santander, Banorte y más',
      'Gráficas de gastos por categoría',
      'Exportación a Excel',
      'Reporte PDF del mes',
      'Consejos financieros con IA',
      'Historial de todos tus meses',
    ],
    cta: 'Empezar con Plus',
    featured: true,
  },
  {
    name: 'Pro',
    price: 299,
    period: '/ mes',
    tagline: 'Para quien maneja varias cuentas o finanzas de negocio.',
    credits: '25 créditos al mes',
    features: [
      '25 análisis de estados de cuenta',
      'Todo lo del plan Plus',
      'Ideal para freelancers y contadores',
      'Soporte prioritario',
    ],
    cta: 'Empezar con Pro',
    featured: false,
  },
]

const oneTimePlans: Plan[] = [
  {
    name: 'Starter',
    price: 49,
    tagline: 'Para probar Finia con tus propios estados de cuenta.',
    credits: '5 créditos',
    unitPrice: '$9.80 por análisis',
    features: [
      '5 análisis de estados de cuenta',
      'Gráficas, Excel, PDF y consejos incluidos',
      'Sin suscripción — úsalos a tu ritmo',
    ],
    cta: 'Comprar Starter',
    featured: false,
  },
  {
    name: 'Popular',
    badge: '⭐ Mejor valor',
    price: 169,
    tagline: '2 bancos durante 3 meses, o un año de un solo banco.',
    credits: '20 créditos',
    unitPrice: '$8.45 por análisis · Ahorras 14%',
    features: [
      '20 análisis de estados de cuenta',
      'Gráficas, Excel, PDF y consejos incluidos',
      'Sin suscripción — úsalos a tu ritmo',
      'Perfectos para no perder el hilo mes a mes',
    ],
    cta: 'Comprar Popular',
    featured: true,
  },
  {
    name: 'Power',
    price: 369,
    tagline: 'Para quien quiere analizar todo sin fijarse en el saldo.',
    credits: '50 créditos',
    unitPrice: '$7.38 por análisis · Ahorras 25%',
    features: [
      '50 análisis de estados de cuenta',
      'Gráficas, Excel, PDF y consejos incluidos',
      'Sin suscripción — úsalos a tu ritmo',
      'El mejor precio por análisis',
    ],
    cta: 'Comprar Power',
    featured: false,
  },
]

const INTRO: Record<Tab, string> = {
  mensual: 'Tus créditos se renuevan solos cada mes. Tú solo súbete a revisar tus finanzas.',
  recarga: 'Compra créditos una sola vez y úsalos cuando quieras. Sin suscripción, sin fechas límite.',
}

export default function UpgradePage() {
  const [tab, setTab] = useState<Tab>('mensual')
  const plans = tab === 'mensual' ? monthlyPlans : oneTimePlans

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="flex items-center gap-4 mb-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-violet-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>
          <span className="text-2xl font-bold tracking-tight text-violet-700">finia</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-4">
            <Zap size={12} />
            Potencia tu análisis financiero
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Elige tu plan</h1>
          <p className="text-neutral-400 text-base max-w-md mx-auto">
            Analiza tus estados de cuenta, entiende tus gastos y toma mejores decisiones financieras.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-neutral-100 rounded-full">
            {([
              { id: 'mensual', label: 'Mensual' },
              { id: 'recarga', label: 'Recarga única' },
            ] as const).map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${tab === t.id
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Intro text */}
        <p className="text-center text-sm text-neutral-500 mb-10 max-w-lg mx-auto leading-relaxed">
          {INTRO[tab]}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(plan => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center text-xs text-neutral-400 mt-12 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <Lock size={12} />
            Pago seguro · Cancela cuando quieras
          </div>
          <div>
            ¿Dudas? Escríbenos a{' '}
            <a
              href="mailto:hola@finia.mx"
              className="text-violet-700 hover:text-violet-800 underline-offset-2 hover:underline"
            >
              hola@finia.mx
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
  const f = plan.featured

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 transition-all ${f
        ? 'bg-violet-700 text-white shadow-elevated md:scale-105'
        : 'bg-white text-neutral-900 shadow-card border border-neutral-100'
        }`}
    >
      {plan.badge && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${f
            ? 'bg-white text-violet-700'
            : 'bg-violet-100 text-violet-700'
            }`}
        >
          {plan.badge}
        </span>
      )}

      {/* Plan name + tagline */}
      <p className={`text-lg font-bold ${f ? 'text-white' : 'text-neutral-900'}`}>
        {plan.name}
      </p>
      <p className={`text-sm mt-1 mb-5 leading-relaxed ${f ? 'text-violet-200' : 'text-neutral-500'}`}>
        {plan.tagline}
      </p>

      {/* Credits pill */}
      <div
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 mb-4 ${f ? 'bg-white/15' : 'bg-violet-50'
          }`}
      >
        <Zap size={14} className={f ? 'text-violet-200' : 'text-violet-500'} />
        <span className={`text-sm font-semibold ${f ? 'text-white' : 'text-violet-700'}`}>
          {plan.credits}
        </span>
      </div>

      {/* Price block */}
      <div className="mb-5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className={`text-sm ${f ? 'text-violet-300' : 'text-neutral-400'}`}>MXN</span>
          {plan.period && (
            <span className={`text-sm ${f ? 'text-violet-200' : 'text-neutral-500'}`}>
              {plan.period}
            </span>
          )}
        </div>
        {plan.unitPrice && (
          <p className={`text-xs mt-1.5 ${f ? 'text-violet-200' : 'text-neutral-500'}`}>
            {plan.unitPrice}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
        {plan.features.map(feature => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check
              size={15}
              className={`shrink-0 mt-0.5 ${f ? 'text-violet-200' : 'text-violet-500'}`}
            />
            <span className={f ? 'text-violet-100' : 'text-neutral-600'}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${f
          ? 'bg-white text-violet-700 hover:bg-violet-50'
          : 'bg-violet-700 text-white hover:bg-violet-800'
          }`}
      >
        {plan.cta}
      </button>
    </div>
  )
}