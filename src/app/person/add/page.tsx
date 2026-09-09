'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AddPersonClientView from '@/components/person/AddPersonClientView';

function AddPersonContent() {
  const searchParams = useSearchParams();
  const parentIdStr = searchParams.get('parent_id');
  const parentGender = searchParams.get('parent_gender') as 'M' | 'F' | null;
  const parentId = parentIdStr ? parseInt(parentIdStr, 10) : undefined;

  return <AddPersonClientView parentId={parentId} parentGender={parentGender || undefined} />;
}

export default function AddPersonPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#727973]">Chargement...</div>}>
      <AddPersonContent />
    </Suspense>
  );
}
