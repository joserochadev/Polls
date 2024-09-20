# Real-Time Voting System

Este é um sistema de votação em tempo real, onde os usuários podem criar enquetes e outros usuários podem votar nas opções disponíveis. As votações são atualizadas em tempo real, e um ranking entre as opções é gerado e atualizado automaticamente.

## Requisitos

- Docker
- Node.js

## Setup

- Clone esse repositorio;
- Instale as dependências (npm install);
- Setup PostgreSQL e Redis (docker compose up -d);
- Copie o arquivo .env.example (cp .env.example .env);
- Execute a aplicação (npm run dev);
- Teste! (Hoppscotch).


## Endpoints HTTP

### POST /polls
Cria uma nova enquete.

Exemplo de requisição:

``` json
{
  "title": "Qual a melhor linguagem de programação?",
  "options": [
    "JavaScript",
    "Java",
    "PHP",
    "C#"
  ]
}

```
Exemplo de resposta:

``` json
{
  "pollId": "194cef63-2ccf-46a3-aad1-aa94b2bc89b0"
}
```

### GET /polls/:pollId
Retorna os dados de uma enquete específica.

Exemplo de resposta:
``` json
{
  "poll": {
    "id": "e4365599-0205-4429-9808-ea1f94062a5f",
    "title": "Qual a melhor linguagem de programação?",
    "options": [
      {
        "id": "4af3fca1-91dc-4c2d-b6aa-897ad5042c84",
        "title": "JavaScript",
        "score": 1
      },
      {
        "id": "780b8e25-a40e-4301-ab32-77ebf8c79da8",
        "title": "Java",
        "score": 0
      },
      {
        "id": "539fa272-152b-478f-9f53-8472cddb7491",
        "title": "PHP",
        "score": 0
      },
      {
        "id": "ca1d4af3-347a-4d77-b08b-528b181fe80e",
        "title": "C#",
        "score": 0
      }
    ]
  }
}
```


### POST /polls/:pollId/votes
Adiciona um voto a uma opção específica de uma enquete.

Exemplo de requisição:

``` json
{
  "pollOptionId": "31cca9dc-15da-44d4-ad7f-12b86610fe98"
}
```

## WebSockets

### ws /polls/:pollId/results
Este WebSocket transmite as atualizações de votos em tempo real.

Exemplo de mensagem:
``` json
{
  "pollOptionId": "da9601cc-0b58-4395-8865-113cbdc42089",
  "votes": 2
}

```

