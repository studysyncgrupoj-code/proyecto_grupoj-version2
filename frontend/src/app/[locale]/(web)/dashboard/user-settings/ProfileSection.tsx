import { AVATAR_ERROR_CODES } from '@/lib/avatarErrors';
import { getTranslations } from 'next-intl/server';
import { ProfileAvatarSettings } from './ProfileAvatarSettings';

interface ProfileSectionProps {
  user: {
    name: string;
    email: string;
    role?: string;
    image?: string | null;
  };
}

export async function ProfileSection({ user }: ProfileSectionProps) {
  const [rolesT, t] = await Promise.all([
    getTranslations('dashboard.navigation.roles'),
    getTranslations('dashboard.userSettings.avatar'),
  ]);
  const roleKey =
    user.role === 'admin'
      ? 'admin'
      : user.role === 'teacher'
        ? 'professor'
        : 'student';
  const roleLabel = rolesT(roleKey);
  const messages = {
    title: t('title'),
    description: t('description'),
    changeAria: t('changeAria'),
    uploadAria: t('uploadAria'),
    save: t('save'),
    saving: t('saving'),
    cancel: t('cancel'),
    change: t('change'),
    upload: t('upload'),
    remove: t('remove'),
    limit: t('limit'),
    previewTitle: t('previewTitle'),
    visibility: t('visibility'),
    saved: t('saved'),
    removed: t('removed'),
    errors: Object.fromEntries(
      AVATAR_ERROR_CODES.map((code) => [code, t(`errors.${code}`)]),
    ) as Record<(typeof AVATAR_ERROR_CODES)[number], string>,
  };

  return (
    <ProfileAvatarSettings
      name={user.name}
      email={user.email}
      roleLabel={roleLabel}
      image={user.image}
      messages={messages}
    />
  );
}
