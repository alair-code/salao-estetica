# Salão e Estética — Template Comercial

Template estático, responsivo e reutilizável para negócios de salão de beleza e estética.

## Configuração central

Para transformar o template em outro cliente, comece por **js/config.js**. O arquivo concentra:

- Dados da empresa, telefone, WhatsApp e endereço
- Logo, favicon e redes sociais
- Cores e SEO
- Textos principais
- Horários
- Diferenciais
- Serviços
- Galeria
- Depoimentos
- Imagens do Hero e da seção Sobre
- Destino do agendamento
- Textos institucionais e títulos das seções

Não é necessário espalhar os dados do cliente pelo HTML.

## Dados atuais

- Empresa: Salão e Estética Cantinho da Beleza
- Cidade: Manhumirim - MG
- Referência: Em cima da Loja da Margarida
- Endereço: Av. Padre Júlio Maria, 25 - Centro, Manhumirim - MG, 36970-000
- WhatsApp: (33) 98436-8440

## Imagens

Coloque as imagens reais em `assets/images/` e informe seus caminhos em `js/config.js`:

```javascript
imagens: {
  hero: "assets/images/hero.jpg",
  sobre: "assets/images/sobre.jpg"
},

galeria: [
  {
    imagem: "assets/images/galeria-01.jpg",
    titulo: "Nosso espaço",
    descricao: "Conheça nosso ambiente."
  }
]
```

## Logo e redes sociais

```javascript
identidade: {
  logo: "assets/images/logo.png",
  favicon: "assets/images/favicon.png",
  instagram: "https://instagram.com/...",
  facebook: "https://facebook.com/..."
}
```

Se um campo estiver vazio, o elemento correspondente é ocultado quando aplicável.

## Serviços

Comece com um array vazio para não publicar serviços fictícios:

```javascript
servicos: [
  {
    categoria: "Salão de Beleza",
    nome: "Nome real",
    descricao: "Descrição real",
    preco: ""
  }
]
```

## Horários

Preencha apenas os dias e horários confirmados pelo cliente. A seção aparece automaticamente quando existir pelo menos um horário configurado.

## Agendamento

Por padrão, o botão usa WhatsApp:

```javascript
contato: {
  whatsapp: "5533984368440",
  mensagemWhatsapp: "Olá! Gostaria de conhecer os serviços e consultar um horário.",
  agendamento: {
    tipo: "whatsapp",
    link: ""
  }
}
```

Para usar uma plataforma externa:

```javascript
agendamento: {
  tipo: "link",
  link: "https://..."
}
```

## Publicação

Por ser um site estático, os arquivos podem ser publicados na Vercel ou em outro serviço de hospedagem estática.

## Licença

A licença comercial/proprietária deve ser definida separadamente de acordo com o modelo de venda do template.
## Arquitetura

O conteúdo específico do cliente deve ficar em `js/config.js`. O HTML mantém apenas a estrutura e os atributos `data-*`, enquanto `js/script.js` faz a renderização dinâmica. O template não utiliza banco de dados, framework ou backend.
