# Indigo Agency Website

This is a Next.js project for the "Indigo" agency, built with a modern technology stack and designed with a premium, futuristic aesthetic.

## Features

- **Modern Stack**: Next.js (App Router), TypeScript, TailwindCSS.
- **Visually Stunning**: "Indigo Nebula" dark theme with gradients, glassmorphism, and fluid animations powered by Framer Motion.
- **Dynamic Content**: Portfolio items and contact form submissions are designed to be managed via Firebase (Firestore, Storage, Auth).
- **Component-Based**: Built with reusable and accessible components from shadcn/ui.
- **Responsive Design**: Fully responsive layout for all devices.
- **Page Structure**:
  - **Home**: An engaging landing page with Hero, Services, Portfolio Preview, and more.
  - **Portfolio**: A filterable grid showcasing the agency's work.
  - **Contact**: A comprehensive form to capture leads.
  - **Admin**: A protected area for managing portfolio content.

## Getting Started

### 1. Installation

First, install the dependencies:

```bash
npm install
```

### 2. Firebase Configuration

This project is configured to use Firebase for backend services.

1.  Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2.  Go to **Project settings** > **General**.
3.  Under "Your apps", click on the Web icon (`</>`) to create a new web app.
4.  Copy the `firebaseConfig` object.
5.  Create a `.env.local` file in the root of the project and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Firestore Data Structure

### `portfolio_items` collection

This collection stores the portfolio projects.

- **Fields**:
  - `title`: (string) Project title
  - `description`: (string) Detailed description
  - `categories`: (array of strings) e.g., ['Automatisation', 'Vidéo']
  - `coverImageURL`: (string) URL from Firebase Storage
  - `tags`: (array of strings) e.g., ['IA', 'UGC']
  - `date`: (timestamp) Project completion date
  - `featured`: (boolean) To feature on the homepage
  - `galleryImages`: (array of strings) URLs for the project gallery

### `leads` collection

This collection stores submissions from the contact form.

- **Fields**:
  - `name`: (string)
  - `company`: (string)
  - `email`: (string)
  - `service`: (string)
  - `budget`: (string)
  - `message`: (string)
  - `submittedAt`: (timestamp)

## Deployment

This app is ready to be deployed to [Firebase Hosting](https://firebase.google.com/docs/hosting). Ensure you have the Firebase CLI installed and configured.
