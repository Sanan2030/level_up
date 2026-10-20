import { OnboardingView } from '@/components/learning';
import { getLocale } from '@/lib/i18n';
export const metadata = { title: 'Your learning path' };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OnboardingView locale={getLocale(locale)} />;
}
