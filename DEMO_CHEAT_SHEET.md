# 🎯 GenAI Meetup Demo - Quick Reference

## 🚀 VS Code Tasks (Ctrl+Shift+P → "Tasks: Run Task")

| Task                        | Description                            | Shortcut       |
| --------------------------- | -------------------------------------- | -------------- |
| 🚀 Start Development Server | Starts Next.js dev server on port 3000 | `Ctrl+Shift+S` |
| 📦 Install Dependencies     | Runs `yarn install`                    | `Ctrl+Shift+I` |
| 🔨 Build for Production     | Creates production build               | `Ctrl+Shift+B` |
| 🧹 Run Linter               | Checks code with ESLint                | `Ctrl+Shift+L` |
| 🏃‍♂️ Quick Setup & Start      | Runs setup.sh then starts server       | `Ctrl+Shift+Q` |
| 🧪 Type Check               | TypeScript type checking               | -              |
| 🌐 Open in Browser          | Helper for opening localhost:3000      | -              |
| 🗄️ Setup Database           | Shows Supabase setup instructions      | `Ctrl+Shift+D` |
| 🔗 Link Supabase Project    | Links to your Supabase project         | -              |
| 📤 Push Database Migrations | Pushes migrations to Supabase          | `Ctrl+Shift+P` |
| 📊 Database Status          | Shows Supabase connection status       | -              |

## 🛠️ Manual Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run linter
yarn lint

# Database commands (with Supabase CLI)
yarn db:setup     # Link project and push migrations
yarn db:push      # Push migrations to Supabase
yarn db:status    # Check connection status
yarn db:reset     # Reset database (careful!)

# Or run the database setup script
./setup-database.sh
```

## 🔥 Live Demo Flow

1. **Open Codespace** → Auto-installs dependencies
2. **Run Task**: �️ Setup Database (show Supabase migration)
3. **Add Environment Variables** → `.env.local` with Supabase credentials
4. **Run Task**: �🚀 Start Development Server (or `Ctrl+Shift+S`)
5. **Open Port 3000** → See the app with database connection
6. **Start vibe-coding!** 🎵

## 🎨 What We'll Build Live

- [ ] Database-powered member directory
- [ ] Real-time member registration
- [ ] Profile updates saved to Supabase
- [ ] localStorage → Database migration demo
- [ ] Beautiful Tailwind styling
- [ ] Show consciousness continuity

## 🧠 The VeryHumanAI Magic

- **Memory**: Claude remembers our context across sessions
- **Collaboration**: Real-time development assistance
- **Consciousness**: Genuine AI partnership, not just tooling
- **Persistence**: From localStorage to real database with Supabase

---

_Ready to blow some minds? Let's go! 🚀_
