import { redirect } from 'next/navigation';

// L'ancienne landing page affichait les offres obsolètes (490-1490 €).
// La home est désormais le funnel officiel — on redirige pour que les
// anciennes campagnes Meta pointant sur /lp atterrissent au bon endroit.
export default function LandingPage() {
  redirect('/');
}
