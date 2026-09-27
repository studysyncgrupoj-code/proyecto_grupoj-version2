import { auth } from '@/auth';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CertificateEligibility } from './CertificateEligibility';
import { ProfileSection } from './ProfileSection';

export const metadata: Metadata = {
  title: 'Mi perfil | StudySync',
  robots: { index: false, googleBot: { index: false, follow: false } },
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { role, subscription, image } = session.user;

  const showSubscription = role === 'student';
  const showCertificates = role === 'student';
  const showCourses = role === 'student' || role === 'teacher';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-6">
        <h1 className="text-foreground text-2xl font-semibold">
          Configuración de la cuenta
        </h1>
        <p className="text-foreground-muted mt-1 text-sm">
          Gestiona tu perfil, seguridad y preferencias.
        </p>
      </header>

      <div className="grid gap-6">
        <ProfileSection
          user={{
            name: session.user.name ?? 'Usuario',
            email: session.user.email ?? '',
            role: session.user.role,
            image: session.user.image,
          }}
        />

        {showCertificates && <CertificateEligibility hasAvatar={!!image} />}

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
