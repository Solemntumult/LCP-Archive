'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GitFork,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
  Film,
  Calendar,
  Layers,
  Info,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function HelpPageView() {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      id: 1,
      title: t('help_step1_title'),
      desc: t('help_step1_desc'),
      badge: language === 'fr' ? 'G?n?ration 1 ? Les Racines' : 'Generation 1 ? The Roots',
      foyerName: 'Foyer Paul & Lucienne LISSANON',
      centerPerson: { name: 'Paul LISSANON', role: language === 'fr' ? 'Patriarche' : 'Patriarch', isDeceased: true },
      spouse: { name: 'Lucienne AGBODJAN', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: true },
      children: ['Claude', 'Val?re', 'Alexis', 'Eric', 'Herv?', 'Salomon', 'L?ticia', 'R?gina'],
      highlight: 'center',
    },
    {
      id: 2,
      title: t('help_step2_title'),
      desc: t('help_step2_desc'),
      badge: language === 'fr' ? 'G?n?ration 2 ? Branche Fille' : 'Generation 2 ? Child Branch',
      foyerName: 'Foyer Claude & Rachelle LISSANON',
      centerPerson: { name: 'Claude LISSANON', role: language === 'fr' ? 'Chef de foyer' : 'Head of Household', isDeceased: false },
      spouse: { name: 'Rachelle HOUNNOU', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false },
      children: ['Clara', 'Donald', 'Jubil?', 'Jean-Eudes', 'Jolidon', 'Paola', 'Paula'],
      highlight: 'deploy',
    },
    {
      id: 3,
      title: t('help_step3_title'),
      desc: t('help_step3_desc'),
      badge: language === 'fr' ? 'Navigation & Historique' : 'Navigation & History',
      foyerName: 'Foyer Alexis & Monique LISSANON',
      centerPerson: { name: 'Alexis LISSANON', role: language === 'fr' ? 'Chef de foyer' : 'Head of Household', isDeceased: false },
      spouse: { name: 'Monique DOSSOU', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false },
      children: ['Aim?', 'B?atrice', 'Christian'],
      highlight: 'back',
    },
    {
      id: 4,
      title: t('help_step4_title'),
      desc: t('help_step4_desc'),
      badge: language === 'fr' ? 'M?moire & Recueillement' : 'Remembrance & Respect',
      foyerName: 'Foyer Salomon & Ad?le LISSANON',
      centerPerson: { name: 'Salomon LISSANON', role: language === 'fr' ? 'Chef de foyer' : 'Head of Household', isDeceased: true },
      spouse: { name: 'Ad?le KOFFI', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false },
      children: ['Samuel', 'Sarah'],
      highlight: 'deceased',
    },
    {
      id: 5,
      title: t('help_step5_title'),
      desc: t('help_step5_desc'),
      badge: language === 'fr' ? 'Archives Multim?dias' : 'Multimedia Archives',
      foyerName: '?v?nements & R?cits ? R?trospective',
      centerPerson: { name: 'Grande C?l?bration Familiale', role: '?v?nement', isDeceased: false },
      spouse: null,
      children: ['Photos HD', 'Diaporama Story', 'Vid?os MP4/WebM'],
      highlight: 'media',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-[#fff8f4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Title & Subtitle */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#faebe0] text-[#7a5739] text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'fr' ? 'Tutoriel & Documentation' : 'Tutorial & Documentation'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173124] tracking-tight">
            {t('help_title')}
          </h1>
          <p className="text-sm sm:text-base text-[#5c645e] max-w-2xl mx-auto">
            {t('help_subtitle')}
          </p>
        </div>

        {/* Interactive Video / Simulation Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#eae1da] overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#f0e6de]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#7a5739] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{t('help_demo_title')}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#727973] mt-1">
                {t('help_demo_desc')}
              </p>
            </div>
            {/* Demo Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173124] text-white text-xs sm:text-sm font-semibold hover:bg-[#234936] transition-all shadow-xs active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{t('help_pause_demo')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{t('help_start_demo')}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-xl bg-[#f5ece5] text-[#424844] hover:bg-[#eae1da] transition-all"
                title={t('help_restart_demo')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Dots & Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-6">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`flex flex-col p-3 rounded-2xl text-left border transition-all ${
                  currentStep === idx
                    ? 'bg-[#f7efe9] border-[#7a5739] text-[#173124] shadow-xs'
                    : 'bg-[#faf6f2] border-transparent text-[#727973] hover:bg-[#f3eae3]'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-[#7a5739]">
                  {t('help_step')} {idx + 1}
                </span>
                <span className="text-xs font-semibold line-clamp-1 mt-0.5">
                  {s.title.split('. ')[1] || s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive Simulation Frame */}
          <div className="relative bg-[#faf6f2] rounded-2xl p-6 sm:p-8 border border-[#eae1da] min-h-[380px] flex flex-col justify-between overflow-hidden">
            
            {/* Top Bar inside simulation */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#eae1da]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-[#eae1da] text-xs font-semibold text-[#173124]">
                <span className="w-2 h-2 rounded-full bg-[#2e6948] animate-pulse" />
                <span>{activeStepData.foyerName}</span>
              </div>
              <span className="text-xs font-medium text-[#7a5739] bg-[#faebe0] px-2.5 py-1 rounded-lg">
                {activeStepData.badge}
              </span>
            </div>

            {/* Simulation Canvas: Parents & Children */}
            <div className="my-6 flex flex-col items-center gap-6">
              {/* Parents / Spouses Block */}
              <div className="flex items-center gap-4 sm:gap-8 flex-wrap justify-center">
                {/* Spouse (Left) */}
                {activeStepData.spouse && (
                  <div className={`p-4 rounded-2xl bg-white border shadow-xs flex items-center gap-3 w-56 transition-all ${
                    activeStepData.highlight === 'deceased' && activeStepData.spouse.isDeceased
                      ? 'border-[#c68326] ring-2 ring-[#c68326]/30'
                      : 'border-[#eae1da]'
                  }`}>
                    <div className="relative w-11 h-11 rounded-full bg-[#eae1da] flex items-center justify-center font-bold text-[#7a5739] shrink-0">
                      {activeStepData.spouse.name[0]}
                      {activeStepData.spouse.isDeceased && (
                        <span className="absolute -bottom-1 -right-1 bg-[#1a1714] text-[#ffd166] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-amber-400">
                          ?
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#173124] truncate">{activeStepData.spouse.name}</p>
                      <p className="text-[11px] text-[#727973]">{activeStepData.spouse.role}</p>
                    </div>
                  </div>
                )}

                {/* Alliance Link Symbol */}
                {activeStepData.spouse && (
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="w-6 h-0.5 bg-[#7a5739]/50" />
                    <span className="text-[10px] font-bold text-[#7a5739]">?</span>
                  </div>
                )}

                {/* Center Head of Foyer */}
                <div className={`p-4 rounded-2xl bg-white border shadow-sm flex items-center gap-3 w-60 transition-all ${
                  activeStepData.highlight === 'center'
                    ? 'border-[#173124] ring-2 ring-[#173124]/30 scale-105'
                    : activeStepData.highlight === 'deceased' && activeStepData.centerPerson.isDeceased
                    ? 'border-[#c68326] ring-2 ring-[#c68326]/30'
                    : 'border-[#eae1da]'
                }`}>
                  <div className="relative w-12 h-12 rounded-full bg-[#173124] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {activeStepData.centerPerson.name[0]}
                    {activeStepData.centerPerson.isDeceased && (
                      <span className="absolute -bottom-1 -right-1 bg-[#1a1714] text-[#ffd166] text-[11px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black border border-amber-400 shadow-sm">
                        ?
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-[#173124] truncate">{activeStepData.centerPerson.name}</p>
                    <p className="text-[11px] text-[#7a5739] font-medium">{activeStepData.centerPerson.role}</p>
                  </div>
                </div>
              </div>

              {/* Filiation Line */}
              <div className="w-0.5 h-6 bg-[#eae1da] relative">
                <div className="w-2 h-2 rounded-full bg-[#7a5739] absolute -top-1 -left-[3px]" />
              </div>

              {/* Children Grid */}
              <div className="w-full">
                <p className="text-center text-[11px] font-bold text-[#727973] uppercase tracking-wider mb-3">
                  {t('tree_children')} ({activeStepData.children.length})
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
                  {activeStepData.children.map((childName, cIdx) => (
                    <div
                      key={cIdx}
                      className={`px-3 py-2 rounded-xl bg-white border text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all ${
                        activeStepData.highlight === 'deploy' && cIdx === 0
                          ? 'border-[#7a5739] bg-[#faebe0] text-[#7a5739] ring-2 ring-[#7a5739]/30 scale-105'
                          : 'border-[#eae1da] text-[#173124]'
                      }`}
                    >
                      <span className="text-[10px] text-[#8c948e] font-mono">#{cIdx + 1}</span>
                      <span>{childName}</span>
                      {activeStepData.highlight === 'deploy' && cIdx === 0 && (
                        <span className="text-[10px] bg-[#7a5739] text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-bold">
                          <span>{language === 'fr' ? 'D?ployer' : 'Expand'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Description Callout */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-[#eae1da] shadow-xs flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#faebe0] text-[#7a5739] shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-[#173124]">{activeStepData.title}</h2>
                <p className="text-xs text-[#5c645e] leading-relaxed">{activeStepData.desc}</p>
              </div>
            </div>

            {/* Prev / Next step navigation */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#eae1da]">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
                  setIsPlaying(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#424844] hover:bg-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'fr' ? '?tape pr?c?dente' : 'Previous step'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep((prev) => (prev + 1) % steps.length);
                  setIsPlaying(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#173124] hover:bg-white transition-all"
              >
                <span>{language === 'fr' ? '?tape suivante' : 'Next step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Visual Symbols & Reading Guide */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#173124]">
              {t('help_guide_symbols_title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#727973] mt-1">
              {language === 'fr'
                ? 'Comprenez d\'un coup d\'?il les rep?res visuels affich?s sur les cartes et les liens.'
                : 'Understand at a glance the visual indicators on cards and connections.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Symbol 1: Catholic Cross */}
            <div className="p-5 rounded-3xl bg-white border border-[#eae1da] shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1a1714] text-[#ffd166] flex items-center justify-center font-black border border-amber-400 text-sm">
                  ?
                </div>
                <h3 className="text-sm font-bold text-[#173124]">{t('help_sym_cross_title')}</h3>
              </div>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {t('help_sym_cross_desc')}
              </p>
            </div>

            {/* Symbol 2: Alliance Line */}
            <div className="p-5 rounded-3xl bg-white border border-[#eae1da] shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#faebe0] text-[#7a5739] flex items-center justify-center font-black text-sm">
                  ?
                </div>
                <h3 className="text-sm font-bold text-[#173124]">{t('help_sym_alliance_title')}</h3>
              </div>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {t('help_sym_alliance_desc')}
              </p>
            </div>

            {/* Symbol 3: Filiation */}
            <div className="p-5 rounded-3xl bg-white border border-[#eae1da] shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e3eae5] text-[#173124] flex items-center justify-center font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#173124]">{t('help_sym_filiation_title')}</h3>
              </div>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {t('help_sym_filiation_desc')}
              </p>
            </div>

            {/* Symbol 4: Deploy Button */}
            <div className="p-5 rounded-3xl bg-white border border-[#eae1da] shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#173124] text-white flex items-center justify-center font-bold text-xs">
                  <GitFork className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#173124]">{t('help_sym_deploy_title')}</h3>
              </div>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {t('help_sym_deploy_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ & Tips */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#7a5739]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#173124]">
              {t('help_faq_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-[#faf6f2] border border-[#eae1da] space-y-2">
              <p className="text-xs font-bold text-[#173124] flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#7a5739]" />
                {t('help_faq_search_q')}
              </p>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {t('help_faq_search_a')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf6f2] border border-[#eae1da] space-y-2">
              <p className="text-xs font-bold text-[#173124] flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#7a5739]" />
                {t('help_faq_video_q')}
              </p>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {t('help_faq_video_a')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf6f2] border border-[#eae1da] space-y-2">
              <p className="text-xs font-bold text-[#173124] flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-[#7a5739]" />
                {t('help_faq_tree_q')}
              </p>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {t('help_faq_tree_a')}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action: Explore Tree & Events */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 pb-8">
          <Link
            href="/tree"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#173124] text-white text-sm font-semibold hover:bg-[#234936] transition-all shadow-sm active:scale-95"
          >
            <GitFork className="w-4 h-4" />
            <span>{t('dash_explore_tree')}</span>
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#7a5739] text-white text-sm font-semibold hover:bg-[#5f4024] transition-all shadow-sm active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('dash_view_events')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
