import React from 'react';
import type { Metadata } from 'next';
import HelpPageView from '@/components/help/HelpPageView';

export const metadata: Metadata = {
  title: 'Guide & Aide ? LCP Archives',
  description: 'Tutoriel interactif et guide de lecture de l\'arbre g?n?alogique par foyer et des archives familiales.',
};

export default function HelpPage() {
  return <HelpPageView />;
}
