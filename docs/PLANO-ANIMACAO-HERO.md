# Plano de implementação — Hero animado

**Projeto:** Salão e Estética — template reutilizável  
**Branch obrigatória:** `manutencao`  
**Status:** Blocos 1 a 7 implementados/revisados por inspeção e testes; Bloco 8 implementado com 94/94 testes aprovados no CI; Bloco 9 avaliado, sem alteração funcional por já existir iluminação temática; validação visual em navegador real ainda pendente; Bloco 10 implementado; CI aprovado com 98/98 testes; Bloco 11 planejado  
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
- **Configuração e renderização:** `js/config.js` mantém `hero.imagem` opcional e vazia por padrão. Quando a imagem está configurada, `renderHero()` define a propriedade CSS `--hero-imagem` e adiciona a classe `hero--com-imagem`; o CSS controla a fotografia, o contraste e a animação. Título, destaque e descrição vêm da configuração. Não foi encontrada uma imagem de capa dedicada no repositório; portanto, não se deve pressupor que exista um arquivo de hero pronto.
- **Animações existentes:** há animações de entrada para elementos com `data-reveal`, acionadas por `IntersectionObserver`. Os elementos do hero não usam `data-reveal`, então a futura entrada do conteúdo deverá ser implementada deliberadamente, sem depender do observer das outras seções.
- **Movimento reduzido:** já existe `@media (prefers-reduced-motion: reduce)` que desativa transições e revelações existentes. Qualquer animação nova do hero também precisará respeitar essa preferência explicitamente.
- **Cabeçalho e layout:** o cabeçalho tem estado visual ao rolar (`.is-scrolled`) e a navegação mobile tem lógica própria. A animação não deve alterar altura/fluxo do hero, encobrir os CTAs ou interferir no menu.
- **Testes:** `package.json` define `npm test` como `node tests/run.js`; a suíte usa `jsdom` e verifica renderização, links e interações. A suíte foi executada no GitHub Actions e passou com 86/86 testes; isso cobre comportamentos automatizáveis, não substitui inspeção visual real.
- **Riscos principais:** imagem configurada com caminho inválido; contraste insuficiente; sobreposição entre movimento e texto; animação que cria rolagem horizontal ou deslocamento de layout; preferência de movimento reduzido não aplicada ao hero. O gradiente decorativo do fundo usava cores fixas no CSS; isso foi corrigido durante o Bloco 7 para usar `--cor-primaria` e `--cor-dourado`, com fallback para `--cor-escura` sem suporte a `color-mix()`.
- **Abordagem mínima recomendada para os próximos blocos:** manter a configuração centralizada, preservar o fallback atual, preferir uma camada visual de imagem separada do conteúdo para animar apenas a imagem e manter os elementos textuais estáveis. Evitar dependências novas e não alterar a lógica funcional do menu/CTAs.

Nenhum arquivo funcional foi alterado no Bloco 1. Naquele momento, a auditoria foi feita por inspeção; posteriormente, a suíte foi executada e aprovada (86/86). A responsividade continua avaliada apenas pelas regras e media queries, sem validação visual em dispositivos reais.


### Revisão e refinamento do Bloco 1

- Confirmado que `npm test` executa `node tests/run.js`. A saída esperada no README foi atualizada para 86 testes após a inclusão da cobertura do gradiente temático; a aprovação efetiva está registrada na execução do GitHub Actions.
- Identificado que o fundo decorativo do hero ainda usava tons fixos, apesar da paleta personalizável. Corrigido no Bloco 7: os gradientes agora derivam de `--cor-primaria` e `--cor-dourado`; navegadores sem `color-mix()` recebem fundo sólido `--cor-escura` como fallback. A alteração preserva a personalização sem adicionar dependências.
- Mantida a decisão de não alterar HTML, CSS ou JavaScript no bloco de auditoria. Nenhuma correção funcional era necessária para concluir esta etapa de planejamento.
- **Limite da revisão:** o Bloco 1 foi uma auditoria por inspeção, não uma aprovação funcional. A suíte automatizada foi executada posteriormente (86/86); a validação visual do hero continua pendente no Bloco 7.

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

**Limites desta etapa:** a suíte automatizada passou (86/86 antes da inclusão do teste específico para o gradiente temático). Não houve validação visual em navegador, com carregamento lento ou em aparelhos reais. A auditoria visual de responsividade e acessibilidade continua pendente.

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

**Limites desta etapa:** a suíte automatizada passou (86/86). Ainda não houve medição automatizada de contraste nem inspeção visual em navegador, teclado, leitor de tela ou dispositivos reais. O enquadramento da fotografia configurada também permanece dependente de validação visual.

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

