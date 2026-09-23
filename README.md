# Salão e Estética — Template Comercial

Template estático, responsivo e reutilizável para negócios de salão de beleza e estética.

## Onde configurar um novo cliente

A principal área de configuração é:

`js/config.js`

Ali ficam nome, cidade, telefone, WhatsApp, endereço, redes sociais, serviços, galeria e depoimentos.

### Dados atuais

- Empresa: Salão e Estética Cantinho da Beleza
- Cidade: Manhumirim - MG
- Referência: Em cima da Loja da Margarida
- Endereço: Av. Padre Júlio Maria, 25 - Centro, Manhumirim - MG, 36970-000
- WhatsApp: (33) 98436-8440

## Como trocar o cliente

1. Abra `js/config.js`.
2. Altere os campos de `empresa`.
3. Configure logo e redes sociais em `identidade`.
4. Configure serviços em `servicos`.
5. Coloque fotos em `assets/images/`.
6. Atualize os caminhos da propriedade `galeria`.
7. Adicione depoimentos somente quando o cliente fornecer os textos.
8. Publique os arquivos em uma hospedagem estática, como Vercel.

## Galeria

Exemplo:

```javascript
galeria: [
  {
    imagem: "assets/images/espaco-01.jpg",
    titulo: "Nosso espaço",
    descricao: "Conheça nosso ambiente."
  }
]
```

## Observações

O template não inventa horários, preços, redes sociais ou depoimentos. Campos não fornecidos ficam vazios ou como estrutura de configuração.

## Licença

A licença comercial do template deve ser definida separadamente conforme o modelo de venda escolhido.