/**
 * Portfolio Editor Data Model
 *
 * Strict hierarchy: Project → Sections → Blocks
 * This model is serializable, versionable, and designed for long-term maintainability
 */

// ============================================================================
// BLOCK TYPES
// ============================================================================

export type BlockType = 'image' | 'video' | 'gallery' | 'text';

export type AspectRatio = 'auto' | '1:1' | '4:5' | '16:9' | '21:9' | '3:4';

export type VerticalAlign = 'top' | 'center' | 'stretch';

export type GalleryDisplayMode = 'grid' | 'masonry' | 'slider';

export type VideoSource = 'upload' | 'youtube' | 'vimeo';

/**
 * Base block interface - all blocks extend this
 */
export interface BaseBlock {
  id: string;
  type: BlockType;
  ratio: AspectRatio;
  borderRadius: number;
  padding: number;
  background?: string;
  shadow?: string;
  hoverEffect?: boolean;
}

/**
 * Image Block
 */
export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt?: string;
  caption?: string;
  lightbox: boolean;
  objectFit: 'cover' | 'contain';
  position?: { x: number; y: number };
}

/**
 * Video Block
 */
export interface VideoBlock extends BaseBlock {
  type: 'video';
  source: VideoSource;
  src: string;
  poster?: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
}

/**
 * Gallery Block - single block containing multiple images
 */
export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: Array<{
    id: string;
    src: string;
    alt?: string;
    caption?: string;
  }>;
  displayMode: GalleryDisplayMode;
  gap: number;
  columns?: number; // for grid mode
}

/**
 * Text Block
 */
export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // HTML content
  textAlign: 'left' | 'center' | 'right';
  fontSize?: number;
  lineHeight?: number;
}

/**
 * Union type of all block types
 */
export type Block = ImageBlock | VideoBlock | GalleryBlock | TextBlock;

// ============================================================================
// SECTION
// ============================================================================

/**
 * Section - controls layout and spacing
 * Blocks never control their own width
 */
export interface Section {
  id: string;
  columns: 1 | 2 | 3 | 4;
  gap: number; // horizontal gap between blocks
  marginTop: number;
  marginBottom: number;
  verticalAlign: VerticalAlign;
  blocks: Block[];
  responsiveOverrides?: {
    tablet?: Partial<Pick<Section, 'columns' | 'gap'>>;
    mobile?: Partial<Pick<Section, 'columns' | 'gap'>>;
  };
}

// ============================================================================
// PROJECT
// ============================================================================

/**
 * Project - top-level container
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  coverImage: string;
  coverPosition?: string;
  tags: string[];
  featured: boolean;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  version: number; // for future migrations
}

// ============================================================================
// EDITOR STATE
// ============================================================================

/**
 * Editor state management
 */
export interface EditorState {
  project: Project;
  selectedSectionId: string | null;
  selectedBlockId: string | null;
  isDragging: boolean;
  draggedItem: {
    type: 'section' | 'block';
    id: string;
  } | null;
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a new empty project
 */
export function createEmptyProject(): Project {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    coverImage: '',
    coverPosition: 'center',
    tags: [],
    featured: false,
    sections: [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

/**
 * Create a default section (1 column)
 */
export function createDefaultSection(): Section {
  return {
    id: crypto.randomUUID(),
    columns: 1,
    gap: 24,
    marginTop: 40,
    marginBottom: 40,
    verticalAlign: 'top',
    blocks: [],
  };
}

/**
 * Create a new section with specified columns
 */
export function createSection(columns: 1 | 2 | 3 | 4): Section {
  return {
    id: crypto.randomUUID(),
    columns,
    gap: 24,
    marginTop: 40,
    marginBottom: 40,
    verticalAlign: 'top',
    blocks: [],
  };
}

/**
 * Create a new image block
 */
export function createImageBlock(): ImageBlock {
  return {
    id: crypto.randomUUID(),
    type: 'image',
    src: '',
    alt: '',
    caption: '',
    ratio: 'auto',
    borderRadius: 8,
    padding: 0,
    lightbox: false,
    objectFit: 'cover',
  };
}

/**
 * Create a new video block
 */
export function createVideoBlock(): VideoBlock {
  return {
    id: crypto.randomUUID(),
    type: 'video',
    source: 'upload',
    src: '',
    poster: '',
    ratio: '16:9',
    borderRadius: 8,
    padding: 0,
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
  };
}

/**
 * Create a new gallery block
 */
export function createGalleryBlock(): GalleryBlock {
  return {
    id: crypto.randomUUID(),
    type: 'gallery',
    images: [],
    displayMode: 'grid',
    gap: 16,
    columns: 3,
    ratio: 'auto',
    borderRadius: 8,
    padding: 0,
  };
}

/**
 * Create a new text block
 */
export function createTextBlock(): TextBlock {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    content: '<p>Enter your text here...</p>',
    textAlign: 'left',
    ratio: 'auto',
    borderRadius: 0,
    padding: 16,
  };
}

/**
 * Create a block by type
 */
export function createBlock(type: BlockType): Block {
  switch (type) {
    case 'image':
      return createImageBlock();
    case 'video':
      return createVideoBlock();
    case 'gallery':
      return createGalleryBlock();
    case 'text':
      return createTextBlock();
  }
}
