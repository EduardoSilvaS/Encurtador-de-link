# -*- mode: ruby -*-
# vi: set ft=ruby :

# Define a versão da API do Vagrantfile. Essencial para compatibilidade.
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Define a imagem base do Ubuntu que será usada para todas as VMs.
  # O Vagrant irá baixá-la automaticamente na primeira vez.
  config.vm.box = "ubuntu/jammy64" # Ubuntu 22.04 LTS

  # --- 2. CONFIGURAÇÃO DA VM-APP ---
  config.vm.define "app" do |app|
    
    app.vm.hostname = "app"
    
    # Placa de Rede 1: Apenas Rede Interna, garantindo o isolamento.
    app.vm.network "private_network", ip: "192.168.10.102", virtualbox__intnet: "redeapp"
    
    # Provisionamento: Instala o Node.js (usando o repositório oficial para uma versão recente)
    app.vm.provision "shell", path: "appconfig.sh"
  end
  
  # --- 1. CONFIGURAÇÃO DA VM-PROXY ---
  config.vm.define "proxy" do |proxy|
    
    # Define o hostname da máquina
    proxy.vm.hostname = "proxy"

    # Placa de Rede 1: Host-Only (para acesso do seu PC)
    # Daremos um IP estático para facilitar o acesso.cd
    proxy.vm.network "private_network", ip: "192.168.56.10"

    # Placa de Rede 2: Rede Interna (para falar com app e bd)
    # O `virtualbox__intnet` cria uma rede interna chamada "rede-app"
    proxy.vm.network "private_network", ip: "192.168.10.101", virtualbox__intnet: "redeapp"

    # Provisionamento: Comandos que rodam automaticamente para instalar o Nginx.
    proxy.vm.provision "shell", path: "proxyconfig.sh"
  end

  # --- 3. CONFIGURAÇÃO DA VM-BD ---
  config.vm.define "db" do |db|
    
    db.vm.hostname = "bd"

    # Placa de Rede 1: Apenas Rede Interna, também isolada.
    db.vm.network "private_network", ip: "192.168.10.103", virtualbox__intnet: "redeapp"

    # Provisionamento: Instala e configura o PostgreSQL para aceitar conexões da VM-APP
    db.vm.provision "shell", path: "dbconfig.sh"

    # db.trigger.after :up do |trigger|
    #   trigger.info = "Desativando enp0s3 nas VMs app e db"
    #   trigger.run = {
    #     inline: [
    #       "vagrant ssh app -c 'sudo ip link set enp0s3 down'",
    #       "vagrant ssh db -c 'sudo ip link set enp0s3 down'"
    #     ]
    #   }
    # end  

  end

  # Define a memória e a quantidade de CPUs para cada VM.
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024 # 1GB de RAM
    v.cpus = 1
  end
end