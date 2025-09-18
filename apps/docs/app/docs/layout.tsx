import type { ReactNode } from 'react';
import { ArcDocsLayout } from '@/components/arc';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ArcDocsLayout tree={source.pageTree}>
      {children}
    </ArcDocsLayout>
  );
}
