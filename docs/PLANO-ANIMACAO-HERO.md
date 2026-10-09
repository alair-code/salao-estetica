# Plano de implementação — Hero animado

**Projeto:** Salão e Estética — template reutilizável  
**Branch obrigatória:** `manutencao`  
**Status:** Blocos 1 a 6 implementados/revisados por inspeção; Bloco 7 em andamento — correção estática aplicada, testes automatizados e validação visual pendentes; Blocos 8 a 11 planejados  
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

**Status:** ✅ Concluído — auditoria realizada; nenhum arquivo funcional foi alterado.

### Resultado da auditoria

- **HTML (index.html):** o hero é a seção `#inicio.hero`, com etiqueta, título, descrição, dois CTAs e detalhe de cidade dentro de `.hero__conteudo`. A estrutura é semântica e os links existentes devem ser preservados.
- **CSS (css/style.css):** o hero já tem fundo alternativo em gradientes e padrão decorativo; no desktop usa `min-height: 100svh`, alinhamento vertical e espaçamento responsivo. A classe `.hero--com-imagem` usa `background-size: cover` e `background-position: center`. Em telas de até 820px a altura passa a ser automática; até 640px os botões ocupam a largura disponível.
- **Configuração e renderização:** `js/config.js` mantém `hero.imagem` opcional e vazia por padrão. `renderHero()` em `js/script.js` aplica a imagem e um gradiente escuro inline somente quando o caminho está preenchido. Título, destaque e descrição vêm da configuração. Não foi encontrada uma imagem de capa dedicada no repositório; portanto, não se deve pressupor que exista um arquivo de hero pronto.
- **Animações existentes:** há animações de entrada para elementos com `data-reveal`, acionadas por `IntersectionObserver`. Os elementos do hero não usam `data-reveal`, então a futura entrada do conteúdo deverá ser implementada deliberadamente, sem depender do observer das outras seções.
- **Movimento reduzido:** já existe `@media (prefers-reduced-motion: reduce)` que desativa transições e revelações existentes. Qualquer animação nova do hero também precisará respeitar essa preferência explicitamente.
- **Cabeçalho e layout:** o cabeçalho tem estado visual ao rolar (`.is-scrolled`) e a navegação mobile tem lógica própria. A animação não deve alterar altura/fluxo do hero, encobrir os CTAs ou interferir no menu.
- **Testes:** `package.json` define `npm test` como `node tests/run.js`; a suíte usa `jsdom` e verifica renderização e interações. O README informa 56 testes esperados, mas a suíte não foi executada nesta auditoria remota — esse número não foi tratado como resultado confirmado.
- **Riscos principais:** imagem configurada com caminho inválido; contraste insuficiente; sobreposição entre movimento e texto; animação que cria rolagem horizontal ou deslocamento de layout; preferência de movimento reduzido não aplicada ao hero. O gradiente de contraste atualmente é montado em `js/script.js` com valores de cor fixos (`rgba(28,20,16,...)`), portanto não acompanha diretamente a paleta do cliente.
- **Abordagem mínima recomendada para os próximos blocos:** manter a configuração centralizada, preservar o fallback atual, preferir uma camada visual de imagem separada do conteúdo para animar apenas a imagem e manter os elementos textuais estáveis. Evitar dependências novas e não alterar a lógica funcional do menu/CTAs.

Nenhum arquivo funcional foi alterado neste bloco. A auditoria foi feita por inspeção do código no GitHub; testes visuais em navegador e execução da suíte ainda não foram realizados. A responsividade foi avaliada apenas pelas regras e media queries existentes, não validada visualmente em dispositivos reais.


### Revisão e refinamento do Bloco 1

- Confirmado que `npm test` executa `node tests/run.js` e que o README declara 56 testes como saída esperada. Isso é documentação do projeto, não evidência de que os testes passaram nesta etapa.
- Refinada a lista de riscos para registrar que o gradiente de contraste atual usa cores fixas no JavaScript. No Bloco 2, avaliar uma solução em CSS que mantenha o contraste e respeite melhor a identidade configurada, sem mudar a aparência sem necessidade.
- Mantida a decisão de não alterar HTML, CSS ou JavaScript no bloco de auditoria. Nenhuma correção funcional era necessária para concluir esta etapa de planejamento.
- **Limite da revisão:** não houve execução local da suíte nem validação visual em navegador; por isso, este bloco está pronto como auditoria/documentação, mas não representa aprovação funcional do hero animado.

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

