'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';
import { getFavorites } from '@/lib/favorites';

export function Header() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setFavCount(getFavorites().length);
    };
    
    updateCount();
    window.addEventListener('favorites-changed', updateCount);
    return () => window.removeEventListener('favorites-changed', updateCount);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-center relative px-4 md:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold">
          EcomStore
        </Link>
        <div className="flex items-center gap-4 absolute right-4 md:right-6 lg:right-8">
          <div className="relative">
            <Heart className="h-5 w-5" />
            {favCount > 0 && (
              <Badge 
                variant="default" 
                className="absolute -right-2 -top-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-indigo-600"
              >
                {favCount}
              </Badge>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
