#!/bin/bash
# Production Readiness Check Script

echo "🔍 JustMalikBeats Production Readiness Check"
echo "==========================================="
echo ""

ERRORS=0
WARNINGS=0

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file not found"
    ERRORS=$((ERRORS + 1))
fi

# Check if .env is in .gitignore
if grep -q "^\.env$" .gitignore; then
    echo "✅ .env is in .gitignore"
else
    echo "❌ .env is NOT in .gitignore - SECURITY RISK!"
    ERRORS=$((ERRORS + 1))
fi

# Check if .env is tracked by git
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo "❌ .env is tracked by git - MUST BE REMOVED!"
    echo "   Run: ./remove-env-from-git.sh"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ .env is not tracked by git"
fi

# Check required environment variables
echo ""
echo "Checking environment variables..."

if grep -q "VITE_ADMIN_PASSWORD=" .env 2>/dev/null; then
    if grep -q "VITE_ADMIN_PASSWORD=malik2025beats" .env; then
        echo "⚠️  Admin password is still default - CHANGE FOR PRODUCTION"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ Admin password is set (not default)"
    fi
else
    echo "❌ VITE_ADMIN_PASSWORD not set"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "STRIPE_SECRET_KEY=sk_" .env 2>/dev/null; then
    if grep -q "STRIPE_SECRET_KEY=sk_test" .env; then
        echo "⚠️  Using Stripe TEST key (ok for development)"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ Stripe secret key is set"
    fi
else
    echo "❌ STRIPE_SECRET_KEY not properly set"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "VITE_API_URL=" .env 2>/dev/null; then
    echo "✅ API URL is configured"
else
    echo "⚠️  VITE_API_URL not set - will use defaults"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for common security issues
echo ""
echo "Security checks..."

if grep -r "malik2025beats" src/ --include="*.jsx" --include="*.js" 2>/dev/null | grep -v "\.env"; then
    echo "❌ Hardcoded password found in source code!"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ No hardcoded passwords in source"
fi

if grep -r "localhost:3001" src/ --include="*.jsx" --include="*.js" 2>/dev/null; then
    COUNT=$(grep -r "localhost:3001" src/ --include="*.jsx" --include="*.js" 2>/dev/null | wc -l)
    if [ $COUNT -gt 1 ]; then
        echo "⚠️  Found hardcoded localhost URLs in source"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ Minimal hardcoded URLs (using env vars)"
    fi
fi

# Check Node.js and npm
echo ""
echo "Environment checks..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed - run: npm install"
    WARNINGS=$((WARNINGS + 1))
fi

# Production readiness
echo ""
echo "Production readiness..."

if [ -f "PRODUCTION_CHECKLIST.md" ]; then
    echo "✅ Production checklist available"
else
    echo "⚠️  Production checklist missing"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "==========================================="
echo "Summary:"
echo "  ❌ Errors: $ERRORS"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed!"
    echo "   Status: Development Ready"
    echo ""
    echo "⚠️  Note: This does NOT mean production ready!"
    echo "   See PRODUCTION_CHECKLIST.md for remaining work"
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  No critical errors, but warnings exist"
    echo "   Review warnings above before deploying"
else
    echo "❌ Critical errors found - DO NOT DEPLOY"
    echo "   Fix errors above before proceeding"
fi

exit $ERRORS
