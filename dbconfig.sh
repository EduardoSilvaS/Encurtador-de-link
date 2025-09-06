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


# Cria o usuário do banco de dados para a aplicação
echo "--> Criando usuario e banco de dados para a aplicacao"
sudo -u postgres psql <<EOF
    CREATE USER encurtador_user WITH ENCRYPTED PASSWORD 'senha_super_segura_123';
    CREATE DATABASE encurtador_db OWNER encurtador_user;
    \c encurtador_db
    CREATE TABLE links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) NOT NULL UNIQUE,
        original_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    GRANT ALL PRIVILEGES ON TABLE links TO encurtador_user;
    GRANT USAGE, SELECT ON SEQUENCE links_id_seq TO encurtador_user;

EOF

# Reinicia o PostgreSQL para aplicar as configurações
systemctl restart postgresql

echo "--> Termino da configuracao da VM DB"