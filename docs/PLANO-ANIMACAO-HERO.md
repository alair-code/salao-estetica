# Plano de implementação — Hero animado

**Projeto:** Salão e Estética — template reutilizável  
**Branch obrigatória:** `manutencao`  
**Status:** planejamento; executar um bloco por vez  
**Objetivo:** transformar a primeira dobra (hero) em uma capa elegante, moderna e chamativa, adequada a salão de beleza e estética, sem prejudicar leitura, acessibilidade, desempenho ou personalização por cliente.

## Regras para toda a execução

- Trabalhar exclusivamente na branch `manutencao`. Não enviar alterações para `main` sem autorização explícita.
- Antes de cada bloco, ler este documento e inspecionar o código atual relacionado ao bloco.
- Implementar somente o bloco da vez; não antecipar os seguintes.
- Preservar HTML semântico, links, botões, configuração centralizada em `js/config.js` e compatibilidade com o template para outros clientes.
- Não adicionar frameworks, bibliotecas de animação ou dependências sem necessidade.
- Não usar vídeos pesados, autoplay com som, animações piscantes ou efeitos que prejudiquem a leitura.
- Ao terminar cada bloco, revisar desktop e mobile, executar os testes pertinentes e registrar aqui o status antes de avançar.
- Não afirmar que um teste passou sem executá-lo.

## Direção visual desejada

Um hero com aparência premium de beleza e bem-estar: imagem de capa de alta qualidade, movimento lento e discreto na imagem (efeito cinematográfico), camada de contraste para manter o texto legível, entrada suave dos textos e botões e detalhes visuais sutis em tons coerentes com a paleta configurada pelo cliente. A animação deve valorizar a capa, não competir com o conteúdo.

A imagem deve continuar opcional e configurável por cliente. Se não houver imagem válida, o hero precisa continuar bonito e legível com o fundo alternativo já previsto pelo CSS. O conteúdo principal, os botões e a navegação não podem depender da animação para funcionar.

---

## Bloco 1 — Auditoria e definição da base visual

**Objetivo:** entender a implementação atual antes de alterar o hero.

### Passos
1. Inspecionar o HTML da seção `.hero` em `index.html`.
2. Inspecionar todas as regras `.hero` e suas media queries em `css/style.css`.
3. Conferir como `hero.imagem`, os textos e os botões são aplicados a partir de `js/config.js` e `js/script.js`.
4. Identificar animações já existentes, sobreposições, altura do hero, comportamento do cabeçalho e possíveis conflitos.
5. Verificar se existe tratamento para `prefers-reduced-motion` e como os testes automatizados são executados.
6. Registrar os riscos e a abordagem mínima antes de escrever código.

### Critérios de conclusão
- A estrutura atual e os pontos de alteração estão documentados.
- Nenhum arquivo funcional foi alterado neste bloco.
- Existe um plano de implementação compatível com o template.

**Status:** ⬜ Pendente

---

## Bloco 2 — Preparar a imagem e a composição da capa

**Objetivo:** garantir uma base visual forte mesmo antes de animar.

### Passos
1. Definir a composição do hero para que a imagem tenha presença e os textos permaneçam fáceis de ler.
2. Revisar o enquadramento e o posicionamento da imagem em desktop e celular, incluindo `background-position` ou alternativa apropriada.
3. Criar ou refinar uma camada de contraste/gradiente usando CSS, sem esconder excessivamente a imagem.
4. Manter as cores ligadas às variáveis do tema sempre que possível.
5. Preservar o fallback quando `hero.imagem` estiver vazio ou não puder ser carregado.
6. Não substituir imagens nem inventar arquivos de mídia sem confirmar que existem no repositório.

### Critérios de conclusão
- Título, descrição e CTAs têm contraste suficiente.
- A imagem não corta elementos importantes em telas pequenas.
- A capa continua funcional sem imagem configurada.

**Status:** ⬜ Pendente

---

## Bloco 3 — Animar a imagem de fundo com movimento cinematográfico

**Objetivo:** dar vida à capa com um movimento lento, discreto e profissional.

### Passos
1. Escolher uma animação CSS leve, como zoom muito gradual e/ou deslocamento mínimo da imagem.
2. Aplicar o movimento à camada visual da imagem, sem animar o contêiner inteiro e sem deslocar o texto ou os botões.
3. Evitar tremores, zoom agressivo, mudanças bruscas, flashes e loops rápidos.
4. Evitar propriedades caras de animar; verificar consumo e fluidez em dispositivos móveis.
5. Garantir que a animação não altere o tamanho do documento nem crie rolagem horizontal.
6. Manter o movimento decorativo: ele não pode ser necessário para entender o conteúdo.

