'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/actions/auth.actions';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const ProfileForm = ({ user, accountsCount }: { user: User; accountsCount: number }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/sign-in');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-18 font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-12 text-gray-500 mb-1">First Name</p>
            <p className="text-14 font-medium text-gray-900">{user.firstName}</p>
          </div>
          <div>
            <p className="text-12 text-gray-500 mb-1">Last Name</p>
            <p className="text-14 font-medium text-gray-900">{user.lastName}</p>
          </div>
          <div>
            <p className="text-12 text-gray-500 mb-1">Email</p>
            <p className="text-14 font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-12 text-gray-500 mb-1">Date of Birth</p>
            <p className="text-14 font-medium text-gray-900">{user.dateOfBirth || 'Not provided'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-12 text-gray-500 mb-1">Address</p>
            <p className="text-14 font-medium text-gray-900">
              {user.address ? `${user.address}, ${user.city || ''} ${user.postalCode || ''}` : 'Not provided'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-18 font-semibold text-gray-900 mb-4">Account Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-12 text-gray-500 mb-1">Linked Bank Accounts</p>
            <p className="text-14 font-medium text-gray-900">{accountsCount}</p>
          </div>
          <div>
            <p className="text-12 text-gray-500 mb-1">Account Status</p>
            <p className="text-14 font-medium text-green-600">Active</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h2 className="text-18 font-semibold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-14 text-gray-600 mb-4">
          Sign out of your account. You can always sign back in later.
        </p>
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full sm:w-auto"
        >
          {isLoggingOut ? (
            <>
              <Loader2 size={16} className="animate-spin" /> &nbsp; Signing out...
            </>
          ) : (
            'Sign Out'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
