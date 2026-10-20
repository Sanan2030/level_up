import { Dashboard } from '@/components/dashboard';
import { getLocale } from '@/lib/i18n';
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Dashboard locale={getLocale(locale)} />;
}
