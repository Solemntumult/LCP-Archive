import Link from 'next/link';
import {
  Users,
  GitFork,
  Crown,
  MapPin,
  PlusCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Archive,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/genealogy';
import { getActivityLogs, getAllPersons, getAllEvents } from '@/lib/db';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import HintCard from '@/components/dashboard/HintCard';
import RecentGallery from '@/components/dashboard/RecentGallery';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const allPersons = getAllPersons();
  const stats = getDashboardStats(allPersons);
  const activities = getActivityLogs(8);
  const events = getAllEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#173124] via-[#234332] to-[#2d4739] text-[#fff8f4] p-8 sm:p-10 shadow-xl border border-[#173124]">
        {/* Decorative background watermark */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none">
          <GitFork className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#98b5a3]/20 border border-[#98b5a3]/30 text-xs font-semibold text-[#b0cdbb] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Archive Numérique Vivante • LCP Archives</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Arbre Généalogique & Mémoire Familiale
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#eae1da]/90 font-light leading-relaxed">
            Explorez les racines, l&apos;histoire et les accomplissements de la famille, des patriarches fondateurs aux plus jeunes descendants.
          </p>

          {/* Quick CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/tree"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#fdcea9] text-[#795638] hover:bg-[#ebbe99] shadow-md transition-all active:scale-95"
            >
              <GitFork className="w-4 h-4" />
              <span>Explorer l&apos;arbre interactif</span>
            </Link>

            <Link
              href="/events"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#7a5739] text-white hover:bg-[#5f4024] shadow-md transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Événements & Récits</span>
            </Link>

            <Link
              href="/person/add"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#ffffff]/10 hover:bg-[#ffffff]/20 text-white border border-white/20 backdrop-blur-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajouter un membre</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row (StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Membres Enregistrés"
          value={stats.totalMembers}
          subtitle={`${stats.bloodCount} de sang • ${stats.spousesCount} par alliance`}
          icon={Users}
          colorTheme="green"
        />

        <StatCard
          title="Générations"
          value={stats.generations}
          subtitle={`${stats.patriarchsCount} patriarche${stats.patriarchsCount > 1 ? 's' : ''} racine`}
          icon={GitFork}
          colorTheme="walnut"
        />

        <StatCard
          title="Archives & Récits"
          value={events.length}
          subtitle="Chroniques & documents historiques"
          icon={Archive}
          colorTheme="gold"
        />

        <StatCard
          title="Lieux & Villes d'Origine"
          value={stats.originPlaces.length}
          subtitle={stats.originPlaces.slice(0, 2).join(', ') || 'Bénin, Afrique'}
          icon={MapPin}
          colorTheme="blue"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Activity + Archive Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <ActivityFeed activities={activities} />
          <RecentGallery events={events} />
        </div>

        {/* Right column: Hints + Overview (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <HintCard hints={stats.missingDataHints} />

          {/* Quick Info Card */}
          <div className="bg-gradient-to-br from-[#fbf2eb] to-[#f5ece5] p-6 rounded-2xl border border-[#eae1da] vintage-shadow">
            <h3 className="font-serif font-bold text-lg text-[#1f1b17] mb-2 flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#7a5739]" />
              Patriarches & Origines
            </h3>
            <p className="text-sm text-[#424844] leading-relaxed mb-4">
              L&apos;arbre prend racine avec les premières générations fondatrices. Chaque membre enrichit la transmission de la mémoire collective dans LCP Archives.
            </p>

            <div className="space-y-2.5">
              <Link
                href="/tree"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#eae1da] text-sm font-semibold text-[#173124] hover:bg-[#173124] hover:text-white transition-all group"
              >
                <span className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-[#7a5739] group-hover:text-white" />
                  Accéder à la vue générale de l&apos;arbre
                </span>
                <ArrowRight className="w-4 h-4 text-[#727973] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/person/1"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#eae1da] text-sm font-semibold text-[#7a5739] hover:bg-[#7a5739] hover:text-white transition-all group"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#7a5739] group-hover:text-white" />
                  Consulter la biographie du Patriarche Paul
                </span>
                <ArrowRight className="w-4 h-4 text-[#727973] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
