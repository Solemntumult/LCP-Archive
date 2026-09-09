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
  Bookmark,
  User,
  Heart,
  Baby,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function HelpPageView() {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Authentic Family Households from initial_seed.json
  const steps = [
    {
      id: 1,
      title: language === 'fr' ? '1. Le Foyer Racine du Patriarche' : '1. Root Household of the Patriarch',
      desc: language === 'fr'
        ? "L'arbre commence par le patriarche Paul Comlan LISSANON et ses ?pouses (Lucienne DEGBO & Rosalie SEGBEDJI). Les enfants de l'union Paul-Lucienne suivent l'ordre chronologique exact : Claude, Val?re, Alexis, Eric (?), Herv?, Salomon, L?ticia, R?gina."
        : 'The tree begins with the patriarch Paul Comlan LISSANON and his spouses (Lucienne DEGBO & Rosalie SEGBEDJI). The children of the Paul-Lucienne union follow the authentic chronological order: Claude, Val?re, Alexis, Eric (?), Herv?, Salomon, L?ticia, Regina.',
      badge: language === 'fr' ? 'G?N?RATION 1 ? LES RACINES' : 'GENERATION 1 ? THE ROOTS',
      foyerName: 'Foyer Paul & Lucienne LISSANON',
      centerPerson: { id: 1, name: 'Paul Comlan LISSANON', role: language === 'fr' ? 'Patriarche' : 'Patriarch', isDeceased: true, gender: 'M', gen: 1 },
      spouses: [
        { id: 2, name: 'Lucienne DEGBO (Dida)', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false, gender: 'F' },
        { id: 3, name: 'Rosalie SEGBEDJI (Daassi)', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false, gender: 'F' },
      ],
      children: [
        { id: 7, name: 'Claude Gb?nan', isDeceased: false, gender: 'M', hasDescendants: true },
        { id: 8, name: 'Val?re Andr?', isDeceased: false, gender: 'M', hasDescendants: true },
        { id: 9, name: 'Alexis', isDeceased: false, gender: 'M', hasDescendants: true },
        { id: 10, name: 'Eric', isDeceased: true, gender: 'M', hasDescendants: false },
        { id: 11, name: 'Herv?', isDeceased: false, gender: 'M', hasDescendants: true },
        { id: 12, name: 'Salomon', isDeceased: false, gender: 'M', hasDescendants: true },
        { id: 13, name: 'L?ticia', isDeceased: false, gender: 'F', hasDescendants: false },
        { id: 14, name: 'R?gina', isDeceased: false, gender: 'F', hasDescendants: true },
      ],
      actionTip: language === 'fr'
        ? 'Cliquez sur le bouton ? D?ployer ? sous Claude pour ouvrir sa branche familiale.'
        : 'Click on the "Deploy" button under Claude to open his family branch.',
    },
    {
      id: 2,
      title: language === 'fr' ? '2. D?ploiement du Foyer Claude & Rachelle' : '2. Deploying Claude & Rachelle Household',
      desc: language === 'fr'
        ? "En d?ployant la branche de Claude Gb?nan LISSANON et de son ?pouse Rachelle GBAGUIDI, vous d?couvrez leurs 7 enfants dans l'ordre chronologique fixe : Clara, Donald, Jubil?, Jean-Eudes, Jolidon, Paola, Paula."
        : 'Deploying the branch of Claude Gb?nan LISSANON and his spouse Rachelle GBAGUIDI reveals their 7 children in fixed chronological order: Clara, Donald, Jubil?, Jean-Eudes, Jolidon, Paola, Paula.',
      badge: language === 'fr' ? 'G?N?RATION 2 ? BRANCHE CLAUDE' : 'GENERATION 2 ? CLAUDE BRANCH',
      foyerName: 'Foyer Claude & Rachelle LISSANON',
      centerPerson: { id: 7, name: 'Claude Gb?nan LISSANON', role: language === 'fr' ? 'Chef de foyer' : 'Head of Household', isDeceased: false, gender: 'M', gen: 2 },
      spouses: [
        { id: 19, name: 'Rachelle GBAGUIDI', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false, gender: 'F' },
      ],
      children: [
        { id: 20, name: 'Clara', isDeceased: false, gender: 'F', hasDescendants: true },
        { id: 21, name: 'Donald', isDeceased: false, gender: 'M', hasDescendants: false },
        { id: 22, name: 'Jubil?', isDeceased: false, gender: 'M', hasDescendants: false },
        { id: 23, name: 'Jean-Eudes', isDeceased: false, gender: 'M', hasDescendants: false },
        { id: 24, name: 'Jolidon', isDeceased: false, gender: 'M', hasDescendants: false },
        { id: 25, name: 'Paola', isDeceased: false, gender: 'F', hasDescendants: false },
        { id: 26, name: 'Paula', isDeceased: false, gender: 'F', hasDescendants: false },
      ],
      actionTip: language === 'fr'
        ? 'Le bouton ? ? Retour (Paul) ? permet de remonter instantan?ment au foyer parent.'
        : 'The "? Back (Paul)" button allows you to instantly navigate back to the parent household.',
    },
    {
      id: 3,
      title: language === 'fr' ? '3. Foyer Alexis & Patricia LISSANON' : '3. Alexis & Patricia Household',
      desc: language === 'fr'
        ? 'Autre branche de la 2e g?n?ration : Alexis LISSANON et Patricia AHIHA avec leurs enfants Fridzel, Fifam? et Espoir. Chaque membre poss?de une fiche biographique d?taill?e.'
        : 'Another 2nd generation branch: Alexis LISSANON and Patricia AHIHA with their children Fridzel, Fifam?, and Espoir. Every member features a dedicated biography record.',
      badge: language === 'fr' ? 'G?N?RATION 2 ? BRANCHE ALEXIS' : 'GENERATION 2 ? ALEXIS BRANCH',
      foyerName: 'Foyer Alexis & Patricia LISSANON',
      centerPerson: { id: 9, name: 'Alexis LISSANON', role: language === 'fr' ? 'Chef de foyer' : 'Head of Household', isDeceased: false, gender: 'M', gen: 2 },
      spouses: [
        { id: 31, name: 'Patricia AHIHA', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false, gender: 'F' },
      ],
      children: [
        { id: 32, name: 'Fridzel', isDeceased: false, gender: 'M', hasDescendants: false },
        { id: 33, name: 'Fifam?', isDeceased: false, gender: 'F', hasDescendants: false },
        { id: 34, name: 'Espoir', isDeceased: false, gender: 'M', hasDescendants: false },
      ],
      actionTip: language === 'fr'
        ? "Cliquez sur n'importe quel portrait pour afficher la fen?tre d'aper?u et acc?der ? sa biographie."
        : 'Click on any portrait avatar to open the quick preview drawer and view their full biography.',
    },
    {
      id: 4,
      title: language === 'fr' ? '4. Foyer Salomon & D?borah LISSANON' : '4. Salomon & D?borah Household',
      desc: language === 'fr'
        ? 'Branche de Salomon LISSANON et de D?borah AKOUTOU avec leurs enfants Houef?, Roche et Chancelle. Le syst?me g?re les unions multiples et les descendances crois?es avec fluidit?.'
        : 'Branch of Salomon LISSANON and D?borah AKOUTOU with their children Houef?, Roche, and Chancelle. The system seamlessly handles multiple unions and lineage trees.',
      badge: language === 'fr' ? 'G?N?RATION 2 ? BRANCHE SALOMON' : 'GENERATION 2 ? SALOMON BRANCH',
      foyerName: 'Foyer Salomon & D?borah LISSANON',
      centerPerson: { id: 12, name: 'Salomon LISSANON', role: language === 'fr' ? 'Chef de foyer' : 'Head of Household', isDeceased: false, gender: 'M', gen: 2 },
      spouses: [
        { id: 40, name: 'D?borah AKOUTOU', role: language === 'fr' ? '?pouse' : 'Spouse', isDeceased: false, gender: 'F' },
      ],
      children: [
        { id: 41, name: 'Houef?', isDeceased: false, gender: 'F', hasDescendants: false },
        { id: 42, name: 'Roche', isDeceased: false, gender: 'M', hasDescendants: false },
        { id: 43, name: 'Chancelle', isDeceased: false, gender: 'F', hasDescendants: false },
      ],
      actionTip: language === 'fr'
        ? 'Le marqueur ? signale avec respect les membres d?funts de la famille.'
        : 'The ? mark respectfully indicates deceased family members.',
    },
    {
      id: 5,
      title: language === 'fr' ? '5. Foyer 3e G?n?ration : Clara & Oscar SOGLO' : '5. 3rd Generation Household: Clara & Oscar SOGLO',
      desc: language === 'fr'
        ? "La descendance se poursuit sur la 3e g?n?ration avec Clara LISSANON et son ?poux Oscar SOGLO, parents de Yanis SOGLO (G?n?ration 4). Vous pouvez naviguer sans fin d'une g?n?ration ? l'autre."
        : 'Lineage continues into the 3rd generation with Clara LISSANON and her spouse Oscar SOGLO, parents of Yanis SOGLO (Generation 4). You can explore smoothly from generation to generation.',
      badge: language === 'fr' ? 'G?N?RATION 3 ? BRANCHE CLARA' : 'GENERATION 3 ? CLARA BRANCH',
      foyerName: 'Foyer Clara & Oscar SOGLO',
      centerPerson: { id: 20, name: 'Clara LISSANON', role: language === 'fr' ? 'Chef de foyer' : 'Head of Household', isDeceased: false, gender: 'F', gen: 3 },
      spouses: [
        { id: 49, name: 'Oscar SOGLO', role: language === 'fr' ? '?poux' : 'Spouse', isDeceased: false, gender: 'M' },
      ],
      children: [
        { id: 50, name: 'Yanis SOGLO', isDeceased: false, gender: 'M', hasDescendants: false },
      ],
      actionTip: language === 'fr'
        ? 'Toutes les donn?es sont r?elles et issues de la base g?n?alogique du projet.'
        : 'All data displayed is authentic and loaded from the project genealogical archive.',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStep = steps[currentStep];

  return (
    <div className="min-h-screen bg-[#fff8f4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Title & Subtitle */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faebe0] text-[#7a5739] text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'fr' ? 'Guide Pratique & D?monstration' : 'User Guide & Interactive Demo'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173124] tracking-tight">
            {t('help_title')}
          </h1>
          <p className="text-sm sm:text-base text-[#5c645e] max-w-2xl mx-auto">
            {t('help_subtitle')}
          </p>
        </div>

        {/* Interactive Live Demo Simulation on Real Project Data */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#eae1da] overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#f0e6de]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#7a5739] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#c69214]" />
                <span>{t('help_demo_title')}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#727973] mt-1">
                {t('help_demo_desc')}
              </p>
            </div>

            {/* Demo Play / Reset Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173124] text-white text-xs sm:text-sm font-semibold hover:bg-[#234936] transition-all shadow-xs active:scale-95 cursor-pointer"
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
                className="p-2 rounded-xl border border-[#eae1da] text-[#727973] hover:bg-[#f5ece5] hover:text-[#173124] transition-all cursor-pointer"
                title={language === 'fr' ? 'Recommencer la d?mo' : 'Restart demo'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  idx === currentStep
                    ? 'bg-[#173124] text-white shadow-xs'
                    : 'bg-[#fff8f4] text-[#727973] border border-[#eae1da] hover:bg-[#f5ece5]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${idx === currentStep ? 'bg-[#fdcea9]' : 'bg-[#7a5739]'}`} />
                <span>{step.title.split(':')[0]}</span>
              </button>
            ))}
          </div>

          {/* Simulation Stage Container */}
          <div className="relative rounded-3xl bg-[#fff8f4] border-2 border-[#eae1da] p-6 sm:p-8 parchment-texture space-y-6">
            {/* Top Badge & Household Name */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#eae1da]">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#173124] text-white">
                  {activeStep.badge}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173124]">
                  {activeStep.foyerName}
                </h3>
              </div>

              <span className="text-xs font-mono font-bold text-[#7a5739] bg-white px-3 py-1.5 rounded-xl border border-[#eae1da]">
                {t('help_step_label')} {currentStep + 1} {t('help_on_total')} {steps.length}
              </span>
            </div>

            {/* Simulated Live Tree Graph Nodes */}
            <div className="py-6 flex flex-col items-center space-y-8">
              {/* Top Row: Center Person & Spouses */}
              <div className="flex flex-wrap items-center justify-center gap-8">
                {/* Center Person Node */}
                <div className="flex flex-col items-center space-y-2 p-3 bg-white rounded-2xl border-2 border-[#173124] shadow-md">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-serif font-bold text-white shadow-md ${
                      activeStep.centerPerson.gender === 'M' ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
                    }`}>
                      <User className="w-7 h-7 text-white" />
                    </div>
                    {activeStep.centerPerson.isDeceased && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1f1b17] text-white text-[11px] font-black flex items-center justify-center border-2 border-white">
                        ?
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="font-serif font-bold text-xs text-[#173124] block">
                      {activeStep.centerPerson.name}
                    </span>
                    <span className="text-[10px] text-[#7a5739] font-medium">
                      {activeStep.centerPerson.role}
                    </span>
                  </div>
                </div>

                {/* Spouses */}
                {activeStep.spouses.map((sp) => (
                  <div key={sp.id} className="flex flex-col items-center space-y-2 p-3 bg-white rounded-2xl border-2 border-[#c69214] shadow-md">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-serif font-bold text-white shadow-md ${
                        sp.gender === 'M' ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
                      }`}>
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      {sp.isDeceased && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1f1b17] text-white text-[11px] font-black flex items-center justify-center border-2 border-white">
                          ?
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="font-serif font-bold text-xs text-[#7a5739] block">
                        {sp.name}
                      </span>
                      <span className="text-[10px] text-[#727973] font-medium">
                        {sp.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filiation Line */}
              <div className="w-12 h-6 border-l-2 border-b-2 border-r-2 border-[#7a5739] rounded-b-xl" />

              {/* Bottom Row: Authentic Children of Household */}
              <div className="space-y-2 w-full text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#727973] block">
                  {language === 'fr' ? 'Enfants du Foyer (Ordre Chronologique Fixe)' : 'Children of Household (Chronological Order)'}
                </span>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {activeStep.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex flex-col items-center p-2.5 bg-white rounded-2xl border border-[#eae1da] shadow-xs hover:border-[#173124] transition-all min-w-[95px]"
                    >
                      <div className="relative mb-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs ${
                          child.gender === 'M' ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
                        }`}>
                          <Baby className="w-5 h-5" />
                        </div>
                        {child.isDeceased && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1f1b17] text-white text-[9px] font-black flex items-center justify-center border border-white">
                            ?
                          </span>
                        )}
                      </div>

                      <span className="font-serif font-bold text-xs text-[#1f1b17] truncate max-w-[90px]">
                        {child.name}
                      </span>

                      {child.hasDescendants && (
                        <span className="mt-1 px-2 py-0.5 rounded-md bg-[#173124] text-white text-[9px] font-bold">
                          {t('tree_has_descendants_btn')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Narrative Explanation Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eae1da] space-y-2">
              <p className="text-xs sm:text-sm text-[#424844] leading-relaxed">
                {activeStep.desc}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#173124]">
                <Info className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{activeStep.actionTip}</span>
              </div>
            </div>

            {/* Bottom Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#eae1da] bg-white text-xs font-bold text-[#424844] hover:bg-[#f5ece5] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('help_prev_step')}</span>
              </button>

              <Link
                href="/tree"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#173124] text-white text-xs font-bold hover:bg-[#2d4739] shadow-md transition-all active:scale-95"
              >
                <span>{t('help_explore_live_tree')}</span>
                <ArrowRight className="w-4 h-4 text-[#fdcea9]" />
              </Link>

              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#eae1da] bg-white text-xs font-bold text-[#424844] hover:bg-[#f5ece5] transition-all cursor-pointer"
              >
                <span>{t('help_next_step')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
              {t('help_faq_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{t('help_faq_q1')}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {t('help_faq_a1')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{t('help_faq_q2')}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {t('help_faq_a2')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{t('help_faq_q3')}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {t('help_faq_a3')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{t('help_faq_q4')}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {t('help_faq_a4')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