**Status:** ✅ Implementado e revisado por inspeção de código

### Resultado do Bloco 2

- A imagem continua opcional e vem de `hero.imagem` em `js/config.js`; nenhum arquivo de mídia novo foi inventado ou adicionado.
- A composição da imagem e o contraste agora ficam no CSS. O gradiente usa `--cor-escura`, acompanhando a paleta configurada pelo cliente em vez de depender de valores fixos no JavaScript.
- Em telas maiores, a imagem prioriza o lado direito para reservar área visual ao conteúdo à esquerda. Em telas pequenas, será necessário validar o enquadramento real com imagens representativas; isso fica registrado como verificação pendente da etapa de responsividade.
- Sem imagem configurada, a classe e a camada de mídia não são aplicadas, preservando o fundo alternativo. Se o arquivo configurado falhar ao carregar, o fundo escuro e o gradiente continuam oferecendo uma base de contraste.
- Foram acrescentadas verificações automatizadas para o caso sem imagem e para a passagem do caminho configurado à camada visual. A suíte ainda precisa ser executada em ambiente com as dependências instaladas; não se declara resultado de testes nesta atualização.

**Limites desta etapa:** não foi feita validação visual em navegador nem confirmado o enquadramento com uma fotografia real. O suporte a `color-mix()` é usado para misturar a cor do tema com transparência; navegadores antigos sem esse recurso devem ser verificados na auditoria final.

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

**Status:** ✅ Implementado; revisão por inspeção concluída

### Resultado do Bloco 3

- A fotografia foi isolada em uma camada decorativa `::after`, para que o zoom não mova título, descrição, botões ou o fluxo do documento.
- Foi adicionada uma animação CSS lenta de escala (28 segundos, alternada entre 1,02 e 1,09), sem JavaScript nem dependências adicionais.
- A camada não recebe eventos de ponteiro, preservando os cliques nos CTAs.
- A animação é desligada em `prefers-reduced-motion: reduce`; o enquadramento mobile foi transferido para a camada visual.
- Foi adicionado um fallback com `@supports` para navegadores sem `color-mix()`, usando a cor configurável `--cor-escura` para manter uma composição de contraste e preservar a imagem.
- O teste de movimento fluido e desempenho em dispositivos reais ainda não foi executado. A suíte headless existente não comprova fluidez visual, e a capa ainda precisa ser conferida com uma fotografia real.

**Limites desta etapa:** o zoom animado transforma apenas a camada visual e foi dimensionado para evitar bordas vazias; ainda é necessária validação visual no navegador para confirmar enquadramento e desempenho em aparelhos reais.

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

**Status:** ✅ Implementado; revisão por inspeção concluída

### Resultado do Bloco 4

- A entrada suave é aplicada à etiqueta, ao título, à descrição e ao grupo de botões do hero, com deslocamento vertical de 12 px, duração de 620 ms e intervalos de 90 ms.
- A animação usa a Web Animations API, sem dependências adicionais e sem regras CSS que deixem o conteúdo invisível por padrão.
- Se a API não estiver disponível, se a consulta de preferência não puder ser feita ou se uma animação falhar, o conteúdo continua visível. A preferência `prefers-reduced-motion: reduce` desativa a sequência.
- A animação é inicializada após a renderização e as interações principais, sem mudar o fluxo ou a posição final do layout; os links e CTAs existentes foram preservados.
- Foram adicionados testes à suíte para verificar a presença do conteúdo e dos CTAs, o fallback quando a Web Animations API não existe, a sequência de atrasos e o respeito à preferência de movimento reduzido.

**Limites desta etapa:** os testes foram adicionados, mas não executados neste ambiente remoto. Não houve validação visual em navegador, com carregamento lento ou em aparelhos reais. A auditoria completa de responsividade e acessibilidade continua no Bloco 5.

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

**Status:** ✅ Implementado; revisão por inspeção concluída

### Resultado do Bloco 5

