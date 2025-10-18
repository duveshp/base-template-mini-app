# 🎉 Collab & Fun - Farcaster Mini App

A Next.js mini app for Farcaster that enables users to create and join collaborative activities with shared database functionality.

## ✨ Features

- **Authentication**: Base wallet integration with user profiles
- **Collab Hosting**: Create collabs with categories, time slots, and participant limits
- **Dashboard Feed**: Browse and discover active collabs
- **Participation**: Join collabs and submit proof of participation
- **User Profiles**: Track hosted/joined collabs and engagement stats
- **Gamification**: Badges and counters for user engagement
- **Shared Database**: SQLite database for multi-device access

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Seed the Database**
   ```bash
   npm run seed
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── collabs/       # Collab CRUD operations
│   │   └── user/          # User profile & stats
│   ├── dashboard/         # Dashboard page
│   ├── collab/[id]/       # Collab details page
│   ├── create-collab/     # Create collab page
│   └── profile/           # User profile page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── Login.tsx         # Authentication
│   └── CollabCard.tsx    # Collab display card
├── contexts/             # React Context
│   └── AppContext.tsx    # Global state management
└── lib/                  # Utilities
    ├── database.ts       # SQLite database setup
    └── seed.ts          # Demo data seeding
```

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `fid`: Farcaster ID
- `address`: Wallet address
- `name`: Display name
- `avatar`: Profile image URL
- `role`: User or Organization
- `interests`: User interests (JSON)

### Collabs Table
- `id`: Primary key
- `title`: Collab title
- `emoji`: Display emoji
- `description`: Detailed description
- `category`: Collab category
- `start_time`: Start datetime
- `end_time`: End datetime
- `max_participants`: Participant limit
- `host_id`: Foreign key to users
- `media_url`: Optional media URL

### Participants Table
- `id`: Primary key
- `collab_id`: Foreign key to collabs
- `user_id`: Foreign key to users
- `proof_text`: Optional proof text
- `proof_image_url`: Optional proof image
- `joined_at`: Join timestamp

## 🎯 Core Features

### 1. Authentication
- Base wallet integration (simulated in demo)
- User profile creation and management
- Role-based access (User/Organization)

### 2. Collab Management
- Create collabs with rich metadata
- Category-based organization
- Time-based scheduling
- Participant limits and tracking

### 3. Participation System
- Join collabs with one click
- Submit proof of participation
- Track engagement across collabs

### 4. User Experience
- Responsive design with Tailwind CSS
- Real-time updates via React Context
- Intuitive navigation and UI

## 🔧 API Endpoints

### Collabs
- `GET /api/collabs` - List all collabs
- `POST /api/collabs` - Create new collab
- `GET /api/collabs/[id]` - Get collab details
- `POST /api/collabs/join` - Join a collab
- `PUT /api/collabs/update-proof` - Update participation proof

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/user/profile` - Create/update profile
- `GET /api/user/collabs` - Get user's hosted collabs
- `GET /api/user/joined-collabs` - Get user's joined collabs
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/badges` - Get user badges

### Utility
- `POST /api/seed` - Seed database with demo data

## 🎨 UI Components

- **CollabCard**: Displays collab information in a card format
- **AppHeader**: Navigation and user info
- **Login**: Authentication form
- **Dashboard**: Main collab feed
- **CollabDetails**: Detailed collab view with participation
- **Profile**: User profile and stats

## 🚀 Deployment

This app is designed to be deployed on Farcaster as a mini app. The project includes:

- Farcaster Frame SDK integration
- QuickAuth for authentication
- Responsive design for mobile/desktop
- Optimized for Farcaster's mini app environment

## 🛠️ Development

### Adding New Features
1. Update the database schema in `src/lib/database.ts`
2. Add API routes in `src/app/api/`
3. Create React components in `src/components/`
4. Update the AppContext for state management
5. Add new pages in `src/app/`

### Database Management
- Database file: `collab-fun.db`
- Seed data: `src/lib/seed.ts`
- Reset database: Delete `collab-fun.db` and run seed

## 📱 Farcaster Integration

This mini app is built specifically for Farcaster and includes:

- Frame SDK integration for Farcaster features
- QuickAuth for seamless authentication
- Mobile-optimized UI/UX
- Farcaster-specific metadata and sharing

## 🎉 Demo Data

The seed script creates:
- 4 demo users with different roles
- 5 sample collabs across various categories
- Sample participants and proofs
- User badges and statistics

## 📄 License

This project is part of the Farcaster Mini App Template and follows the same licensing terms.

---

**Ready to collaborate and have fun! 🎉**