**Limites desta etapa:** a suíte automatizada passou (86/86). O comportamento com arquivo de imagem existente e inexistente ainda precisa ser confirmado visualmente no navegador; o CSS preserva o fundo alternativo caso a imagem não carregue.

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

### Revisão complementar do Bloco 7 — 09/10/2026

- Reinspecionados `initHeroEntrance()`, `renderHero()`, a camada CSS da imagem, a regra `prefers-reduced-motion` e os testes de regressão.
- A entrada do conteúdo só anima elementos visíveis; se a Web Animations API estiver ausente ou falhar, o conteúdo continua disponível. A preferência por movimento reduzido interrompe a animação do hero.
- A imagem é opcional: quando `hero.imagem` está vazia, a classe e a camada fotográfica não são ativadas e o fundo alternativo continua sendo usado. O CSS declara `100vh` antes de `100svh` como fallback de altura.
- A suíte headless cobre regressões de comportamento, mas não consegue confirmar contraste real, enquadramento em telas físicas, foco visual do navegador ou mensagens do console durante uma navegação real.
- Não foi encontrada nesta revisão estática uma falha objetiva que justificasse alterar o JavaScript ou o CSS sem evidência adicional. Por isso, não foi introduzida mudança funcional apenas para gerar um diff.
- O commit `756095f698a67849c368078e5ec7620cd5c4c6be` passou nos workflows de testes e publicação do GitHub Actions. O log dos testes confirmou **87/87 aprovados**. O aviso de depreciação `DEP0040` sobre `punycode` apareceu no encerramento do job e não falhou a suíte; não há evidência de que seja causado pelo código do hero.
- **Decisão:** revisão técnica automatizada aprovada; Bloco 7 continua aberto somente pela validação visual manual prevista nos critérios. Não iniciar o Bloco 8 antes de resolver ou aceitar explicitamente essa limitação.