- A preferência `prefers-reduced-motion: reduce` agora desativa animações CSS globalmente e reduz a duração das transições, zerando também seus atrasos. Isso evita que itens do menu mobile com atrasos em cascata permaneçam temporariamente invisíveis.
- O movimento cinematográfico da imagem do hero continua explicitamente desativado quando o usuário solicita movimento reduzido.
- O título do hero usa `text-wrap: balance` para melhorar a distribuição das linhas quando suportado e ajusta o tamanho da fonte em telas de até 420 px.
- O foco visível já existente e a estrutura dos CTAs foram preservados; a imagem e o movimento continuam decorativos, sem serem necessários para compreender o conteúdo.
- Foram adicionadas verificações à suíte para as regras de movimento reduzido e o ajuste tipográfico em telas estreitas.

**Limites desta etapa:** as verificações foram adicionadas, mas a suíte não foi executada neste ambiente remoto. Não houve medição automatizada de contraste nem inspeção visual em navegador, teclado, leitor de tela ou dispositivos reais. O enquadramento da fotografia configurada também permanece dependente de validação visual.

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

**Status:** ✅ Implementado; revisão por inspeção concluída

### Resultado do Bloco 6

- Confirmado que a imagem do hero e os textos permanecem centralizados em `js/config.js`; não foi necessário criar novas opções de animação nem mover dados de cliente para o CSS.
- Refinado `renderHero()` para ocultar etiqueta, título, descrição e botões quando os respectivos valores opcionais estiverem vazios, evitando espaços sem conteúdo no topo do site.
- O grupo de ações também é ocultado quando os dois botões estão vazios. Se apenas um texto de botão estiver preenchido, o botão correspondente continua disponível.
- Refinado o fallback do CTA principal: se o WhatsApp não estiver configurado, o botão de agendamento é ocultado para não exibir um link sem destino; o botão secundário continua funcionando.
- A animação de entrada ignora elementos ocultos, para não animar campos vazios nem acrescentar atrasos desnecessários aos itens visíveis.
- A imagem continua opcional: caminho vazio ou composto apenas por espaços não ativa a camada fotográfica; o fundo alternativo permanece disponível.
- Adicionados testes para campos opcionais vazios, fallback de imagem e ausência de WhatsApp, garantindo que o CTA principal seja ocultado sem desativar o botão secundário.

**Limites desta etapa:** os testes foram adicionados, mas não executados neste ambiente remoto. O comportamento com arquivo de imagem existente e inexistente precisa ser confirmado visualmente no navegador; o CSS preserva o fundo alternativo caso a imagem não carregue.

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

### Resultado parcial da auditoria final

- Encontrado um defeito em `initHeroEntrance()`: o código usava `querySelector()` (`$`) para obter um único elemento e depois chamava `.filter()`. Isso podia lançar erro e impedir a sequência de animação.
- Corrigido em `js/script.js`: agora usa `querySelectorAll()` (`$$`) antes de filtrar os elementos ocultos. A correção está no commit `26bd3191ef4abb2f2e2679de0f9712a25d890a65`.
- A suíte contém verificações para erros de runtime, os quatro grupos animados, campos ocultos e movimento reduzido. Foi acrescentado um caso em que `Element.prototype.animate()` lança uma exceção, verificando que o conteúdo e o CTA continuam visíveis. Esses testes ainda precisam ser executados.
- Tentativa de executar `git clone` e `npm ci && npm test` falhou antes da instalação porque o ambiente não conseguiu resolver `github.com` (erro DNS). Nenhum teste automatizado é declarado como aprovado.
- A revisão estática confirmou a configuração centralizada em `js/config.js`, o tratamento de movimento reduzido, a ocultação de campos vazios e o fallback do CTA principal sem WhatsApp.
- Teste de regressão acrescentado em `tests/run.js` no commit `245008a811eaca9c7d38225dd6673b7942e1fbf3` para simular falha da Web Animations API e confirmar que conteúdo/CTA continuam disponíveis.
- Reforçada a cobertura em `tests/run.js` para os ícones do WhatsApp/redes sociais e para todos os elementos `[data-icone]`.
- A revisão identificou que alguns elementos `[data-icone]` são criados dinamicamente depois da primeira renderização dos ícones. Corrigido em `js/script.js` com a função reutilizável `renderStaticIcons()`, executada antes da inicialização e novamente depois da renderização das seções. Commit `b3bc5a743e4b85adbffbe7667fa0badabc03c4df`.
- A suíte automatizada **não foi executada**: a tentativa de clonar o repositório falhou porque o ambiente não conseguiu resolver `github.com` (erro DNS). Não há resultado de aprovação.
- **Pendências:** executar `npm ci && npm test` em ambiente com acesso ao repositório e ao npm; validar visualmente desktop/mobile, foco por teclado, imagem configurada/inválida e console do navegador.
---

