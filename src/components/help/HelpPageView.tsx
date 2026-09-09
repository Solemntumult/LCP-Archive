'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  GitFork,
  UserPlus,
  Search,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Video,
  Camera,
  Layers,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function HelpPageView() {
  const { language } = useLanguage();

  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-[#fff8f4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Title & Subtitle */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faebe0] text-[#7a5739] text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="w-4 h-4 text-[#7a5739]" />
            <span>{isFr ? "Guide d'Utilisation & Manuel Pratique" : 'Practical User Guide & Manual'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173124] tracking-tight">
            {isFr ? "Comment utiliser la plateforme LCP Archives" : 'How to use the LCP Archives platform'}
          </h1>
          <p className="text-sm sm:text-base text-[#5c645e] max-w-3xl mx-auto leading-relaxed">
            {isFr
              ? "Découvrez pas à pas comment explorer l'arbre généalogique par foyer, déployer les descendances, ajouter de nouveaux membres, rechercher des personnes et consigner des événements historiques."
              : 'Discover step-by-step how to navigate the family tree by household, deploy descendant branches, add new family members, search archives, and preserve historical events.'}
          </p>
        </div>

        {/* Quick Quicklinks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <a
            href="#section-deploy"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-[#eae1da] hover:border-[#173124] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#173124]/10 text-[#173124] flex items-center justify-center group-hover:bg-[#173124] group-hover:text-white transition-all">
              <GitFork className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-[#1f1b17] leading-tight">
              {isFr ? '1. Déployer l’arbre' : '1. Deploy the tree'}
            </span>
          </a>

          <a
            href="#section-add"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-[#eae1da] hover:border-[#173124] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2980b9]/10 text-[#2980b9] flex items-center justify-center group-hover:bg-[#2980b9] group-hover:text-white transition-all">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-[#1f1b17] leading-tight">
              {isFr ? '2. Ajouter un membre' : '2. Add a member'}
            </span>
          </a>

          <a
            href="#section-search"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-[#eae1da] hover:border-[#173124] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#c69214]/10 text-[#c69214] flex items-center justify-center group-hover:bg-[#c69214] group-hover:text-white transition-all">
              <Search className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-[#1f1b17] leading-tight">
              {isFr ? '3. Recherche rapide' : '3. Quick search'}
            </span>
          </a>

          <a
            href="#section-events"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-[#eae1da] hover:border-[#173124] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#c0392b]/10 text-[#c0392b] flex items-center justify-center group-hover:bg-[#c0392b] group-hover:text-white transition-all">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-[#1f1b17] leading-tight">
              {isFr ? '4. Événements & Vidéos' : '4. Events & Videos'}
            </span>
          </a>

          <a
            href="#section-edit"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-[#eae1da] hover:border-[#173124] hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#7a5739]/10 text-[#7a5739] flex items-center justify-center group-hover:bg-[#7a5739] group-hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-[#1f1b17] leading-tight">
              {isFr ? '5. Modifier une fiche' : '5. Edit profiles'}
            </span>
          </a>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PILLAR 1: Comment Naviguer et Déployer l'arbre généalogique */}
        {/* ------------------------------------------------------------- */}
        <section id="section-deploy" className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#eae1da] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0e6de]">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#173124] text-white flex items-center justify-center shrink-0 shadow-md">
                <GitFork className="w-6 h-6 text-[#fdcea9]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a5739]">
                  {isFr ? 'Module 1 • Navigation interactive' : 'Module 1 • Interactive Navigation'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
                  {isFr ? 'Comment naviguer et déployer l’arbre généalogique' : 'How to navigate and deploy the family tree'}
                </h2>
              </div>
            </div>

            <Link
              href="/tree"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173124] text-white text-xs sm:text-sm font-semibold hover:bg-[#234936] transition-all shadow-xs self-start sm:self-center"
            >
              <span>{isFr ? 'Accéder à l’arbre' : 'Open family tree'}</span>
              <ArrowRight className="w-4 h-4 text-[#fdcea9]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Steps Instructions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#faebe0] text-[#7a5739] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#1f1b17]">
                    {isFr ? 'Comprendre la structure par foyer familial' : 'Understand the household-based structure'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                    {isFr
                      ? "L’arbre est organisé en « foyers ». Chaque vue met en lumière le chef de foyer (en haut au centre), ses conjoints (reliés à droite ou à gauche) et l’ensemble de leurs enfants classés dans l'ordre chronologique de naissance."
                      : 'The tree is structured by "households". Each view highlights the head of household (top center), their spouses (connected horizontally), and their children arranged in exact birth order.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#173124] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#173124] flex items-center gap-2">
                    <span>{isFr ? 'Le bouton « Déployer » (ou « Deploy »)' : 'The "Deploy" button'}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#173124] text-white text-[10px] font-bold">
                      {isFr ? 'Déployer' : 'Deploy'}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                    {isFr
                      ? "Sous chaque enfant ayant fondé un foyer ou ayant des descendants, un bouton vert « Déployer » apparaît. Cliquez dessus pour que l'arbre descende d'une génération et se recentre automatiquement sur ce membre, affichant son conjoint et ses propres enfants."
                      : 'Below every child who has descendants or a family of their own, a green "Deploy" button is displayed. Clicking it moves the tree down one generation and automatically recenters on that member with their spouses and children.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#faebe0] text-[#7a5739] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#1f1b17]">
                    {isFr ? 'Remonter avec le bouton « Foyer précédent »' : 'Go back using "Previous household"'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                    {isFr
                      ? "Pour revenir au foyer parent (par exemple remonter du foyer de Claude à celui de Paul), cliquez sur le bouton en haut à gauche « ← Foyer précédent (Nom) »."
                      : 'To return to the parent household (e.g. from Claude\'s household back to Paul\'s), click the top-left button "← Previous household (Name)".'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#faebe0] text-[#7a5739] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#1f1b17]">
                    {isFr ? 'Outils de zoom, déplacement et plein écran' : 'Zoom, pan, and fullscreen controls'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                    {isFr
                      ? "Utilisez les boutons flottants en bas à droite pour zoomer (+ / -), recentrer (⟲), ou passer en plein écran. Vous pouvez aussi glisser-déplacer la grille librement à la souris ou au doigt sur smartphone."
                      : 'Use the floating control bar at the bottom-right to zoom (+ / -), reset the view (⟲), or enter fullscreen. You can also drag the canvas with your mouse or swipe on touchscreens.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Interactive Illustration Card */}
            <div className="lg:col-span-5 bg-[#fff8f4] border-2 border-[#eae1da] rounded-2xl p-5 space-y-4 parchment-texture">
              <div className="text-xs font-bold text-[#7a5739] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#eae1da]">
                <Layers className="w-4 h-4 text-[#c69214]" />
                <span>{isFr ? 'Exemple visuel d’un nœud avec Déploiement' : 'Visual example of a deployable node'}</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#eae1da] shadow-sm flex flex-col items-center text-center space-y-2.5 max-w-[200px] mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#2980b9] text-white flex items-center justify-center font-serif font-bold text-lg border-2 border-white shadow-md">
                  CL
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#1f1b17]">Claude Gbênan</h4>
                  <p className="text-[10px] text-[#7a5739] font-medium">
                    {isFr ? '7 enfants • 2e génération' : '7 children • Gen 2'}
                  </p>
                </div>
                <div className="w-full pt-1">
                  <div className="deploy-btn-shimmer bg-[#173124] text-white rounded-lg py-1.5 px-3 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-[#fdcea9]" />
                    <span>{isFr ? 'Déployer' : 'Deploy'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#eae1da] text-xs text-[#5c645e] space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-[#173124]">
                  <CheckCircle2 className="w-4 h-4 text-[#173124] shrink-0" />
                  <span>{isFr ? 'Astuce de navigation :' : 'Navigation tip:'}</span>
                </div>
                <p className="text-[11px] leading-snug">
                  {isFr
                    ? 'Un simple clic sur le portrait d’un membre ouvre son volet d’aperçu latéral avec accès direct à sa biographie complète.'
                    : 'Clicking any portrait avatar opens a quick slide-over drawer with direct access to their full biographical record.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PILLAR 2: Comment Ajouter un membre de la famille */}
        {/* ------------------------------------------------------------- */}
        <section id="section-add" className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#eae1da] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0e6de]">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#2980b9] text-white flex items-center justify-center shrink-0 shadow-md">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a5739]">
                  {isFr ? 'Module 2 • Filiation & Généalogie' : 'Module 2 • Lineage & Heritage'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
                  {isFr ? 'Comment ajouter un membre de la famille' : 'How to add a family member'}
                </h2>
              </div>
            </div>

            <Link
              href="/person/add"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2980b9] text-white text-xs sm:text-sm font-semibold hover:bg-[#1f6696] transition-all shadow-xs self-start sm:self-center"
            >
              <span>{isFr ? '+ Ajouter un membre' : '+ Add member'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#2980b9]/15 text-[#2980b9] font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif font-bold text-base text-[#1f1b17]">
                {isFr ? '1. Ouvrir le formulaire' : '1. Open the form'}
              </h3>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Cliquez sur le bouton « Ajouter » dans la barre supérieure, ou utilisez le bouton « + Ajouter un membre » disponible directement dans le graphe de l’arbre.'
                  : 'Click the "Add" button in the top navigation bar, or use the contextual "+ Add Member" button directly in the tree graph.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#2980b9]/15 text-[#2980b9] font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif font-bold text-base text-[#1f1b17]">
                {isFr ? '2. Sélectionner le lien de parenté' : '2. Select relationship type'}
              </h3>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Précisez si vous ajoutez un Enfant, un Conjoint / Épouse, ou un Parent (Père / Mère) rattaché à une personne de référence existante dans la famille.'
                  : 'Specify whether you are adding a Child, Spouse, or Parent (Father / Mother) linked to an existing family reference.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#2980b9]/15 text-[#2980b9] font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-serif font-bold text-base text-[#1f1b17]">
                {isFr ? '3. Renseigner l’état civil' : '3. Fill in vital records'}
              </h3>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Indiquez prénom, nom, date et lieu de naissance, statut (en vie ou défunt ✝), profession, et téléchargez une photo de profil pour enrichir l’arbre.'
                  : 'Enter first name, last name, birth date, birthplace, vital status (living or deceased ✝), occupation, and upload a profile photo.'}
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PILLAR 3: Comment Rechercher rapidement (⌘K / Ctrl+K) */}
        {/* ------------------------------------------------------------- */}
        <section id="section-search" className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#eae1da] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0e6de]">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#c69214] text-white flex items-center justify-center shrink-0 shadow-md">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a5739]">
                  {isFr ? 'Module 3 • Recherche universelle' : 'Module 3 • Global Search'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
                  {isFr ? 'Comment rechercher un membre ou une archive' : 'How to search members and archives'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-xs font-mono font-bold text-[#7a5739]">
                ⌘K / Ctrl+K
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? "Le moteur de recherche instantané explore l'ensemble de la base de données : prénoms, noms patronymiques, surnoms affectifs, villes de résidence (Cotonou, Abomey, Paris, etc.) et professions."
                  : 'The instant search engine scans all records across the platform: first names, family surnames, affectionate nicknames, cities of residence, and occupations.'}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fff8f4] border border-[#eae1da]">
                  <Search className="w-4 h-4 text-[#c69214] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#1f1b17] font-medium">
                    {isFr ? 'Recherche par nom complet (ex: « Paul LISSANON »)' : 'Search by full name (e.g. "Paul LISSANON")'}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fff8f4] border border-[#eae1da]">
                  <Search className="w-4 h-4 text-[#c69214] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#1f1b17] font-medium">
                    {isFr ? 'Recherche par ville ou lieu d’origine (ex: « Lissazounmé », « Abomey »)' : 'Search by city or origin (e.g. "Lissazounmé", "Abomey")'}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fff8f4] border border-[#eae1da]">
                  <Search className="w-4 h-4 text-[#c69214] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#1f1b17] font-medium">
                    {isFr ? 'Recherche par profession (ex: « Enseignant », « Ingénieur »)' : 'Search by profession (e.g. "Teacher", "Engineer")'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#173124] to-[#234936] text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-[#fdcea9] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{isFr ? 'Raccourci Clavier Universel' : 'Global Keyboard Shortcut'}</span>
              </div>
              <h4 className="font-serif text-xl font-bold">
                {isFr ? 'Accédez à tout en un clin d’œil' : 'Instant access anywhere'}
              </h4>
              <p className="text-xs text-[#eae1da] leading-relaxed">
                {isFr
                  ? "Où que vous soyez sur le site, appuyez simultanément sur ⌘+K (sur Mac) ou Ctrl+K (sur Windows) pour ouvrir le dialogue de recherche instantanée."
                  : 'Press ⌘+K (on Mac) or Ctrl+K (on Windows) from any page to instantly bring up the global search modal.'}
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PILLAR 4: Comment Créer et Configurer un événement familial */}
        {/* ------------------------------------------------------------- */}
        <section id="section-events" className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#eae1da] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0e6de]">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#c0392b] text-white flex items-center justify-center shrink-0 shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a5739]">
                  {isFr ? 'Module 4 • Mémoire & Célébrations' : 'Module 4 • Stories & Celebrations'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
                  {isFr ? 'Comment créer et configurer un événement familial' : 'How to create and configure a family event'}
                </h2>
              </div>
            </div>

            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c0392b] text-white text-xs sm:text-sm font-semibold hover:bg-[#a93226] transition-all shadow-xs self-start sm:self-center"
            >
              <span>{isFr ? '+ Créer un événement' : '+ Create event'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#c0392b]/15 text-[#c0392b] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#1f1b17]">
                {isFr ? '1. Titre & Catégorie' : '1. Title & Category'}
              </h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Définissez le nom (ex: « Célébration de l’an IV »), la date, le lieu et la catégorie (Rassemblement, Commémoration, Célébration, Mariage, etc.).'
                  : 'Set the title (e.g. "4th Anniversary Memorial"), date, location, and category (Reunion, Commemoration, Celebration, Wedding, etc.).'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#7a5739]/15 text-[#7a5739] flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#1f1b17]">
                {isFr ? '2. Galerie Photos HD' : '2. HD Photo Gallery'}
              </h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Téléchargez des photographies d’archives. Vous pouvez ajouter une photo principale et une galerie complète d’images commémoratives.'
                  : 'Upload historical photographs. You can set a primary cover photo along with a full commemorative image gallery.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2980b9]/15 text-[#2980b9] flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#1f1b17]">
                {isFr ? '3. Vidéos & Compression' : '3. Videos & Compression'}
              </h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Ajoutez des vidéos MP4 ou WebM. Le système les optimise et les compresse automatiquement pour une lecture fluide sans temps de chargement.'
                  : 'Add MP4 or WebM video recordings. The system automatically optimizes and compresses them for fast, seamless streaming.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#173124]/15 text-[#173124] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#1f1b17]">
                {isFr ? '4. Récit & Programme' : '4. Narrative & Program'}
              </h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Rédigez la chronique complète, le déroulement de la journée, les discours, et les anecdotes pour les générations futures.'
                  : 'Write the complete narrative chronicle, program timetable, speeches, and testimonies for future generations.'}
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PILLAR 5: Comment Modifier et Enrichir une fiche personnelle */}
        {/* ------------------------------------------------------------- */}
        <section id="section-edit" className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#eae1da] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0e6de]">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#7a5739] text-white flex items-center justify-center shrink-0 shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a5739]">
                  {isFr ? 'Module 5 • Biographies & Profils' : 'Module 5 • Biographies & Profiles'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
                  {isFr ? 'Comment modifier et enrichir une fiche individuelle' : 'How to edit and enrich an individual profile'}
                </h2>
              </div>
            </div>

            <Link
              href="/person/1"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7a5739] text-white text-xs sm:text-sm font-semibold hover:bg-[#5f4024] transition-all shadow-xs self-start sm:self-center"
            >
              <span>{isFr ? 'Exemple : Fiche Paul LISSANON' : 'Example: Paul LISSANON'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h3 className="font-serif font-bold text-sm text-[#1f1b17] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173124] text-white text-xs font-bold flex items-center justify-center">1</span>
                <span>{isFr ? 'Biographie & Récits' : 'Biography & Stories'}</span>
              </h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Consignez l’histoire de vie, les anecdotes marquantes, les faits historiques et les valeurs transmises par chaque ancêtre.'
                  : 'Record life stories, milestones, historical context, and family heritage passed down by each ancestor.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h3 className="font-serif font-bold text-sm text-[#1f1b17] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7a5739] text-white text-xs font-bold flex items-center justify-center">2</span>
                <span>{isFr ? 'Études & Réalisations' : 'Education & Career'}</span>
              </h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Ajoutez le cursus académique, les diplômes obtenus (ENI, ENS, Baccalauréat...), les distinctions et les accomplissements professionnels.'
                  : 'Document academic background, degrees earned (ENI, ENS, Baccalaureate...), career honors, and professional achievements.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h3 className="font-serif font-bold text-sm text-[#1f1b17] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2980b9] text-white text-xs font-bold flex items-center justify-center">3</span>
                <span>{isFr ? 'Chronologie de Vie' : 'Life Timeline'}</span>
              </h3>
              <p className="text-xs text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Le système génère automatiquement la chronologie des naissances, mariages, carrières et hommages pour chaque personne.'
                  : 'The platform automatically compiles an interactive chronological timeline of births, marriages, career steps, and tributes.'}
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* FAQ Section */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
              {isFr ? 'Foire Aux Questions Fréquentes' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-[#727973]">
              {isFr ? 'Réponses claires aux questions pratiques les plus courantes.' : 'Quick answers to common practical questions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{isFr ? 'Que faire si un enfant n’a pas de bouton Déployer ?' : 'What if a child does not have a Deploy button?'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Le bouton « Déployer » s’affiche uniquement lorsque le membre a des conjoints ou des enfants enregistrés. Pour ajouter sa descendance, ouvrez son volet latéral et cliquez sur « + Ajouter ».'
                  : 'The "Deploy" button is displayed when a member has recorded spouses or children. To add their descendants, open their quick drawer and click "+ Add".'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{isFr ? 'Que signifie le symbole ✝ sur un portrait ?' : 'What does the ✝ symbol on a portrait mean?'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Le symbole ✝ indique avec respect qu’un membre de la famille est décédé. Ses dates de naissance et de rappel à Dieu sont consignées sur sa fiche profil.'
                  : 'The ✝ symbol respectfully designates that a family member has passed away. Their birth and passing dates are preserved in their personal archive.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{isFr ? 'Comment changer la langue du site (FR / EN) ?' : 'How do I switch languages (FR / EN)?'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Cliquez sur le sélecteur de langue « FR | EN » situé en haut à droite de la barre de navigation. L’intégralité de l’application, des récits et des fiches bascule instantanément.'
                  : 'Click the "FR | EN" language toggle in the top-right corner of the navigation bar. The entire platform, narratives, and records will switch instantly.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#173124] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span>{isFr ? 'Les données sont-elles protégées et pérennes ?' : 'Is data protected and securely preserved?'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5c645e] leading-relaxed">
                {isFr
                  ? 'Oui, les archives familiales sont conservées de manière sécurisée et optimisée pour assurer une transmission patrimoniale durable aux futures générations.'
                  : 'Yes, family archives are securely stored and preserved to ensure enduring heritage transmission for future generations.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
