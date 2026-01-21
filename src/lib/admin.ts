/**
 * Configuration des administrateurs autorisés
 *
 * IMPORTANT: Remplacez "<TODO_UID>" par votre UID Firebase Admin
 * Pour obtenir votre UID:
 * 1. Créez un compte dans Firebase Console
 * 2. Dans Authentication > Users, copiez l'UID de votre compte
 * 3. Collez-le ici dans le tableau ADMIN_UIDS
 */

export const ADMIN_UIDS: string[] = [
  "ugQ2cJ4Y23fEwHFe4XrFeX3xcbO2", // ⚠️ À REMPLACER par votre UID Firebase
  // Exemple: "xXyZ1234abcd5678efgh9012ijkl3456"
  // Vous pouvez ajouter plusieurs UIDs si nécessaire
];

/**
 * Vérifie si un UID correspond à un administrateur autorisé
 * @param uid - L'UID Firebase de l'utilisateur
 * @returns true si l'utilisateur est admin, false sinon
 */
export function isAdminUid(uid?: string | null): boolean {
  if (!uid) return false;
  return ADMIN_UIDS.includes(uid);
}