## Registro de execução

Atualizar esta tabela ao terminar cada bloco, sem marcar etapas que não foram realmente concluídas.

| Bloco | Status | Evidência / observações |
|---|---|---|
| 1. Auditoria e base visual | Concluído e revisado | Auditoria refinada; gradiente com cores fixas registrado como ponto de atenção. Nenhum arquivo funcional alterado. Testes automatizados e validação visual não executados. |
| 2. Composição da capa | Implementado; revisão por inspeção concluída | CSS com gradiente ligado à cor do tema, imagem configurável separada e enquadramento desktop/mobile definido. Testes adicionados, mas ainda não executados; validação visual com fotografia real pendente. |
| 3. Movimento cinematográfico | Implementado e refinado; revisão por inspeção concluída | Zoom CSS lento em camada isolada, respeita movimento reduzido e possui fallback de contraste/imagem para navegadores sem `color-mix()`. Validação visual, testes automatizados e desempenho em dispositivos reais ainda pendentes. |
| 4. Entrada do conteúdo | Implementado; revisão por inspeção concluída | Web Animations API com sequência curta; conteúdo permanece visível sem suporte à API e com movimento reduzido. Testes adicionados, ainda não executados; validação visual pendente. |
| 5. Acessibilidade e responsividade | Implementado; revisão por inspeção concluída | Movimento reduzido desativa animações CSS e remove atrasos de transição; ajuste tipográfico do hero até 420 px; testes adicionados. Suíte não executada; contraste e responsividade visual em dispositivos reais pendentes. |
| 6. Personalização e fallback | Implementado; revisão por inspeção concluída | Configuração continua centralizada em `js/config.js`; campos vazios são ocultados, CTA de WhatsApp sem destino não aparece e o fallback de imagem é testado. Suíte ainda não executada; validação visual de imagem ausente/inválida pendente. |
 → `$`); ampliados os testes de regressão para falha da Web Animations API e renderização dos ícones estáticos. Os testes ainda não foram executados neste ambiente; validação visual pendente. |

**Projeto:** Salão e Estética — template reutilizável  
**Branch obrigatória:** `manutencao`  
**Status:** Blocos 1 a 6 implementados/revisados por inspeção; Bloco 7 em andamento — auditoria estática e correção aplicadas, testes e validação visual pendentes  
**Objetivo:** transformar a primeira dobra (hero) em uma capa elegante, moderna e chamativa, adequada a salão de beleza e estética, sem prejudicar leitura, acessibilidade, desempenho ou personalização por cliente.

---

## Bloco 8 — Movimento lateral configurável da imagem

**Objetivo:** oferecer uma alternativa ao zoom cinematográfico, com deslocamento lateral mínimo e suave, sem somar movimentos fortes.

### Passos
1. Inspecionar a animação atual da camada de imagem antes de alterar qualquer regra.
2. Tornar o tipo de movimento configurável em `js/config.js`, se a estrutura atual permitir fazê-lo sem duplicar configurações.
3. Permitir escolher entre o zoom existente e um deslocamento lateral discreto; não executar os dois efeitos simultaneamente por padrão.
4. Garantir que a camada tenha área suficiente para não revelar bordas vazias durante o deslocamento.
5. Preservar o enquadramento responsivo e o conteúdo estático sobre a imagem.
6. Manter o movimento desativado para quem usa `prefers-reduced-motion: reduce`.

### Critérios de conclusão
- O movimento lateral é sutil e não compete com o conteúdo.
- Não surgem bordas vazias, rolagem horizontal ou mudanças de layout.
- A opção padrão mantém o comportamento atual até que a nova alternativa seja validada.
- O usuário consegue desativar o movimento sem perder conteúdo ou funcionalidade.

**Status:** ⏳ Planejado — iniciar somente após concluir o Bloco 7.

---

## Bloco 9 — Efeito de iluminação ambiente sutil

**Objetivo:** acrescentar profundidade visual à capa sem alterar a fotografia de forma agressiva.

