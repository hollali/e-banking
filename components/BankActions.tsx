'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { unlinkBankAccount } from '@/lib/actions/user.actions';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const BankActions = ({ bankId, userId }: { bankId: string; userId: string }) => {
  const router = useRouter();
  const [isUnlinking, setIsUnlinking] = useState(false);

  const handleUnlink = async () => {
    if (!confirm('Are you sure you want to unlink this bank account? This action cannot be undone.')) {
      return;
    }

    setIsUnlinking(true);
    const result = await unlinkBankAccount({ bankId, userId });
    if (result && 'error' in result) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsUnlinking(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUnlink}
      disabled={isUnlinking}
      className="text-red-600 border-red-200 hover:bg-red-50"
    >
      {isUnlinking ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        'Unlink'
      )}
    </Button>
  );
};

export default BankActions;
