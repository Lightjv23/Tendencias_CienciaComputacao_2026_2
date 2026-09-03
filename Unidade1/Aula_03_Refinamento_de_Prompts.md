# Aula 03 - Refinamento de Prompts

**Disciplina:** Tendências em Ciência da Computação  
**Data:** 03/09  
**Duração:** 1h30  
**Tema:** Refinamento de Prompts  
**Metodologia:** Aula expositiva dialogada + Hands On + reflexão crítica  
**Atividade prática:** Comparação de resultados obtidos com diferentes prompts  
**Competência:** Ajustar e refinar prompts para obter respostas mais precisas, relevantes e adequadas ao objetivo proposto.

---

## 1. Competência da aula

Ao concluir a aula, espera-se que o estudante seja capaz de:

> **Analisar os resultados produzidos por diferentes prompts, identificar limitações e realizar ajustes estratégicos na formulação das instruções para aumentar a precisão, relevância e adequação das respostas geradas por sistemas de Inteligência Artificial.**

---

## 2. Objetivos de aprendizagem

Ao final da aula, o estudante deverá ser capaz de:

- compreender o refinamento de prompts como um processo iterativo;
- identificar problemas em prompts pouco específicos;
- analisar criticamente respostas produzidas por IA generativa;
- modificar contexto, objetivo, público, formato e restrições;
- comparar diferentes versões de um mesmo prompt;
- reconhecer que uma resposta bem escrita não é necessariamente uma resposta correta;
- validar informações produzidas por sistemas de IA;
- utilizar IA de maneira crítica, responsável e transparente.

---

## 3. Organização da aula

| Tempo | Etapa | Atividade |
|---:|---|---|
| 10 min | Abertura | Problematização e retomada da aula anterior |
| 15 min | Saber | Conceito de refinamento de prompts |
| 15 min | Demonstração | Comparação entre três versões de um prompt |
| 35 min | Fazer | Atividade Hands On |
| 10 min | Ser | Validação, ética e responsabilidade |
| 5 min | Investigação | Take Away |
| **90 min** | **Total** | |

---

## 4. Contextualização

Você está atuando como estudante de Ciência da Computação e deverá investigar como pequenas mudanças na formulação de um prompt podem alterar significativamente uma resposta produzida por uma ferramenta de Inteligência Artificial Generativa.

O objetivo desta atividade não é simplesmente conseguir uma resposta que pareça "boa". O objetivo é investigar:

> **Como a formulação do prompt influencia a qualidade da resposta?**

Durante a atividade, você deverá seguir o ciclo:

```text
CRIAR
  v
TESTAR
  v
ANALISAR
  v
REFINAR
  v
TESTAR NOVAMENTE
  v
COMPARAR
  v
VALIDAR
```

---

# SABER - Fundamentos do Refinamento de Prompts

## 5. O que significa refinar um prompt?

Refinar um prompt significa **modificar estrategicamente uma instrução a partir da análise do resultado produzido pela IA**.

O processo não consiste apenas em adicionar mais palavras. Um prompt maior não é necessariamente melhor. Um prompt deve fornecer informações que realmente ajudem a IA a compreender:

- quem deve responder;
- qual é a tarefa;
- qual é o contexto;
- quem receberá a resposta;
- quais limites devem ser respeitados;
- qual formato deve ser utilizado;
- quais características o resultado deve apresentar.

A cartilha *IA no comando? Você no controle* recomenda que bons comandos indiquem elementos como **perfil, tarefa, cenário, passo a passo, exemplo e formato de saída**. Essa estrutura ajuda a reduzir ambiguidades e tornar a solicitação mais orientada ao objetivo.

---

## 6. Do prompt inicial ao prompt refinado

Considere o exemplo a seguir.

### Prompt 1 - Inicial

```text
Explique aprendizado de máquina.
```

O prompt apresenta uma tarefa, mas várias informações estão ausentes. A IA precisa inferir:

- Para quem será a explicação?
- Qual nível de profundidade?
- Com qual finalidade?
- Que exemplos utilizar?
- Qual deve ser o tamanho?
- Qual formato deve ser utilizado?

### Prompt 2 - Primeiro refinamento

```text
Atue como professor de Ciência da Computação.

Explique aprendizado de máquina para estudantes
iniciantes de graduação.

Apresente:
1. uma definição;
2. como funciona;
3. três exemplos de aplicações no cotidiano;
4. uma comparação entre aprendizado supervisionado
   e não supervisionado.

Utilize linguagem acessível e limite a resposta
a aproximadamente 500 palavras.
```

