#!/bin/bash   
echo "--> Iniciando Configuracao da VM PROXY"
apt-get update
apt-get install -y nginx
cp /vagrant/encurtador.conf /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/encurtador.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
echo "--> Termino da Configuracao da VM PROXY"