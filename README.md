## Clone este repositório:

```
git clone https://github.com/EduardoSilvaS/Encurtador-de-link
```  

```
cd Encurtador-de-link
```

Suba a VM com Vagrant:

```
vagrant up
```

## Estabeleça a sessão do SSH

### Na VM-PROXY
```
vagrant ssh proxy
```


### Na VM-APP
```
vagrant ssh app
```


### Na VM-DB
```
vagrant ssh db
```

## Desligando as interfaces NAT (enp0s3) em cada VM

### Na VM-APP
```
sudo ip link set enp03 down
```

### Na VM-DB
```
sudo ip link set enp03 down
```

## Acesse o APP

> [192.168.56.10](http://192.168.56.10)
