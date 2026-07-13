'use client';

interface InstaFeedMetaFieldsProps {
  clientName: string;
  caption: string;
  published: boolean;
  onClientNameChange: (name: string) => void;
  onCaptionChange: (caption: string) => void;
  onPublishedChange: (published: boolean) => void;
  disabled?: boolean;
}

/** Champs méta d'un feed : nom du client (affiché sous le feed), légende, publication. */
export default function InstaFeedMetaFields({
  clientName, caption, published, onClientNameChange, onCaptionChange, onPublishedChange, disabled,
}: InstaFeedMetaFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="feed-client" className="text-sm font-medium text-white/80">Nom du client</label>
        <input
          id="feed-client"
          type="text"
          value={clientName}
          onChange={(e) => onClientNameChange(e.target.value)}
          disabled={disabled}
          placeholder="Affiché sous le feed sur la home"
          className="w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="feed-caption" className="text-sm font-medium text-white/80">Légende (optionnel)</label>
        <input
          id="feed-caption"
          type="text"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          disabled={disabled}
          placeholder="Repère interne, non affiché sur la home"
          className="w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => onPublishedChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm text-white/80">Publié (visible sur la home)</span>
      </label>
    </>
  );
}