Agora a IA possui:

- papel;
- público;
- objetivo;
- conteúdo esperado;
- estrutura;
- restrição;
- linguagem.

### Prompt 3 - Segundo refinamento

```text
Atue como professor de Ciência da Computação
especializado em Inteligência Artificial.

CONTEXTO:
Os estudantes estão no primeiro semestre e ainda
não estudaram estatística nem algoritmos de Machine Learning.

OBJETIVO:
Fazer com que consigam compreender intuitivamente
o conceito de aprendizado de máquina.

TAREFA:
Explique o conceito apresentando:
1. definição em linguagem simples;
2. analogia com uma situação cotidiana;
3. funcionamento geral;
4. três exemplos reais;
5. diferença entre aprendizado supervisionado
   e não supervisionado;
6. uma situação em que Machine Learning não seria
   a melhor solução.

FORMATO:
Organize a resposta utilizando subtítulos e uma
tabela para a comparação.

RESTRIÇÕES:
- máximo de 500 palavras;
- não utilizar fórmulas matemáticas;
- explicar qualquer termo técnico utilizado.

CRITÉRIO DE QUALIDADE:
Ao final da explicação, um estudante iniciante deverá
conseguir explicar o conceito utilizando suas próprias palavras.

Finalize apresentando duas perguntas para verificar
a compreensão do estudante.
```

---

## 7. O que mudou entre os três prompts?

| Elemento | Prompt 1 | Prompt 2 | Prompt 3 |
|---|:---:|:---:|:---:|
| Papel | NAO | SIM | SIM |
| Público | NAO | SIM | SIM |
| Contexto | NAO | Parcial | SIM |
| Objetivo | Genérico | SIM | SIM |
| Estrutura | NAO | SIM | SIM |
| Restrições | NAO | SIM | SIM |
| Critérios de qualidade | NAO | NAO | SIM |
| Verificação da aprendizagem | NAO | NAO | SIM |

---

## 8. Refinar não significa apenas aumentar

Compare:

```text
Explique Python.
```

com:

```text
Explique Python de maneira muito completa, detalhada,
bem estruturada, extremamente didática, bastante clara,
muito aprofundada e com muitos exemplos.
```

O segundo prompt possui mais palavras, mas continua pouco específico.

Agora observe:

```text
Explique listas em Python para um estudante que
já conhece variáveis e estruturas condicionais,
mas nunca utilizou coleções.

Apresente:
- conceito;
- sintaxe;
- três operações básicas;
- um exemplo comentado;
- um erro comum.

Finalize com um exercício sem apresentar a solução.
```

Esse prompt pode ser menor, mas fornece informações mais úteis.

> **Quantidade de palavras não é sinônimo de qualidade do prompt.**

---

## 9. Elementos que podem ser refinados

### 9.1 Papel

```text
Atue como especialista em segurança da informação.
```

### 9.2 Objetivo

```text
O objetivo é identificar vulnerabilidades conceituais
na solução apresentada.
```

### 9.3 Contexto

```text
A solução será utilizada por uma pequena empresa
com cinco funcionários e baixo orçamento.
```

### 9.4 Público

```text
Explique para estudantes iniciantes.
```

### 9.5 Formato

```text
Apresente a resposta em uma tabela contendo:
problema, causa, impacto e possível solução.
```

### 9.6 Restrições

```text
Utilize Python.
Não utilize bibliotecas externas.
Apresente no máximo três soluções.
```

### 9.7 Critérios de qualidade

```text
A solução deve ser simples, executável e adequada
ao nível de um estudante do segundo semestre.
```

### 9.8 Exemplos

```text
Utilize o seguinte padrão:

Entrada:
...

Saída esperada:
...
```

---

# FAZER - Hands On

## 10. Atividade prática: Laboratório de Refinamento de Prompts

### Desafio

Escolha **um problema relacionado à Ciência da Computação** que possa ser respondido ou apoiado por uma IA generativa.

Sugestões:

- explicar um conceito de programação para um iniciante;
- sugerir uma arquitetura para um sistema;
- identificar possíveis melhorias em um código;
- explicar um algoritmo;
- criar casos de teste;
- comparar tecnologias;
- comparar linguagens de programação;
- propor uma solução para um problema computacional;
- explicar uma estrutura de dados;
- criar um roteiro de estudos;
- revisar um trecho de código;
- elaborar um plano de estudos sobre Inteligência Artificial.

