# Via Stays - Admin Dashboard

A high-end admin dashboard built with Next.js, Tailwind CSS, Shadcn/UI, and TanStack Query.

## Features

✨ **Luxury Minimalist Design**

- Elegant off-white/cream background (#F9F8F6)
- Rust/burnt orange accent color (#A83D0F)
- Serif fonts (Playfair Display) for headers
- Sans-serif fonts (Inter) for UI elements
- High border-radius (24px) for premium feel
- Generous whitespace and padding

🔐 **Authentication**

- Secure login with JWT tokens
- Password reset functionality
- Token-based API authentication
- Auto-redirect based on auth status

👥 **User Management**

- List all users with pagination
- Quick actions: Ban/Unban users
- Edit user roles (Admin/User)
- Toggle user status (Active/Inactive)
- Real-time updates with TanStack Query

📧 **Contact/Inquiry Management**

- View all customer inquiries
- Filter by status (Pending/Reviewed/Responded)
- Mark inquiries as reviewed automatically
- Update status with dropdown
- Detailed inquiry view dialog

📰 **Newsletter Management**

- List all subscribers
- View subscription status
- Statistics dashboard

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI
- **State Management:** TanStack Query
- **HTTP Client:** Axios
- **Notifications:** Sonner (Toast)
- **Icons:** Lucide React
- **Fonts:** Playfair Display (Serif), Inter (Sans-serif)

## Getting Started

First, install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env.local
```

Update the API base URL in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
eyoot-dashboard/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── dashboard-sidebar.tsx
│   ├── providers.tsx
│   └── toast-provider.tsx
├── lib/
│   ├── api-client.ts      # Axios setup
│   ├── types.ts           # TypeScript types
│   ├── auth.ts            # Auth hooks
│   ├── users.ts           # User management
│   ├── contacts.ts        # Contact/inquiry
│   └── newsletter.ts      # Newsletter
└── public/
```

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/reset-password` - Password reset

### User Management

- `GET /admin/list-users` - List all users
- `POST /admin/ban-user` - Ban/unban user
- `POST /admin/edit-role` - Change user role
- `POST /admin/edit-status` - Change user status

### Contact/Inquiry

- `GET /contact/list` - List all inquiries
- `POST /contact/update` - Update inquiry status

### Newsletter

- `GET /newsletter/list` - List all subscribers

## Color Palette

- **Primary Accent (Rust):** #A83D0F
- **Background (Cream):** #F9F8F6
- **Surface (White):** #FFFFFF
- **Primary Text (Charcoal):** #1A1A1A
- **Secondary Text (Gray):** #717171

## License

This project is private and proprietary.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
