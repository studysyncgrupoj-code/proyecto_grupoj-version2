import { auth } from '@/auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { PersonalDataSection } from './PersonalDataSection';
import { PreferencesSection } from './PreferencesSection';
import { PrivacySection } from './PrivacySection';
import { ProfileSection } from './ProfileSection';

export async function generateMetadata() {
  const t = await getTranslations('dashboard.userSettings.metadata');
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, googleBot: { index: false, follow: false } },
  };
}

export default async function ProfilePage() {
  const [session, t, locale] = await Promise.all([
    auth(),
    getTranslations('dashboard.userSettings.page'),
    getLocale(),
  ]);

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  // session.user se limita a id, role y error (ver src/auth.ts).
  // Los datos de presentación (nombre, correo, imagen, plan) los entrega
  // el BFF vía GraphQL dentro de ProfileSection.
  const { role } = session.user;

  const showSubscription = role === 'student';
  const showCertificates = role === 'student';
  const showCourses = role === 'student' || role === 'teacher';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-6">
        <h1 className="text-foreground text-2xl font-semibold">{t('title')}</h1>
        <p className="text-foreground-muted mt-1 text-sm">{t('description')}</p>
      </header>

      <div className="grid gap-6">
        <ProfileSection showCertificates={showCertificates} />

        {/* 2. Personal Data */}
        <PersonalDataSection />

        {/* 3. Security */}
        {showCourses && <>{/* 5. Courses */}</>}

        {/* 6. Preferences */}
        <PreferencesSection />

        <PrivacySection />

        {showSubscription && <>{/* Plan / Subscription */}</>}
        {/* 7. Account */}
      </div>
    </div>
  );
}
