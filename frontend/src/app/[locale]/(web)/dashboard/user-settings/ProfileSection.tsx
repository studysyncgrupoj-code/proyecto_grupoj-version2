import { SectionCard } from '@/components/ui/SectionCard';
import type { ValidationDict } from '@/lib/validation';
import { getMessages, getTranslations } from 'next-intl/server';
import { CertificateEligibility } from './CertificateEligibility';
import { ProfileAvatarSettings } from './ProfileAvatarSettings';
import { ProfileFormClient } from './ProfileFormClient';

interface ProfileSectionProps {
  showCertificates: boolean;
}

export async function ProfileSection({
  showCertificates,
}: ProfileSectionProps) {
  const [avatarT, pageT, certT, allMessages] = await Promise.all([
    getTranslations('dashboard.userSettings.avatar'),
    getTranslations('dashboard.userSettings.page'),
    getTranslations('dashboard.userSettings.certificates'),
    getMessages(),
  ]);

  const avatarMessages = {
    fallbackName: pageT('fallbackName'),
    fallbackEmail: pageT('fallbackEmail'),
    title: avatarT('title'),
    description: avatarT('description'),
    changeAria: avatarT('changeAria'),
    uploadAria: avatarT('uploadAria'),
    save: avatarT('save'),
    saving: avatarT('saving'),
    cancel: avatarT('cancel'),
    change: avatarT('change'),
    upload: avatarT('upload'),
    remove: avatarT('remove'),
    limit: avatarT('limit'),
    previewTitle: avatarT('previewTitle'),
    visibility: avatarT('visibility'),
    saved: avatarT('saved'),
    removed: avatarT('removed'),
    errors: {
      unsupportedType: avatarT('errors.unsupportedType'),
      fileTooLarge: avatarT('errors.fileTooLarge'),
      uploadFailed: avatarT('errors.uploadFailed'),
      removeFailed: avatarT('errors.removeFailed'),
    },
  };

  const certificateMessages = {
    title: certT('title'),
    description: certT('description'),
    eligible: certT('eligible'),
    pending: certT('pending'),
    avatar: certT('avatar'),
    personalData: certT('personalData'),
    verified: certT('verified'),
    comingSoon: certT('comingSoon'),
  };

  const profileT = allMessages.dashboard.userSettings.profile;
  const profileMessages = {
    fields: {
      bio: profileT.fields.bio,
      interests: profileT.fields.interests,
    },
    actions: profileT.actions,
    successMessage: profileT.successMessage,
    errors: profileT.errors,
  };
  const validation = allMessages.Validation as ValidationDict;

  return (
    <>
      <ProfileAvatarSettings messages={avatarMessages} />

      {showCertificates && (
        <CertificateEligibility messages={certificateMessages} />
      )}

      <SectionCard title={profileT.title} description={profileT.description}>
        <ProfileFormClient messages={profileMessages} validation={validation} />
      </SectionCard>
    </>
  );
}
