#!/bin/bash

echo "🔐 Stripe Webhook Secret Setup Helper"
echo "======================================"
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed"
    echo ""
    echo "Install with:"
    echo "  brew install stripe/stripe-cli/stripe"
    echo ""
    echo "Or download from:"
    echo "  https://github.com/stripe/stripe-cli/releases"
    echo ""
    exit 1
fi

echo "✅ Stripe CLI is installed"
echo ""

# Check if logged in
if ! stripe config --list &> /dev/null; then
    echo "❌ Not logged in to Stripe"
    echo ""
    echo "Login with:"
    echo "  stripe login"
    echo ""
    exit 1
fi

echo "✅ Logged in to Stripe"
echo ""

echo "🎯 Getting webhook secret for local development..."
echo ""
echo "This will:"
echo "  1. Start forwarding Stripe events to your local server"
echo "  2. Display your webhook signing secret"
echo "  3. Keep running to forward events (press Ctrl+C to stop)"
echo ""
echo "Your server should be running on http://localhost:3001"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Starting webhook forwarding..."
echo "Copy the 'whsec_...' secret and add it to your .env file"
echo ""

stripe listen --forward-to localhost:3001/api/payments/webhook
