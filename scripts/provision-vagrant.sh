#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

sudo sed -i 's|https://mirrors.edge.kernel.org/ubuntu/|https://archive.ubuntu.com/ubuntu/|g' /etc/apt/sources.list
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg git

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v docker >/dev/null 2>&1; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo usermod -aG docker vagrant
fi

if ! command -v mongosh >/dev/null 2>&1; then
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-mongosh
fi

if ! command -v lazydocker >/dev/null 2>&1; then
  LZD_VER=$(curl -sL https://api.github.com/repos/jesseduffield/lazydocker/releases/latest | grep tag_name | cut -d'"' -f4 | sed 's/^v//')
  curl -sL "https://github.com/jesseduffield/lazydocker/releases/download/v${LZD_VER}/lazydocker_${LZD_VER}_Linux_x86_64.tar.gz" | sudo tar -C /usr/local/bin -xz lazydocker
fi

if [ -f /vagrant/package.json ]; then
  sudo -u vagrant bash -c 'cd /vagrant && npm install --no-audit --no-fund'
fi

echo "Vagrant development environment is ready."
echo "Run: cd /vagrant && docker compose up --build"