### Critérios de conclusão
- O movimento é suave, discreto e não atrapalha a leitura.
- Não há deslocamento do layout, rolagem horizontal ou interferência nos cliques.
- O desempenho continua aceitável em desktop e celular.

**Status:** ⬜ Pendente

---

## Bloco 4 — Entrada suave do conteúdo

**Objetivo:** fazer etiqueta, título, descrição e botões aparecerem com ritmo visual consistente.

### Passos
1. Definir uma sequência curta e sutil de entrada para os elementos principais.
2. Usar deslocamentos pequenos e opacidade, sem esconder conteúdo por muito tempo.
3. Garantir que o conteúdo continue visível caso o JavaScript ou a animação não execute.
4. Evitar que a animação bloqueie o clique nos botões ou cause mudanças de posição perceptíveis.
5. Conferir o comportamento com carregamento lento e em celulares.

### Critérios de conclusão
- Os textos e botões aparecem rapidamente e sem saltos.
- O conteúdo continua acessível e funcional sem animações.
- A sequência não torna a abertura do site lenta.

**Status:** ⬜ Pendente

---

## Bloco 5 — Acessibilidade, movimento reduzido e responsividade

**Objetivo:** respeitar preferências do usuário e manter uma boa experiência em diferentes telas.

### Passos
1. Implementar ou revisar `@media (prefers-reduced-motion: reduce)` para desativar ou reduzir os movimentos não essenciais.
2. Verificar contraste do texto sobre a imagem e foco visível dos botões.
3. Testar larguras de celular, tablet e desktop, incluindo telas estreitas.
4. Confirmar que nenhuma informação depende exclusivamente de movimento, cor ou imagem.
5. Conferir que não há animações piscantes ou movimento excessivo.

### Critérios de conclusão
- Movimento reduzido é respeitado.
- Conteúdo, botões e foco de teclado continuam utilizáveis.
- Não há cortes, sobreposição ou rolagem horizontal nas larguras verificadas.

**Status:** ⬜ Pendente

---

## Bloco 6 — Personalização e fallback por cliente

**Objetivo:** manter o hero reutilizável para os próximos clientes.

### Passos
1. Confirmar que a imagem e os textos continuam sendo configurados em `js/config.js`, sem dados específicos de um cliente fixados no CSS ou no JavaScript.
2. Se uma nova opção de animação for realmente necessária, documentá-la e centralizá-la na configuração com um padrão seguro; não criar opções desnecessárias.
3. Verificar o comportamento quando a imagem estiver vazia e quando os textos opcionais estiverem ausentes.
4. Testar a troca de imagem e paleta sem modificar `index.html` ou `js/script.js` para cada cliente.
5. Atualizar este documento e o README somente se o uso do template realmente mudar.

### Critérios de conclusão
- A personalização permanece simples e centralizada.
- Nenhum caminho de imagem inexistente é introduzido.
- O fallback mantém a apresentação organizada.

**Status:** ⬜ Pendente

---

## Bloco 7 — Auditoria final e testes de regressão

**Objetivo:** confirmar que o hero animado está pronto sem quebrar o restante do site.

### Passos
1. Executar a suíte de testes existente conforme as instruções do projeto.
2. Testar manualmente menu desktop/mobile, links de âncora, WhatsApp e botões do hero.
3. Verificar carregamento com imagem configurada e com imagem vazia.
4. Testar teclado, foco visível e preferência por movimento reduzido.
5. Inspecionar console do navegador e corrigir erros ou avisos introduzidos pelas alterações.
6. Revisar o diff para remover código duplicado, regras conflitantes e efeitos desnecessários.
7. Registrar o resultado real dos testes, arquivos alterados e limitações restantes.
8. Só então considerar o trabalho pronto para revisão e aguardar autorização para qualquer ação envolvendo `main`.

### Critérios de conclusão
- Testes automatizados executados e resultado registrado.
- Funcionalidades existentes continuam funcionando.
- Layout responsivo, acessível e sem erros introduzidos.
- Nenhuma alteração enviada para `main` sem autorização.

**Status:** ⬜ Pendente

---

## Registro de execução

Atualizar esta tabela ao terminar cada bloco, sem marcar etapas que não foram realmente concluídas.

| Bloco | Status | Evidência / observações |
|---|---|---|
| 1. Auditoria e base visual | Pendente | |
| 2. Composição da capa | Pendente | |
| 3. Movimento cinematográfico | Pendente | |
| 4. Entrada do conteúdo | Pendente | |
| 5. Acessibilidade e responsividade | Pendente | |
| 6. Personalização e fallback | Pendente | |
| 7. Auditoria final | Pendente | |

**Próxima ação:** executar somente o **Bloco 1 — Auditoria e definição da base visual**. Não iniciar o Bloco 2 até revisar e aprovar o resultado do primeiro.
