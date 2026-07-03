'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/actions/auth.actions';

const SidebarFooter = ({ user }: { user: User }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/sign-in');
  };

  return (
    <footer className="footer">
      <div className="footer_name">
        <p className="text-xl font-bold text-gray-700">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </p>
      </div>
      <div className="footer_email">
        <h1 className="text-14 truncate font-semibold text-gray-700">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-12 truncate font-normal text-gray-600">{user.email}</p>
      </div>
      <div className="footer_image" onClick={handleLogout}>
        <Image src="/icons/logout.svg" fill alt="logout" />
      </div>
    </footer>
  );
};

export default SidebarFooter;
