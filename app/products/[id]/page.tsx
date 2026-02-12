'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProduct } from '@/lib/api';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Heart, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const id = parseInt(params.id as string);
        const data = await getProduct(id);
        setProduct(data);
        setFavorite(isFavorite(data.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  useEffect(() => {
    if (!product) return;
    
    const handleFavoritesChange = () => {
      setFavorite(isFavorite(product.id));
    };
    
    window.addEventListener('favorites-changed', handleFavoritesChange);
    return () => window.removeEventListener('favorites-changed', handleFavoritesChange);
  }, [product]);

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product.id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-muted-foreground">{error || 'Product not found'}</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === index
                    ? 'border-indigo-600 ring-2 ring-indigo-600'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 12.5vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-4xl font-bold">{product.title}</h1>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={favorite ? 'text-red-500' : 'text-gray-400'}
              >
                <Heart className={`h-6 w-6 ${favorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground text-sm">/ 5</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">${product.price}</span>
            {product.discountPercentage > 0 && (
              <Badge className="bg-green-500 text-lg px-3 py-1">
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-medium">
                    {product.stock > 0 ? (
                      <span className="text-green-600">{product.stock} available</span>
                    ) : (
                      <span className="text-red-600">Out of stock</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date Added</p>
                  <p className="font-medium">
                    {format(new Date(product.dateAdded), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Product ID</p>
                  <p className="font-medium">#{product.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" size="lg">
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