---

## 11. Etapa 1 - Definição do problema

Registre:

```markdown
## Problema escolhido

### Contexto
[Descreva o contexto.]

### Problema
[Qual problema será investigado?]

### Objetivo
[O que você espera obter com auxílio da IA?]
```

---

## 12. Etapa 2 - Prompt inicial

Crie uma primeira versão simples.

**Exemplo:**

```text
Explique o que é aprendizado de máquina.
```

Execute o prompt. Não faça nenhuma alteração antes de registrar o resultado.

Registre:

```markdown
## Prompt 1 - Versão inicial

### Prompt
[cole aqui]

### Resultado
[cole ou registre a resposta]

### Primeira impressão
- O que funcionou?
- O que faltou?
- O que ficou genérico?
- O que poderia ser melhor?
```

---

## 13. Etapa 3 - Primeiro refinamento

Analise o primeiro resultado.

Pergunte:

- O objetivo ficou claro?
- A IA compreendeu o público?
- Houve informações excessivamente genéricas?
- O nível de profundidade foi adequado?
- A estrutura foi adequada?
- A resposta apresentou informação desnecessária?
- Faltaram exemplos?
- Alguma informação precisa ser verificada?

Agora refine o prompt considerando:

```text
PAPEL
+
CONTEXTO
+
OBJETIVO
+
PÚBLICO
+
TAREFA
+
FORMATO
+
RESTRIÇÕES
+
CRITÉRIOS
```

---

## 14. Prompt 2 - Primeiro refinamento

Registre:

```markdown
## Prompt 2 - Primeiro refinamento

### Alterações realizadas
- Papel:
- Contexto:
- Objetivo:
- Público:
- Formato:
- Restrições:
- Critérios:

### Prompt
[cole aqui]

### Resultado
[registre a resposta obtida]
```

---

## 15. Etapa 4 - Comparação

Compare as duas respostas. Atribua uma nota de **1 a 5**.

| Critério | Prompt 1 | Prompt 2 |
|---|---:|---:|
| Clareza | | |
| Precisão | | |
| Relevância | | |
| Organização | | |
| Adequação ao público | | |
| Atendimento ao objetivo | | |
| Utilidade prática | | |

### Escala

| Nota | Interpretação |
|---:|---|
| 1 | Muito insatisfatório |
| 2 | Insatisfatório |
| 3 | Adequado |
| 4 | Muito bom |
| 5 | Excelente |

---

## 16. Etapa 5 - Segundo refinamento

Antes de criar a terceira versão, responda:

1. O que estava inadequado na primeira resposta?
2. O que melhorou após o primeiro refinamento?
3. O que ainda pode ser melhorado?
4. Qual nova informação será adicionada?
5. Qual informação poderá ser retirada?
6. Por que essas alterações podem melhorar o resultado?

Agora produza:

```markdown
## Prompt 3 - Segundo refinamento

### Hipótese de melhoria
Acredito que a resposta ficará melhor porque...

### Prompt
[cole aqui]

### Resultado
[registre aqui]
```

---

## 17. Comparação final

Compare as três versões.

| Critério | Prompt 1 | Prompt 2 | Prompt 3 |
|---|---:|---:|---:|
| Clareza | | | |
| Precisão | | | |
| Relevância | | | |
| Organização | | | |
| Adequação ao público | | | |
| Atendimento ao objetivo | | | |
| Utilidade prática | | | |
| **Total** | | | |

---

## 18. Qual foi a melhoria?

Observe o processo:

```text
PROMPT 1
   v
problemas identificados
   v
PROMPT 2
   v
melhorias + novos problemas
   v
PROMPT 3
   v
resultado mais adequado
```

Responda:

> **Qual modificação teve maior impacto no resultado?**

---

# SER - Ética, Responsabilidade e Inovação

## 19. Uma resposta melhor escrita é uma resposta correta?

Não necessariamente.

A cartilha *IA no comando? Você no controle* alerta que sistemas de IA podem produzir textos coerentes e convincentes e, ainda assim, apresentar:

- conceitos incorretos;
- dados sem fonte;
- autores ou referências inventadas;
- informações repetidas;
- generalizações;
- argumentos frágeis;
- conclusões apressadas.

