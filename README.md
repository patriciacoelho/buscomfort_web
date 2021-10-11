![Logo do busComfort](client/public/logo.png)
>#### Uma Aplicação Web para Monitorar o Conforto em Transportes Públicos

[Acesse a versão de teste em produção](https://buscomfort.herokuapp.com/)


Para testar a aplicação localmente (em modo desenvolvedor) é preciso clonar o repositório:

```
git clone https://gitlab.com/patricia_coelho/buscomfort_web.git
```

Feito isso é preciso acessar o diretório `api` e executar o comando para instalar as dependências.

```
cd api && npm i
```

Agora é só executar a API e já pode fazer as requisições para `http://localhost:3080/api`.

```
npm run dev
```

Para rodar a interface acesse a pasta `client` e execute o comando para instalar as dependência. Depois você pode iniciar o servidor.

```
cd client && npm i
```
```
npm run serve
```