export type FeaturedWorkItem = {
    type: 'video' | 'branding';
    title: string;
    subtitle: string;
    tag: string;
    href: string;
    imagePoster: string;
    imageHint: string;
    slug?: string;
  };
  
  export const featuredWorkItems: FeaturedWorkItem[] = [
    {
      type: 'video',
      title: 'Ads IA — Cinematic',
      subtitle: 'Publicités haute-fidélité pour un impact maximal.',
      tag: 'Publicités vidéo',
      href: '/portfolio?filter=Vidéo',
      imagePoster: 'https://picsum.photos/seed/ads1/800/600',
      imageHint: 'cinematic ad screenshot',
    },
    {
      type: 'video',
      title: 'UGC Premium',
      subtitle: 'Contenu authentique qui convertit, avec une finition professionnelle.',
      tag: 'Publicités vidéo',
      href: '/portfolio?filter=Vidéo',
      imagePoster: 'https://picsum.photos/seed/ugc1/800/600',
      imageHint: 'UGC style video',
    },
    {
      type: 'branding',
      title: 'Atlas Nutrition',
      subtitle: 'Identité forte pour une marque de compléments alimentaires.',
      tag: 'Branding / Identité',
      href: '/portfolio/atlas-nutrition',
      imagePoster: 'https://cdn.myportfolio.com/4eb49dcb-c1d9-4a71-95f7-d0e0df50a68a/b809c72b-28d7-4856-b892-676fb41de556_rw_1920.jpg?h=c1a0561c41b888fc28da01f286f36bb2',
      imageHint: 'Atlas Nutrition logo',
      slug: 'atlas-nutrition',
    },
    {
      type: 'branding',
      title: 'Outrun Project',
      subtitle: 'Esthétique rétro-futuriste pour un projet musical.',
      tag: 'Branding / Identité',
      href: '/portfolio/outrun-project',
      imagePoster: 'https://storage.googleapis.com/studio-assets/studio-styles-images/outrun.png',
      imageHint: 'Outrun Project logo',
      slug: 'outrun-project',
    },
    {
      type: 'branding',
      title: 'Paideia',
      subtitle: 'Identité inspirée de la philosophie pour une plateforme éducative.',
      tag: 'Branding / Identité',
      href: '/portfolio/paideia',
      imagePoster: 'https://storage.googleapis.com/studio-assets/studio-styles-images/paideia.png',
      imageHint: 'Paideia logo',
      slug: 'paideia',
    },
  ];
  