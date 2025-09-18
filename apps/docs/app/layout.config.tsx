import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import logoCommerceKit from '@/app/(home)/assets/logo-arc.png';
/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex flex-col items-center gap-2">
        <Image
          src={logoCommerceKit}
          alt="Arc Logo"
          width={160}
          height={160}
          className="w-[160px] h-[160px] translate-x-[-40px]"
        />
        <div className="flex flex-col text-left space-y-2 mb-4">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">ARC</span>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 translate-y-[-5px] p-1 py-0.5 border border-zinc-300 dark:border-zinc-800 rounded-md font-mono">0.1.0</div>
          </div>
          <span className="text-[14px] text-zinc-500 dark:text-zinc-400">A comprehensive React SDK that simplifies building modern Solana applications.</span>
        </div>
      </div>
    ),
  },
};
