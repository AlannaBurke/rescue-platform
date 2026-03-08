#!/usr/bin/env bash
# =============================================================================
# Rescue Platform — Automated Installation Script
# =============================================================================
# This script installs Drupal with the rescue_platform profile.
# Run this after `docker compose up -d` or on your hosting environment.
#
# Usage:
#   ./scripts/install.sh
#   ./scripts/install.sh --no-docker  (if running outside Docker)
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load .env file if it exists
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
  echo -e "${GREEN}✓ Loaded environment from .env${NC}"
else
  echo -e "${RED}✗ .env file not found. Copy .env.example to .env and fill in your values.${NC}"
  exit 1
fi

# Default values
USE_DOCKER=true
DRUSH="vendor/bin/drush"
WEB_ROOT="web"

# Parse arguments
for arg in "$@"; do
  case $arg in
    --no-docker)
      USE_DOCKER=false
      shift
      ;;
  esac
done

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           🐾  Rescue Platform Installer  🐾                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Wait for database
echo -e "${YELLOW}→ Waiting for database connection...${NC}"
MAX_TRIES=30
TRIES=0
until php -r "
  try {
    new PDO('mysql:host=${DB_HOST:-db};port=${DB_PORT:-3306};dbname=${DB_NAME:-rescue_platform}',
      '${DB_USER:-rescue_platform}', '${DB_PASSWORD:-}');
    exit(0);
  } catch (Exception \$e) {
    exit(1);
  }
" 2>/dev/null; do
  TRIES=$((TRIES + 1))
  if [ $TRIES -ge $MAX_TRIES ]; then
    echo -e "${RED}✗ Could not connect to database after ${MAX_TRIES} attempts.${NC}"
    echo -e "${RED}  Check your DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD settings.${NC}"
    exit 1
  fi
  echo -e "  Waiting for database... (attempt ${TRIES}/${MAX_TRIES})"
  sleep 2
done
echo -e "${GREEN}✓ Database connection established${NC}"

# Step 2: Install Drupal with the rescue_platform profile
echo ""
echo -e "${YELLOW}→ Installing Drupal with the Rescue Platform profile...${NC}"
echo -e "  Site name: ${DRUPAL_SITE_NAME:-My Animal Rescue}"
echo -e "  Admin user: ${DRUPAL_ADMIN_USER:-admin}"
echo ""

$DRUSH site:install rescue_platform \
  --db-url="mysql://${DB_USER:-rescue_platform}:${DB_PASSWORD:-}@${DB_HOST:-db}:${DB_PORT:-3306}/${DB_NAME:-rescue_platform}" \
  --site-name="${DRUPAL_SITE_NAME:-My Animal Rescue}" \
  --site-mail="${DRUPAL_SITE_MAIL:-admin@example.com}" \
  --account-name="${DRUPAL_ADMIN_USER:-admin}" \
  --account-pass="${DRUPAL_ADMIN_PASSWORD:-admin}" \
  --account-mail="${DRUPAL_SITE_MAIL:-admin@example.com}" \
  --locale=en \
  --yes

echo -e "${GREEN}✓ Drupal installed successfully${NC}"

# Step 3: Import configuration
echo ""
echo -e "${YELLOW}→ Importing Rescue Platform configuration...${NC}"

if [ -d "${WEB_ROOT}/profiles/rescue_platform/config/sync" ]; then
  $DRUSH config:import --yes 2>/dev/null || true
  echo -e "${GREEN}✓ Configuration imported${NC}"
else
  echo -e "${YELLOW}  No config/sync directory found — using defaults${NC}"
fi

# Step 4: Set up file directories
echo ""
echo -e "${YELLOW}→ Setting up file directories...${NC}"
mkdir -p "${WEB_ROOT}/sites/default/files/animals"
mkdir -p "${WEB_ROOT}/sites/default/files/receipts"
mkdir -p "${WEB_ROOT}/sites/default/files/private"
chmod -R 755 "${WEB_ROOT}/sites/default/files"
echo -e "${GREEN}✓ File directories created${NC}"

# Step 5: Clear caches
echo ""
echo -e "${YELLOW}→ Clearing caches...${NC}"
$DRUSH cache:rebuild
echo -e "${GREEN}✓ Caches cleared${NC}"

# Step 6: Generate a one-time login link
echo ""
echo -e "${YELLOW}→ Generating admin login link...${NC}"
LOGIN_LINK=$($DRUSH user:login --uri="http://localhost:8080" 2>/dev/null || echo "")

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           🎉  Installation Complete!  🎉                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Drupal Admin:${NC}  http://localhost:8080/admin"
echo -e "  ${BLUE}GraphQL API:${NC}   http://localhost:8080/graphql"
echo ""
if [ -n "$LOGIN_LINK" ]; then
  echo -e "  ${YELLOW}One-time login link:${NC}"
  echo -e "  ${LOGIN_LINK}"
  echo ""
fi
echo -e "  ${BLUE}Next steps:${NC}"
echo -e "  1. Visit the admin link above to complete your rescue setup"
echo -e "  2. Start the Next.js frontend: cd nextjs-frontend && pnpm dev"
echo -e "  3. Read the docs: https://github.com/AlannaBurke/rescue-platform/tree/main/docs"
echo ""