### Passos
1. Inspecionar as camadas e os gradientes atuais para evitar sobreposição redundante.
2. Se houver benefício visual real, criar um efeito CSS discreto de iluminação/gradiente usando as variáveis de tema existentes.
3. Manter a iluminação separada do texto, dos botões e da camada que movimenta a fotografia.
4. Evitar flashes, brilho intenso, pulsação rápida e mudanças que reduzam o contraste.
5. Desativar o movimento da iluminação quando `prefers-reduced-motion: reduce` estiver ativo.
6. Se o efeito não melhorar a composição ou exigir complexidade desnecessária, registrar a decisão de não implementá-lo.

### Critérios de conclusão
- A iluminação é sutil, coerente com a paleta do cliente e não prejudica a legibilidade.
- O fallback sem imagem continua correto.
- O efeito não cria camadas desnecessárias nem conflitos de desempenho.

**Status:** ⏳ Planejado — iniciar somente após concluir o Bloco 8.

---

## Bloco 10 — Transição suave entre imagens opcionais

**Objetivo:** permitir uma alternância elegante entre imagens da capa quando o cliente configurar mais de uma, mantendo uma única imagem como comportamento padrão.

### Passos
1. Verificar se o modelo atual de `js/config.js` comporta uma lista de imagens sem quebrar a opção `hero.imagem` existente.
2. Definir a lista de imagens como recurso estritamente opcional; não criar imagens fictícias nem exigir novas mídias.
3. Quando houver mais de uma imagem válida, implementar transição por dissolução (*crossfade*) com intervalo confortável.
4. Com zero ou uma imagem válida, manter a apresentação atual sem carrossel automático.
5. Evitar baixar todas as imagens em alta resolução ao mesmo tempo; considerar carregamento eficiente e falhas individuais.
6. Respeitar `prefers-reduced-motion: reduce`, desativando a transição automática ou usando uma apresentação estática.
7. Garantir que a alternância não mova o texto, não interfira nos CTAs e não cause flashes ou saltos.
8. Não adicionar dependências externas sem necessidade.

### Critérios de conclusão
- A configuração antiga com `hero.imagem` continua funcionando.
- Uma lista vazia ou inválida não quebra o hero.
- Com uma imagem, não há troca automática; com várias imagens válidas, a transição é suave.
- Erros de carregamento não deixam a capa vazia nem interrompem a página.
- A preferência por movimento reduzido é respeitada.

**Status:** ⏳ Planejado — iniciar somente após concluir o Bloco 9.

---

## Bloco 11 — Auditoria integrada dos efeitos adicionais

**Objetivo:** validar o conjunto de animações e confirmar que o template continua simples de personalizar e seguro para reutilização.

### Passos
1. Executar a suíte de testes existente e registrar a saída real.
2. Verificar as combinações de configuração: movimento padrão, movimento alternativo, animação desativada e lista opcional de imagens.
3. Validar visualmente em desktop, tablet e celular, com imagens reais representativas e sem imagem configurada.
4. Verificar foco de teclado, legibilidade, links, CTAs, WhatsApp e menu.
5. Testar `prefers-reduced-motion: reduce` e o fallback quando uma animação ou imagem falhar.
6. Conferir console, desempenho percebido e ausência de rolagem horizontal.
7. Revisar o diff para remover complexidade, duplicações e efeitos sem benefício demonstrável.
8. Atualizar o resumo do documento e o README somente se houver mudança relevante no uso do template.
9. Manter todas as alterações na branch `manutencao`; não integrar com `main` sem autorização explícita.

### Critérios de conclusão
- Os testes foram executados e seus resultados estão registrados sem suposições.
- Os efeitos podem ser desativados e não são necessários para acessar o conteúdo.
- A capa continua responsiva, legível, personalizável e funcional com ou sem imagens.
- Limitações de validação visual ou de dispositivos reais ficam declaradas.

**Status:** ⏳ Planejado — iniciar somente após concluir os Blocos 8, 9 e 10.

---

## Ordem de execução a partir daqui

1. **Concluir o Bloco 7** — auditoria final, testes de regressão e validação visual do que já existe.
2. **Bloco 8** — movimento lateral como alternativa configurável ao zoom.
3. **Bloco 9** — iluminação ambiente sutil, somente se agregar valor sem complexidade excessiva.
4. **Bloco 10** — dissolução entre imagens, recurso opcional para clientes que configurarem várias capas.
5. **Bloco 11** — auditoria integrada e regressão de todos os efeitos.

Não antecipar os blocos seguintes. Ao terminar cada etapa, revisar o código, executar os testes disponíveis, registrar limitações reais neste documento e só então avançar.
