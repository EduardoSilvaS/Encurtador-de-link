#!/bin/bash 
echo "--> Iniciando configuracao da VM APP"
apt-get update
apt-get install -y ca-certificates curl gnupg
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
apt-get update
apt-get install -y nodejs
npm install -g pm2
echo "--> Criando ENV"
cd /vagrant/app
cp .env.example .env
cd ..
npm init -y
cd app
pm2 start index.js --name encurtador
echo "--> Termino da configuracao da VM APP"
