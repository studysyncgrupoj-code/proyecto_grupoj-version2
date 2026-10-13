'use client';

import { useSidebarData } from '@/components/layout/dashboard/sidebar/useSidebarData';
import { useTranslations } from 'next-intl';
import { CertificateEligibility } from './CertificateEligibility';
import { ProfileAvatarSettings } from './ProfileAvatarSettings';

type UserRole = 'student' | 'teacher' | 'admin';

interface PageMessages {
  fallbackName: string;
  fallbackEmail: string;
}

interface AvatarMessages {
  title: string;
  description: string;
  changeAria: string;
  uploadAria: string;
  save: string;
  saving: string;
  cancel: string;
  change: string;
  upload: string;
  remove: string;
  limit: string;
  previewTitle: string;
  visibility: string;
  saved: string;
  removed: string;
  errors: {
    unsupportedType: string;
    fileTooLarge: string;
    uploadFailed: string;
    removeFailed: string;
  };
}

interface CertificateMessages {
  title: string;
  description: string;
  eligible: string;
  pending: string;
  avatar: string;
  personalData: string;
  verified: string;
  comingSoon: string;
}

interface ProfileSectionProps {
  role: UserRole;
  pageMessages: PageMessages;
  avatarMessages: AvatarMessages;
  certificateMessages: CertificateMessages;
  showCertificates: boolean;
}

export function ProfileSection({
  role,
  pageMessages,
  avatarMessages,
  certificateMessages,
  showCertificates,
}: ProfileSectionProps) {
  const rolesT = useTranslations('dashboard.navigation.roles');
  const { isLoading, name, email, image } = useSidebarData();

  const roleKey =
    role === 'admin' ? 'admin' : role === 'teacher' ? 'professor' : 'student';
  const roleLabel = rolesT(roleKey);

  // Primer frame: mientras el BFF responde, no renderizamos el bloque.
  // Evita parpadeo entre "sin datos" y "con datos reales".
  if (isLoading) {
    return null;
  }

  const displayName = name ?? pageMessages.fallbackName;
  const displayEmail = email ?? pageMessages.fallbackEmail;

  return (
    <>
      <ProfileAvatarSettings
        name={displayName}
        email={displayEmail}
        roleLabel={roleLabel}
        image={image}
        messages={avatarMessages}
      />

      {showCertificates && (
        <CertificateEligibility
          hasAvatar={!!image}
          messages={certificateMessages}
        />
      )}
    </>
  );
}
