import { GlossaryView } from '@/components/learning';
import { getLocale } from '@/lib/i18n';
export const metadata = { title: 'BA & PO glossary' };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GlossaryView locale={getLocale(locale)} />;
}
