const FAVORITES_KEY = 'ecommerce-favorites';

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(productId: number): void {
  const favorites = getFavorites();
  if (!favorites.includes(productId)) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, productId]));
    window.dispatchEvent(new Event('favorites-changed'));
  }
}

export function removeFavorite(productId: number): void {
  const favorites = getFavorites();
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites.filter(id => id !== productId))
  );
  window.dispatchEvent(new Event('favorites-changed'));
}

export function toggleFavorite(productId: number): void {
  const favorites = getFavorites();
  if (favorites.includes(productId)) {
    removeFavorite(productId);
  } else {
    addFavorite(productId);
  }
}

export function isFavorite(productId: number): boolean {
  return getFavorites().includes(productId);
}