Por isso:

> **Refinamento do prompt não elimina a necessidade de validação.**

---

## 20. Checklist de validação

Antes de utilizar qualquer resposta da IA, pergunte:

- [ ] A informação pode ser confirmada?
- [ ] Os conceitos apresentados existem?
- [ ] Os dados estão atualizados?
- [ ] A resposta realmente atende ao problema?
- [ ] Existem generalizações?
- [ ] Existem afirmações sem sustentação?
- [ ] A IA apresentou referências?
- [ ] As referências existem?
- [ ] Eu consigo explicar a resposta com minhas palavras?

A checagem crítica é parte essencial do uso responsável da IA. A cartilha recomenda conferir fontes, atualização, autores, conceitos, dados e a compatibilidade da resposta com o material da disciplina antes de utilizar o conteúdo.

---

## 21. IA como apoio, não como substituição

A atividade não consiste em solicitar:

```text
Faça meu trabalho.
```

A ideia é utilizar a IA para ampliar o próprio processo de análise.

### Em vez de:

```text
Resolva esse problema por mim.
```

### Experimente:

```text
Ajude-me a compreender o caminho para resolver
esse problema.

Faça perguntas para identificar o que eu já sei.

Não apresente a resposta completa imediatamente.

Quando eu cometer um erro, explique qual conceito
preciso revisar.
```

A cartilha propõe substituir comandos que transferem integralmente a atividade à IA por comandos que estimulem explicação, perguntas, revisão, exemplos e construção da própria resposta.

---

# INVESTIGAÇÃO - Reflexão Crítica

## 22. Reflexão individual

Responda:

1. Qual foi a principal diferença entre o prompt inicial e o prompt refinado?
2. Quais elementos tiveram maior impacto no resultado?
3. Um prompt mais longo necessariamente produz uma resposta melhor? Justifique.
4. O que acontece quando o objetivo solicitado à IA não está claramente definido?
5. Quais informações você considera indispensáveis para elaborar um bom prompt?
6. Como o refinamento de prompts pode ser útil para um profissional de Ciência da Computação?
7. Que riscos podem surgir quando confiamos em uma resposta da IA sem avaliar sua qualidade?
8. Houve alguma situação em que o Prompt 3 ficou pior que o Prompt 2? Se sim, explique.
9. Existe um ponto em que adicionar mais instruções começa a prejudicar a resposta?
10. O que você faria para verificar se a resposta tecnicamente está correta?

---

## 23. Take Away

Complete:

> **"Um bom prompt não é simplesmente um prompt longo. Ele precisa..."**

Agora formule **cinco recomendações práticas** para alguém que deseja obter respostas melhores de uma IA generativa.

```text
1.
2.
3.
4.
5.
```

---

## 24. Produto final da atividade

Ao final, entregue:

- **Prompt 1** - versão inicial;
- **Resultado 1**;
- análise crítica da primeira resposta;
- **Prompt 2** - primeiro refinamento;
- **Resultado 2**;
- tabela comparativa;
- análise das melhorias;
- **Prompt 3** - segundo refinamento;
- **Resultado 3**;
- comparação final das três respostas;
- validação crítica;
- reflexão individual;
- cinco recomendações práticas;
- Take Away.

---

## 25. Estrutura para registro no GitHub

Sugestão:

```text
tendencias-computacao/
|
|-- README.md
|
|-- aula-02/
|   |-- engenharia-de-prompt.md
|
|-- aula-03/
    |-- refinamento-de-prompts.md
```

---

## 26. Modelo do arquivo de entrega

Nome sugerido:

```text
refinamento-de-prompts.md
```

Estrutura:

````markdown
# Atividade - Refinamento de Prompts

## Identificação
- Nome:
- Turma:
- Data:
- Ferramenta de IA utilizada:

---

## Problema escolhido

### Contexto
...

### Problema
...

### Objetivo
...

---

## Prompt 1

### Prompt
...

### Resultado
...

### Análise
...

---

## Prompt 2

### Alterações realizadas
...

### Prompt
...

### Resultado
...

---

## Comparação

| Critério | Prompt 1 | Prompt 2 |
|---|---:|---:|
| Clareza | | |
| Precisão | | |
| Relevância | | |
| Organização | | |
| Adequação ao público | | |
| Atendimento ao objetivo | | |

---

## Prompt 3

