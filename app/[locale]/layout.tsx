import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProgressProvider } from '@/components/providers';
import { AppShell } from '@/components/app-shell';
import { localeSchema } from '@/lib/types';
import '../globals.css';
import '../merhele.css';
const site =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://level-up.example');
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'Mərhələ — Business Analysis & Product Ownership', template: '%s | Mərhələ' },
  description:
    'A guided learning space for business analysts and product owners. Original lessons, practical roadmaps, and certification practice in English, with an English–Azerbaijani term helper.',
  openGraph: {
    type: 'website',
    siteName: 'Mərhələ',
    title: 'Mərhələ — Choose your level. Set your goal.',
    description:
      'From curiosity to capability. Learn business analysis and product ownership, one step at a time.',
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image' },
};
export function generateStaticParams() {
  return [{ locale: 'en' }];
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const parsed = localeSchema.safeParse(raw);
  if (!parsed.success || parsed.data !== 'en') notFound();
  const locale = parsed.data;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ProgressProvider>
          <AppShell locale={locale}>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
