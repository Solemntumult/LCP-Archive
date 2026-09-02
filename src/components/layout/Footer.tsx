import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#173124] text-white border-t-4 border-[#7a5739] mt-24 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 pb-10 border-b border-white/15">
          {/* Col 1: Brand & Legacy (2 cols on md) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0">
                <Image
                  src="/icon.svg"
                  alt="LCP Archives Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif font-black text-2xl text-white tracking-tight">
                  LCP Archives
                </span>
                <p className="text-xs text-[#b0cdbb] font-medium">
                  Plateforme Officielle de Mémoire & Généalogie
                </p>
              </div>
            </div>

            <p className="text-sm text-[#d8e5dc] leading-relaxed max-w-md font-light">
              « Les racines d&apos;une famille nourrissent l&apos;arbre de l&apos;avenir. » — Préservation vivante de l&apos;histoire, des alliances et de la transmission intergénérationnelle.
            </p>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#fdcea9] tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#d8e5dc]">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Tableau de bord</span>
                </Link>
              </li>
              <li>
                <Link href="/tree" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Arbre généalogique</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Événements & Récits</span>
                </Link>
              </li>
              <li>
                <Link href="/person/add" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Ajouter un membre</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Archives & Mémoire */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#fdcea9] tracking-wide">
              Patrimoine & Histoire
            </h4>
            <ul className="space-y-2 text-sm text-[#d8e5dc]">
              <li>
                <Link href="/person/1" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Patriarche Paul LISSANON</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#fdcea9]" />
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  <span>Chroniques & Récits d&apos;époque</span>
                </Link>
              </li>
              <li>
                <Link href="/tree" className="hover:text-white transition-colors">
                  <span>Lignées et Alliances</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#98b5a3]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#fdcea9]" />
            <span>Archives familiales privées — Données historiques protégées</span>
          </div>

          <p className="text-center sm:text-right">
            © {currentYear} <strong>LCP Archives</strong>. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