### O que ainda precisava melhorar?
...

### Hipótese
...

### Prompt
...

### Resultado
...

---

## Comparação final

| Critério | Prompt 1 | Prompt 2 | Prompt 3 |
|---|---:|---:|---:|
| Clareza | | | |
| Precisão | | | |
| Relevância | | | |
| Organização | | | |
| Adequação ao público | | | |
| Atendimento ao objetivo | | | |
| Utilidade | | | |

---

## Validação

Como você verificou a qualidade e correção da resposta?

...

---

## Reflexão

### 1. Qual foi a principal diferença entre os prompts?
...

### 2. Quais elementos tiveram maior impacto?
...

### 3. Um prompt maior é necessariamente melhor?
...

### 4. O que ocorre quando o objetivo não é claro?
...

### 5. Quais informações são indispensáveis?
...

### 6. Como essa habilidade pode ser utilizada profissionalmente?
...

### 7. Quais riscos existem ao confiar automaticamente na IA?
...

---

## Take Away

> Um bom prompt não é simplesmente um prompt longo. Ele precisa...

---

## Cinco recomendações

1.
2.
3.
4.
5.
````

---

## 27. Checklist da atividade

Antes de entregar:

- [ ] Escolhi um problema de Ciência da Computação.
- [ ] Registrei o Prompt 1.
- [ ] Registrei o Resultado 1.
- [ ] Analisei as limitações.
- [ ] Construí o Prompt 2.
- [ ] Registrei o Resultado 2.
- [ ] Comparei os resultados.
- [ ] Construí o Prompt 3.
- [ ] Registrei o Resultado 3.
- [ ] Comparei as três versões.
- [ ] Analisei a qualidade das respostas.
- [ ] Verifiquei possíveis informações incorretas.
- [ ] Respondi às questões de reflexão.
- [ ] Completei o Take Away.
- [ ] Registrei cinco recomendações.
- [ ] Organizei o arquivo no GitHub.

---

## 28. Síntese da aula

```text
PROMPT
   v
RESULTADO
   v
NÃO ACEITE AUTOMATICAMENTE
   v
ANALISE
   v
IDENTIFIQUE LIMITAÇÕES
   v
CRIE UMA HIPÓTESE
   v
REFINE
   v
TESTE NOVAMENTE
   v
COMPARE
   v
VALIDE
```

---

## 29. Ideia-chave

> **Refinar um prompt não significa simplesmente adicionar detalhes. Significa identificar quais informações são necessárias para diminuir ambiguidades e orientar a IA para o objetivo desejado.**

Ao mesmo tempo:

> **Uma resposta mais adequada ao prompt ainda precisa ser verificada.**

A cartilha *IA no comando? Você no controle* sintetiza essa postura ao recomendar utilizar a IA para **pensar melhor, e não para pensar menos**, definindo o objetivo, formulando uma primeira tentativa, oferecendo contexto, questionando a resposta, verificando fontes e reescrevendo aquilo que fizer sentido para o próprio trabalho.

---

## 30. Desafio final

Imagine que um colega diga:

> "Meu prompt não funcionou. A IA respondeu errado."

Antes de modificar o prompt, faça cinco perguntas para diagnosticar o problema.

```text
1.
2.
3.
4.
5.
```

### Pergunta final

> **O problema está no prompt, na resposta da IA, nas informações utilizadas ou na forma como o usuário avaliou o resultado?**

A Engenharia de Prompt envolve aprender a investigar **todas essas possibilidades**.

---

# Material de Apoio

**IA no comando? Você no controle.** Guia prático para usar a inteligência artificial de forma inteligente, crítica e responsável na universidade. Grupo IA - STHEM/SEMESP e MetaRed TIC.

A cartilha reforça três princípios importantes para esta aula:

1. a IA pode apoiar o processo de aprendizagem, mas não substitui pensamento crítico;
2. comandos melhores explicitam elementos como perfil, tarefa, cenário, passo a passo e formato de saída;
3. respostas produzidas por IA devem ser conferidas e validadas antes de serem utilizadas academicamente.

---

# Take Away da Aula

> **Prompt -> Resposta -> Análise -> Refinamento -> Nova resposta -> Comparação -> Validação.**

> **O objetivo da Engenharia de Prompt não é fazer a IA pensar por você, mas melhorar a qualidade da interação para que você possa pensar, analisar e decidir melhor.**
