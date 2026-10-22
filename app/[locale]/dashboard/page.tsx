import { Dashboard } from '@/components/dashboard';
import { getLocale } from '@/lib/i18n';
export const metadata = { title: 'My dashboard' };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Dashboard locale={getLocale(locale)} />;
}
