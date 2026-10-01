import { auth } from '@/auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { CertificateEligibility } from './CertificateEligibility';
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
  const [session, t, certT, locale] = await Promise.all([
    auth(),
    getTranslations('dashboard.userSettings.page'),
    getTranslations('dashboard.userSettings.certificates'),
    getLocale(),
  ]);

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const { role, subscription, image } = session.user;

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
        <ProfileSection
          user={{
            name: session.user.name ?? t('fallbackName'),
            email: session.user.email ?? t('fallbackEmail'),
            role: session.user.role,
            image: session.user.image,
          }}
        />

        {showCertificates && (
          <CertificateEligibility
            hasAvatar={!!image}
            messages={{
              title: certT('title'),
              description: certT('description'),
              eligible: certT('eligible'),
              pending: certT('pending'),
              avatar: certT('avatar'),
              personalData: certT('personalData'),
              verified: certT('verified'),
              comingSoon: certT('comingSoon'),
            }}
          />
        )}

        {/* 2. Personal Data */}
        {/* 3. Security */}
        {showCourses && <>{/* 5. Courses */}</>}
        {/* 6. Preferences */}
        {showSubscription && <>{/* Plan / Subscription */}</>}
        {/* 7. Account */}
      </div>
    </div>
  );
}
