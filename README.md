# Agente Jurídico - Chat com IA

Website de chat interativo com um agente de IA especializado em apoio jurídico. Implementado usando a biblioteca oficial @n8n/chat.

## Características

- Interface moderna e responsiva
- Chat em tempo real com agente jurídico de IA
- Integração direta com webhook do n8n
- Design elegante com gradiente roxo
- Totalmente responsivo para dispositivos móveis
- Usa a biblioteca oficial @n8n/chat do CDN

## Estrutura do Projeto

```
├── index.html       # Página única com HTML, CSS e JavaScript
└── README.md        # Este ficheiro
```

## Uso

1. Abra o ficheiro `index.html` diretamente no seu navegador
2. Ou use um servidor local:

### Com Python:
```bash
# Python 3
python -m http.server 8081

# Python 2
python -m SimpleHTTPServer 8081
```

### Com Node.js (http-server):
```bash
npx http-server -p 8081
```

### Com PHP:
```bash
php -S localhost:8081
```

O website estará disponível em `http://localhost:8081`

## Configuração do Webhook

O webhook do n8n está configurado no ficheiro `index.html`. O endpoint atual é:
```
https://meu-n8n.loca.lt/webhook/5320a8a6-d091-4e4e-a457-3795c9d0d1f3/chat
```

Para alterar o webhook, edite a propriedade `webhookUrl` na função `createChat()` no ficheiro `index.html`.

## Funcionalidades

- ✅ Interface pré-construída pela biblioteca @n8n/chat
- ✅ Mensagens iniciais personalizadas
- ✅ Integração automática com webhook do n8n
- ✅ Design responsivo e moderno
- ✅ Configuração de metadata (idioma, sistema)

## Tecnologias

- HTML5
- CSS3
- JavaScript ES6+ (módulos)
- Biblioteca @n8n/chat (via CDN)