#!/bin/bash
# velo-brain installer — last ned binary, lagre token, konfigurer Claude Desktop + Claude Code.
#
# Bruk:
#   curl -fsSL https://raw.githubusercontent.com/Kristoffer-Velo/velovault/main/install.sh | bash -s -- DIN_TOKEN
#
# Onboarding-script genererer full kommando per ansatt.

set -e

TOKEN="${1:-}"
if [ -z "$TOKEN" ]; then
  echo "Feil: Token mangler."
  echo ""
  echo "Bruk: curl -fsSL https://raw.githubusercontent.com/Kristoffer-Velo/velovault/main/install.sh | bash -s -- DIN_TOKEN"
  echo ""
  echo "Kontakt Kristoffer for å få din token."
  exit 1
fi

echo "=== velo-brain installer ==="
echo ""

# Detect architecture
ARCH=$(uname -m)
case "$ARCH" in
  arm64|aarch64) BINARY="velo-brain-mcp-darwin-arm64" ;;
  x86_64)        BINARY="velo-brain-mcp-darwin-x64" ;;
  *)
    echo "Feil: Ukjent arkitektur $ARCH. Støtter kun macOS (ARM/Intel)."
    exit 1
    ;;
esac

INSTALL_DIR="$HOME/.velo-brain"
BINARY_PATH="$INSTALL_DIR/velo-brain-mcp"
TOKEN_PATH="$INSTALL_DIR/token"
REPO="Kristoffer-Velo/velovault"

# Create install dir
mkdir -p "$INSTALL_DIR"

# Download binary from GitHub release
echo "Laster ned velo-brain-mcp ($ARCH)..."
DOWNLOAD_URL="https://github.com/$REPO/releases/latest/download/$BINARY"
if ! curl -fsSL "$DOWNLOAD_URL" -o "$BINARY_PATH" 2>/dev/null; then
  echo "GitHub release ikke funnet, prøver direkte nedlasting..."
  DOWNLOAD_URL="https://raw.githubusercontent.com/$REPO/main/dist/$BINARY"
  curl -fsSL "$DOWNLOAD_URL" -o "$BINARY_PATH" || {
    echo "Feil: Kunne ikke laste ned velo-brain-mcp. Kontakt Kristoffer."
    exit 1
  }
fi
chmod +x "$BINARY_PATH"

# Save token
echo "$TOKEN" > "$TOKEN_PATH"
chmod 600 "$TOKEN_PATH"

# === Claude Desktop ===
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

echo "Konfigurerer Claude Desktop..."
mkdir -p "$CONFIG_DIR"

if [ -f "$CONFIG_FILE" ]; then
  python3 -c "
import json
with open('$CONFIG_FILE', 'r') as f:
    config = json.load(f)
config.setdefault('mcpServers', {})
config['mcpServers']['velo-brain'] = {
    'command': '$BINARY_PATH',
    'args': [],
    'env': {
        'VELO_BRAIN_TOKEN': '$TOKEN'
    }
}
with open('$CONFIG_FILE', 'w') as f:
    json.dump(config, f, indent=2)
"
else
  cat > "$CONFIG_FILE" <<CONF
{
  "mcpServers": {
    "velo-brain": {
      "command": "$BINARY_PATH",
      "args": [],
      "env": {
        "VELO_BRAIN_TOKEN": "$TOKEN"
      }
    }
  }
}
CONF
fi

# === Claude Code (global) ===
echo "Konfigurerer Claude Code (global)..."
if command -v claude >/dev/null 2>&1; then
  # Remove any existing velo-brain config first
  claude mcp remove velo-brain -s user 2>/dev/null || true
  claude mcp add velo-brain -s user -- "$BINARY_PATH" 2>/dev/null && \
    echo "  Claude Code: velo-brain MCP lagt til globalt" || \
    echo "  Claude Code: manuell konfigurasjon nødvendig (se under)"
else
  echo "  Claude Code CLI ikke funnet — hopper over"
fi

echo ""
echo "=== Ferdig! ==="
echo ""
echo "velo-brain er installert:"
echo "  Binary:  $BINARY_PATH"
echo "  Token:   $TOKEN_PATH"
echo "  Claude Desktop: $CONFIG_FILE"
echo ""
echo "Restart Claude Desktop nå (Cmd+Q, åpne igjen)."
echo "For Claude Code: Restart terminalen."
echo ""
echo "Test med å spørre Claude:"
echo "  «Hva vet vi om Baneservice?»"
echo "  «Hvilke aktive deals har vi?»"
echo "  «Gi meg en oppdatering på prosjekt Aidn»"
echo ""
