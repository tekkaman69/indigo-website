# **App Name**: Indigo Nebula

## Core Features:

- Sticky Navbar with CTA: A persistent navigation bar with 'Indigo' logo, page anchors, and a 'Request a Quote' call to action.
- Home Hero Section: An engaging hero section with a title, subtitle, primary and secondary CTAs, and subtle animations.
- Service Cards with Accordion/Tabs: Elegant cards presenting agency services with details revealed via accordion or tabs. Animated on scroll and hover.
- Portfolio Preview: Displays a preview of portfolio items on the home page, linking to the full portfolio.
- Filtered Portfolio Grid: A portfolio grid, filterable by category, displaying items fetched from Firestore.
- Portfolio Item Management: Admin interface (Firebase Auth protected) to add, edit, and delete portfolio items and upload images to Storage.
- Contact Form Submission to Firestore: Form to collect user information (name, company, email, etc.) and store it in Firestore.

## Style Guidelines:

- Background color: Dark blue-black (#070815) to evoke a nebula-like atmosphere.
- Card background color: Semi-transparent white (rgba(255,255,255,0.06)) for a glassmorphism effect.
- Primary accent color: Indigo (#4F46E5) for highlights and interactive elements.
- Font: 'Inter' (sans-serif) for a modern and readable aesthetic. Note: currently only Google Fonts are supported.
- Use 'lucide-react' icons throughout the site for a consistent and clean appearance.
- Employ glassmorphism on cards with rounded corners (16-24px), soft shadows, and translucent borders.
- Utilize Framer Motion for page transitions (fade + slide), scroll reveal effects, and hover micro-interactions.