# She-Says

[中文](README.md) | [English](README_EN.md)

"She-Says" is a platform focused on sharing personal stories and insights, allowing everyone's voice to be heard. This is a modern web application built with [Next.js](https://nextjs.org), designed to provide users with a clean, elegant space for content sharing.

## Project Features

- 🌟 Users can share personal stories and insights
- 👤 Complete user authentication system (registration, login, profile)
- 🏷️ Article tagging and categorization system
- 📱 Responsive design, compatible with various devices
- 🎨 Beautiful UI design, providing a comfortable reading experience

## Tech Stack

- **Frontend Framework**: Next.js 15.x (React 19)
- **Styling**: Tailwind CSS, DaisyUI
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM (SQLite)
- **Deployment**: Can be deployed on Vercel or other platforms

## Getting Started

### Requirements

- Node.js 18.18.0 or higher
- npm, yarn, or pnpm package manager

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/zym9863/she-says.git
cd she-says
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables

Create a `.env` file and add the necessary environment variables:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

```
she-says/
├── app/                  # Next.js application directory
│   ├── api/              # API routes
│   ├── posts/            # Post-related pages
│   ├── profile/          # User profile pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Homepage
├── components/           # Reusable components
├── lib/                  # Utility functions and libraries
├── prisma/               # Prisma database configuration
└── public/               # Static assets
```

## Learn More

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deployment

The recommended way to deploy your Next.js app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), created by the makers of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
