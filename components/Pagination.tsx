'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: 'prev' | 'next') => {
    const nextPage = direction === 'prev' ? page - 1 : page + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPage.toString(),
    });
    router.push(newUrl, { scroll: false });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        size="sm"
        variant="outline"
        disabled={page <= 1}
        onClick={() => handleNavigation('prev')}
        className="flex items-center gap-2"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>
      <p className="text-14 flex items-center gap-1">
        <span className="font-semibold">{page}</span>
        <span className="text-gray-600">/ {totalPages}</span>
      </p>
      <Button
        size="sm"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => handleNavigation('next')}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default Pagination;
