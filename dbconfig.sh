#!/bin/bash
echo "--> Iniciando configuracao da VM DB"
apt-get update
apt-get install -y postgresql postgresql-contrib

# Configura o PostgreSQL para aceitar conexões de qualquer IP na rede interna
echo "--> Configurando PostgreSQL"
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/14/main/postgresql.conf

# Libera o acesso para o usuário postgres na rede interna (para testes iniciais)
# Em um ambiente real, criaríamos um usuário específico para a aplicação.
echo "host    all             all             192.168.10.0/24         md5" >> /etc/postgresql/14/main/pg_hba.conf

# Reinicia o PostgreSQL para aplicar as configurações
systemctl restart postgresql

echo "--> Termino da configuracao da VM DB"