'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { setupPaystackAccount } from '@/lib/actions/user.actions';

const PaystackLink = ({ user }: { user: User }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      const result = await setupPaystackAccount({
        id: user.id || user.$id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      if (result) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error setting up Paystack account:', error);
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  return (
    <Button onClick={handleConnect} disabled={loading} className="plaidlink-primary w-full">
      {loading ? 'Setting up account...' : 'Create Virtual Account'}
    </Button>
  );
};

export default PaystackLink;
