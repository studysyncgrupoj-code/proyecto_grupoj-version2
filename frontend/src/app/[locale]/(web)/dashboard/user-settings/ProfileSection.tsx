import { getRoleNavigation } from '@/config/dashboard-navigation';
import { ProfileAvatarSettings } from './ProfileAvatarSettings';

interface ProfileSectionProps {
  user: {
    name: string;
    email: string;
    role?: string;
    image?: string | null;
  };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { roleLabel } = getRoleNavigation(user.role);

  return (
    <ProfileAvatarSettings
      name={user.name}
      email={user.email}
      roleLabel={roleLabel}
      image={user.image}
    />
  );
}
