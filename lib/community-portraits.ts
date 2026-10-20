const COMMUNITY_PORTRAITS = [
  "/images/comunidad/kevin-equipo.jpg",
  "/images/comunidad/vecino_2.jpg",
  "/images/comunidad/vecino_3.jpg",
  "/images/comunidad/vecino_5.jpg",
];

export function getCommunityPortrait(identity: string): string {
  const normalized = identity.trim().toLowerCase();
  const hash = Array.from(normalized).reduce((total, character) => total + character.charCodeAt(0), 0);
  return COMMUNITY_PORTRAITS[hash % COMMUNITY_PORTRAITS.length];
}