- Encontrado um defeito em `initHeroEntrance()`: o código usava `querySelector()` (`$`) para obter um único elemento e depois chamava `.filter()`. Isso podia lançar erro e impedir a sequência de animação.
- Corrigido em `js/script.js`: agora usa `querySelectorAll()` (`$$`) antes de filtrar os elementos ocultos. A correção está no commit `26bd3191ef4abb2f2e2679de0f9712a25d890a65`.
- A suíte contém verificações para erros de runtime, os quatro grupos animados, campos ocultos, movimento reduzido, ícones, links e interações do template. Após a execução remota, foram corrigidos dois defeitos nos próprios testes: contagem de CTAs usando seletor de elemento único e simulação de WhatsApp ausente que alterava o campo errado.
- A execução local neste ambiente continuou bloqueada por DNS ao acessar `github.com`; para obter resultado real, foi adicionado o workflow `.github/workflows/testes.yml`, que instala dependências e executa a suíte no GitHub Actions.
- A revisão estática confirmou a configuração centralizada em `js/config.js`, o tratamento de movimento reduzido, a ocultação de campos vazios e o fallback do CTA principal sem WhatsApp.
- Teste de regressão acrescentado em `tests/run.js` no commit `245008a811eaca9c7d38225dd6673b7942e1fbf3` para simular falha da Web Animations API e confirmar que conteúdo/CTA continuam disponíveis.
- Reforçada a cobertura em `tests/run.js` para os ícones do WhatsApp/redes sociais e para todos os elementos `[data-icone]`.
- A revisão identificou que alguns elementos `[data-icone]` são criados dinamicamente depois da primeira renderização dos ícones. Corrigido em `js/script.js` com a função reutilizável `renderStaticIcons()`, executada antes da inicialização e novamente depois da renderização das seções. Commit `b3bc5a743e4b85adbffbe7667fa0badabc03c4df`.
- A execução mais recente da suíte no GitHub Actions passou: **87 testes aprovados, 0 falhas**, no commit `386901b8123388aa9429845dd084670d249f4160` ([ver execução](https://github.com/alair-code/salao-estetica/actions/runs/37925536025)). Os passos de checkout, configuração do Node.js 24, instalação de dependências e `npm test` concluíram com sucesso. O log também registra um aviso `DEP0040` sobre `punycode`, emitido no encerramento do job; não causou falha nos testes e deve ser tratado como aviso de dependência/ferramenta, sem atribuí-lo ao código do hero sem investigação adicional.
- **Pendências:** a URL pública do GitHub Pages foi fornecida (`https://alair-code.github.io/salao-estetica/`), mas a ferramenta disponível não conseguiu carregar a página para inspeção visual direta. Validar visualmente desktop/mobile, foco por teclado, imagem configurada/inválida e console do navegador. A configuração atual mantém `hero.imagem` vazia, então o fundo alternativo é o comportamento esperado e a animação da fotografia não será exibida até configurar uma imagem válida. A aprovação headless não substitui inspeção visual em navegador real.
- Na revisão seguinte, identificado e corrigido um detalhe de compatibilidade: `.hero` agora declara `min-height: 100vh` antes de `100svh`, mantendo o comportamento moderno e oferecendo fallback para navegadores que não reconhecem a unidade `svh`. Foi acrescentado um teste de regressão para essa ordem. A CI subsequente confirmou **87/87 testes aprovados** no commit `59203c36ad899f0ff14c89909f9b0376a1c53a53`.
---

## Registro de execução

Atualizar esta tabela ao terminar cada bloco, sem marcar etapas que não foram realmente concluídas.

| Bloco | Status | Evidência / observações |
|---|---|---|
| 1. Auditoria e base visual | Revisado por inspeção | Auditoria refinada; nenhum arquivo funcional alterado neste bloco. Suíte automatizada aprovada (86/86); validação visual ainda pendente. |
| 2. Composição da capa | Implementado; revisão por inspeção concluída | Imagem configurável em camada separada e enquadramento desktop/mobile definidos; gradientes usam a paleta do cliente, com fallback sólido para navegadores sem `color-mix()`. Suíte automatizada aprovada (86/86); validação visual com fotografia real pendente. |
| 3. Movimento cinematográfico | Implementado e refinado; revisão por inspeção concluída | Zoom CSS lento em camada isolada, respeita movimento reduzido e possui fallback de contraste/imagem para navegadores sem `color-mix()`. Testes automatizados aprovados (86/86); validação visual e desempenho em dispositivos reais ainda pendentes. |
| 4. Entrada do conteúdo | Implementado; revisão por inspeção concluída | Web Animations API com sequência curta; conteúdo permanece visível sem suporte à API e com movimento reduzido. Testes automatizados aprovados (86/86); validação visual pendente. |
| 5. Acessibilidade e responsividade | Implementado; revisão por inspeção concluída | Movimento reduzido desativa animações CSS e remove atrasos de transição; ajuste tipográfico do hero até 420 px. Suíte automatizada aprovada (86/86); contraste e responsividade visual em dispositivos reais pendentes. |
| 6. Personalização e fallback | Implementado; revisão por inspeção concluída | Configuração continua centralizada em `js/config.js`; campos vazios são ocultados, CTA de WhatsApp sem destino não aparece e o fallback de imagem é testado. Suíte automatizada aprovada (86/86); validação visual de imagem ausente/inválida pendente. |
| 7. Auditoria final | Auditoria automatizada aprovada; validação manual pendente | No commit atual `386901b8123388aa9429845dd084670d249f4160`, GitHub Actions confirmou **87/87 testes aprovados** ([execução](https://github.com/alair-code/salao-estetica/actions/runs/37925536025)) e GitHub Pages concluiu a publicação ([execução](https://github.com/alair-code/salao-estetica/actions/runs/37925535971)). A ferramenta não conseguiu carregar a página para inspeção visual. `hero.imagem` está vazio na configuração da branch, então o fundo alternativo é esperado. Falta inspeção visual em navegador real: desktop/celular, contraste, foco/teclado, menu, CTAs, imagem válida/inválida e console. **Não iniciar o Bloco 8 até esta limitação visual ser resolvida ou explicitamente aceita.** |
| 8. Movimento lateral | Implementado; testes automatizados aprovados | `hero.movimento` aceita `zoom`, `lateral` e `nenhum`; CI aprovou 94/94 testes no commit `781f93d`. Inspeção visual em navegador real permanece pendente. |
| 9. Iluminação ambiente | Avaliado; efeito adicional não implementado | O hero já usa gradientes radiais temáticos. Para evitar duplicação e complexidade sem benefício visual demonstrado, foi mantida a composição atual; nenhuma mudança funcional neste bloco. Validação visual ainda pendente. |

**Projeto:** Salão e Estética — template reutilizável  
**Branch obrigatória:** `manutencao`  
**Status atualizado em 09/10/2026:** Blocos 1 a 7 implementados/revisados; Bloco 8 com 94/94 testes aprovados; Bloco 9 avaliado sem mudanças funcionais; validação visual em navegador real continua pendente; a configuração padrão usa o fundo alternativo porque `hero.imagem` está vazia  
**Objetivo:** transformar a primeira dobra (hero) em uma capa elegante, moderna e chamativa, adequada a salão de beleza e estética, sem prejudicar leitura, acessibilidade, desempenho ou personalização por cliente.

---

### Decisão de continuidade do Bloco 7 — 09/10/2026

A solicitação “prossiga” foi interpretada como autorização para avançar apesar da limitação visual já registrada. A inspeção manual em navegador real continua pendente e não será declarada como concluída. Os testes automatizados e a publicação do commit anterior passaram; essa evidência não substitui a verificação visual em desktop/celular.

---

## Bloco 8 — Movimento lateral configurável da imagem

**Objetivo:** oferecer uma alternativa ao zoom cinematográfico, com deslocamento lateral mínimo e suave, sem somar movimentos fortes.

### Implementação
- Adicionada a opção `hero.movimento` em `js/config.js`: `"zoom"` (padrão), `"lateral"` ou `"nenhum"`.
- Configurações antigas sem essa propriedade continuam usando o zoom atual.
- O movimento lateral atua apenas na camada decorativa da fotografia; texto, botões e layout permanecem fora da animação.
- A camada lateral usa ampliação e margem excedente para reduzir o risco de revelar bordas vazias durante o deslocamento.
- A opção `"nenhum"` mantém a fotografia estática; `prefers-reduced-motion: reduce` continua desativando animações independentemente da configuração.
- Nenhuma dependência nova foi adicionada.

### Critérios de conclusão
- O movimento lateral é sutil e não compete com o conteúdo.
- Não surgem bordas vazias, rolagem horizontal ou mudanças de layout.
- A opção padrão mantém o zoom atual.
- O usuário consegue desativar o movimento sem perder conteúdo ou funcionalidade.

**Status:** Implementado e validado por CI — 91/91 testes aprovados no commit `069a66ec3e05f2e05d168b66f15e55db0a212f8c`. Validação visual em navegador real continua pendente.


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

**Status:** ✅ Avaliado — não implementado por decisão técnica.

### Resultado da avaliação — 09/10/2026

- Inspecionadas as camadas atuais do hero: o fundo já combina gradientes radiais baseados nas cores configuráveis do tema; a camada fotográfica mantém sua própria composição e o conteúdo fica acima dela.
- O efeito de iluminação estática pretendido já existe no estado atual. Adicionar outra camada ou animar o brilho não demonstra benefício funcional comprovável sem inspeção visual real e poderia aumentar a complexidade ou competir com o texto/fotografia.
- Para evitar duplicação visual, animação desnecessária e custo adicional de manutenção, **nenhum CSS ou JavaScript foi alterado neste bloco**.
- A decisão é conservadora: manter a iluminação ambiente existente e reavaliar somente se uma inspeção visual em navegador indicar uma deficiência concreta.
- Limitação mantida: esta avaliação é estática; não equivale à aprovação visual em desktop ou celular.

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

**Status:** ✅ Implementado e validado por CI — 98/98 testes aprovados no commit `97a7c6f34476c683b8e2426831d8892307b2a1a2`. Validação visual real continua pendente.

### Resultado do Bloco 10

- Adicionada a propriedade opcional `hero.imagens`, sem remover nem alterar o uso legado de `hero.imagem`.
- A dissolução usa duas camadas CSS, com ciclo lento de 16 segundos; apenas as duas primeiras imagens válidas são usadas, evitando carregar uma galeria inteira no hero.
- Zero ou uma imagem na lista mantém a apresentação estática antiga. A imagem principal `hero.imagem` continua funcionando como antes quando a lista não tem duas entradas válidas.
- Textos e CTAs permanecem fora das camadas visuais; elas não recebem eventos de ponteiro e ficam ocultas de tecnologias assistivas.
- `prefers-reduced-motion: reduce` mantém a primeira camada estática e desativa a transição.
- Limitação: validação visual com fotografias reais e falhas reais de carregamento ainda está pendente.

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

1. **Fechar a pendência visual do Bloco 7** — conferir hero, foco, menu, CTAs e imagem em navegador real quando houver ambiente de validação.
2. **Fechar a pendência visual do Bloco 8** — verificar zoom, lateral e movimento desativado em desktop e celular.
3. **Bloco 9** — avaliar iluminação ambiente sutil, somente se agregar valor sem complexidade excessiva.
4. **Bloco 10** — implementado; falta validar visualmente com imagens reais.
5. **Bloco 11** — auditoria integrada e regressão de todos os efeitos.

Não antecipar os blocos seguintes. Ao terminar cada etapa, revisar o código, executar os testes disponíveis, registrar limitações reais neste documento e só então avançar.
