'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(product.id));
    
    const handleFavoritesChange = () => {
      setFavorite(isFavorite(product.id));
    };
    
    window.addEventListener('favorites-changed', handleFavoritesChange);
    return () => window.removeEventListener('favorites-changed', handleFavoritesChange);
  }, [product.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(product.id);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group h-full hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 ${
                favorite ? 'text-red-500' : 'text-gray-400'
              } hover:text-red-500 bg-white/80 hover:bg-white/90`}
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge variant="outline">★ {product.rating}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.discountPercentage > 0 && (
              <Badge className="bg-green-500">{product.discountPercentage}% off</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
