import { LibraryView } from '@/components/learning';
import { getLocale } from '@/lib/i18n';
export const metadata = { title: 'Lesson library' };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LibraryView locale={getLocale(locale)} />;
}
