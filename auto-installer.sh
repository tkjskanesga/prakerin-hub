#!/bin/bash

# Detect OS and Distribution
OS="$(uname -s)"
ID="$(grep -E '^ID=' /etc/os-release | cut -d= -f2 | tr -d '"' 2>/dev/null || echo "unknown")"

echo "[+] Detecting system: $OS ($ID)"

# WSL Protection: Ubuntu only
if uname -a | grep -qiE "microsoft|wsl"; then
    if [ "$ID" != "ubuntu" ]; then
        echo "[✗] Error: On WSL, this script only supports Ubuntu."
        exit 1
    fi
fi

# Helper function to install packages based on OS/Manager
install_pkg() {
    local pkg=$1
    echo "[+] Installing $pkg..."
    case "$OS" in
        "Darwin")
            if ! command -v brew &> /dev/null; then
                echo "[!] Homebrew not found. Please install it first at https://brew.sh/"
                exit 1
            fi
            brew install "$pkg"
            ;;
        "Linux")
            case "$ID" in
                "ubuntu"|"debian")
                    sudo apt update && sudo apt install -y "$pkg"
                    ;;
                "fedora")
                    sudo dnf install -y "$pkg"
                    ;;
                "arch")
                    sudo pacman -S --noconfirm "$pkg"
                    ;;
                *)
                    echo "[!] Unsupported Linux distro for auto-install. Please install $pkg manually."
                    ;;
            esac
            ;;
    esac
}

# Check and install core dependencies
for tool in git curl unzip; do
    if ! command -v $tool &> /dev/null; then
        echo "[✗] $tool is not installed."
        install_pkg $tool
    fi
done

# Bun Installation & Path Configuration
if ! command -v bun &> /dev/null; then
    echo "[+] Bun not found, starting installation..."
    curl -fsSL https://bun.sh/install | bash
    # Export path immediately so the current session can use bun
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
fi

# Docker Installation
if ! command -v docker &> /dev/null; then
    echo "[+] Docker not found..."
    if [ "$OS" = "Darwin" ]; then
        echo "[!] On macOS, please install Docker Desktop manually: https://www.docker.com/products/docker-desktop"
    else
        curl -fsSL https://get.docker.com | sh
    fi
fi

# Repository Management
REPO_DIR="prakerin-hub"
if [ -d "$REPO_DIR" ]; then
    echo "[+] Repository already exists, skipping clone..."
else
    echo "[+] Cloning repository..."
    git clone https://github.com/tkjskanesga/prakerin-hub.git
fi

# Finalizing Installation
if [ -d "$REPO_DIR" ]; then
    cd "$REPO_DIR" || exit
    echo "[+] Running bun install..."
    bun install --dev
    cd ..
    echo "[+] Running auto-installer..."
    exec bun ./$REPO_DIR/auto-installer.js
    # Warning, this script can remove $REPO_DIR after auto-installer is done!
    rm -rf $REPO_DIR
else
    echo "[✗] Failed to locate repository directory."
    exit 1
fi