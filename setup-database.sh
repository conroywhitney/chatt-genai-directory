#!/bin/bash

echo "🗄️ Setting up Supabase database for GenAI Meetup Demo..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials."
    echo "See .env.local.example for the required format."
    exit 1
fi

# Check if Supabase CLI is available
if ! command -v npx supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI not found!"
    echo "Installing Supabase CLI..."
    yarn add -D supabase
fi

echo "🔗 Linking to your Supabase project..."
echo "You'll need to provide your project reference ID from your Supabase dashboard."

# Link the project (this will prompt for project ref)
npx supabase link

echo "📤 Pushing migrations to your database..."
npx supabase db push

echo "📊 Checking database status..."
npx supabase status

echo "✅ Database setup complete!"
echo ""
echo "🎯 Your member directory is now connected to Supabase!"
echo "Start the dev server with: yarn dev"
