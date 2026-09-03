# Atividade - Refinamento de Prompts

## Identificação
- Nome:
- Turma:
- Data:
- Ferramenta de IA utilizada:

---

# Refinamento de Prompts: Algoritmo A*

## Problema escolhido

### Contexto

Um aluno está estudando o **Algoritmo A***, utilizado para encontrar caminhos entre um ponto inicial e um ponto de destino em estruturas como grafos e mapas. Ele possui conhecimentos básicos de algoritmos, mas precisa compreender o funcionamento do A*, especialmente o uso dos custos e da função heurística.

### Problema

O aluno tem dificuldade para entender **como o algoritmo A*** escolhe o próximo nó durante a busca e qual é a função da heurística nesse processo.

### Objetivo

Criar um material explicativo que apresente o funcionamento do Algoritmo A* de maneira clara e progressiva, permitindo que o aluno compreenda seus principais conceitos e consiga acompanhar uma execução simples do algoritmo.

---

## Prompt 1

### Prompt

> Explique o Algoritmo A* e como ele funciona. Dê exemplos para facilitar o entendimento.

### Resultado

A resposta apresenta uma explicação geral do A*, mencionando que ele é um algoritmo de busca de caminhos que utiliza uma função de avaliação para determinar quais caminhos são mais promissores. Também explica, de maneira resumida, os conceitos de custo do caminho e heurística.

> Entretanto, a explicação pode ficar muito genérica para um aluno que está tendo o primeiro contato com o algoritmo.

### Análise

O prompt consegue indicar o assunto, mas não especifica **quem é o público**, qual nível de conhecimento o aluno possui, como a explicação deve ser organizada ou quais conceitos precisam obrigatoriamente ser abordados. Assim, a resposta pode apresentar informações corretas, mas não necessariamente da maneira mais adequada para o objetivo de aprendizagem.

---

## Prompt 2

### Alterações realizadas

Foram adicionados:

* **Papel** da IA;
* **Público-alvo**;
* Contexto sobre o conhecimento prévio do aluno;
* Objetivo mais específico;
* Estrutura para organizar a explicação;
* Restrições sobre a forma de apresentação.

### Prompt

> Você é um professor de Algoritmos especializado em estruturas de dados e algoritmos de busca.
>
> Explique o **Algoritmo A*** para um aluno de Computação que possui conhecimentos básicos de algoritmos e grafos.
>
> Explique:
>
> 1. O que é o Algoritmo A*;
> 2. Para que ele é utilizado;
> 3. O significado dos valores `g(n)`, `h(n)` e `f(n)`;
> 4. Como a heurística influencia a escolha dos caminhos;
> 5. O funcionamento do algoritmo passo a passo.
>
> Utilize uma linguagem simples, exemplos com um pequeno grafo e uma organização em tópicos. Evite assumir conhecimentos avançados.

### Resultado

A resposta tende a ser mais direcionada ao estudante. Ela apresenta os conceitos principais do A*, explica a função dos valores `g(n)`, `h(n)` e `f(n)` e utiliza um exemplo para demonstrar como o algoritmo realiza suas escolhas.

A estrutura também facilita a leitura, pois os conceitos são apresentados em uma ordem lógica, partindo da definição e chegando à execução.

---

## Comparação

| Critério                | Prompt 1 | Prompt 2 |
| ----------------------- | -------: | -------: |
| Clareza                 |      3/5 |      5/5 |
| Precisão                |      3/5 |      5/5 |
| Relevância              |      3/5 |      5/5 |
| Organização             |      2/5 |      5/5 |
| Adequação ao público    |      2/5 |      5/5 |
| Atendimento ao objetivo |      3/5 |      5/5 |

---

## Prompt 3

### O que ainda precisava melhorar?

O Prompt 2 já direciona bem a explicação, mas ainda não define **critérios objetivos para avaliar a qualidade da resposta**. Além disso, embora solicite um exemplo, não determina que o aluno deve ser levado a verificar se realmente compreendeu o funcionamento do algoritmo.

### Hipótese

Se forem adicionados **critérios de qualidade** e uma etapa de **verificação da aprendizagem**, a resposta poderá ser mais útil para o estudo, pois não apenas explicará o A*, mas também permitirá verificar se o aluno conseguiu compreender os conceitos.

### Prompt

> Você é um **professor de Algoritmos e Estruturas de Dados**.
>
> Explique o **Algoritmo A*** para um aluno de Computação que possui conhecimentos básicos de programação e grafos, mas está começando a estudar algoritmos de busca.
>
> O objetivo é fazer com que o aluno compreenda **como o A* encontra um caminho e como a heurística influencia suas escolhas**.
>
> Organize a resposta nas seguintes etapas:
>
> 1. Definição do Algoritmo A*;
> 2. Aplicações práticas;
> 3. Explicação de `g(n)`, `h(n)` e `f(n)`;
> 4. Explicação da heurística;
> 5. Exemplo utilizando um pequeno grafo;
> 6. Execução do algoritmo passo a passo, mostrando quais nós são analisados e por quê;
> 7. Resumo dos conceitos principais;
> 8. Três questões para verificar a aprendizagem, incluindo pelo menos uma questão em que o aluno precise calcular `f(n)`.
>
> **Restrições:**
>
> * Utilize linguagem simples e adequada para um aluno iniciante;
> * Explique os termos técnicos antes de utilizá-los;
> * Não pule etapas do exemplo;
> * Não utilize um exemplo excessivamente grande;
> * Diferencie claramente custo do caminho e heurística.
>
> **Critérios de qualidade:**
>
> * A explicação deve estar tecnicamente correta;
> * O exemplo deve ser coerente com os cálculos apresentados;
> * A relação `f(n) = g(n) + h(n)` deve ser explicada corretamente;
> * O aluno deve conseguir acompanhar a escolha dos nós;
> * As questões finais devem permitir verificar se os conceitos foram realmente compreendidos.

### Resultado

A resposta produzida com esse prompt tende a ser mais completa e adequada ao processo de aprendizagem. Além de explicar o algoritmo, ela apresenta um exemplo controlado, demonstra os cálculos e termina com questões que permitem verificar a compreensão do estudante.

A presença de critérios de qualidade também ajuda a reduzir respostas vagas ou exemplos que não estejam coerentes com a explicação.

---

## Comparação final

| Critério                | Prompt 1 | Prompt 2 | Prompt 3 |
| ----------------------- | -------: | -------: | -------: |
| Clareza                 |      3/5 |      5/5 |      5/5 |
| Precisão                |      3/5 |      5/5 |      5/5 |
| Relevância              |      3/5 |      5/5 |      5/5 |
| Organização             |      2/5 |      5/5 |      5/5 |
| Adequação ao público    |      2/5 |      5/5 |      5/5 |
| Atendimento ao objetivo |      3/5 |      5/5 |      5/5 |
| Utilidade               |      3/5 |      4/5 |      5/5 |

---

## Validação

A qualidade e a correção da resposta podem ser verificadas comparando os conceitos apresentados com a definição formal do Algoritmo A*. É necessário conferir principalmente se a função de avaliação foi apresentada corretamente como **`f(n) = g(n) + h(n)`**, se `g(n)` representa o custo acumulado até o nó, se `h(n)` representa a estimativa do custo restante e se o exemplo utiliza cálculos consistentes.

Além disso, as questões propostas ao final podem ser utilizadas como uma forma de **verificação da aprendizagem**. Se o aluno conseguir explicar o funcionamento do algoritmo e realizar corretamente os cálculos solicitados, há evidências de que os principais conceitos foram compreendidos.

---

## Reflexão

### 1. Qual foi a principal diferença entre os prompts?

A principal diferença foi o aumento gradual da **especificidade**. O primeiro prompt apenas solicita uma explicação. O segundo define público, papel, conteúdo e estrutura. O terceiro acrescenta critérios de qualidade e mecanismos para verificar a aprendizagem.

### 2. Quais elementos tiveram maior impacto?

Os elementos que mais contribuíram foram a definição do **público**, do **objetivo**, da **estrutura da resposta** e dos **critérios de qualidade**. Eles diminuem a possibilidade de a IA interpretar o pedido de maneira excessivamente ampla.

### 3. Um prompt maior é necessariamente melhor?

Não. Um prompt maior não é necessariamente melhor. O mais importante é fornecer **informações relevantes e específicas**. Um prompt curto pode produzir uma excelente resposta quando o objetivo e o contexto estão claros, enquanto um prompt muito longo pode conter informações desnecessárias.

### 4. O que ocorre quando o objetivo não é claro?

A IA pode produzir uma resposta genérica ou escolher uma abordagem que não corresponde à necessidade do usuário. No caso do A*, por exemplo, "explique o algoritmo" pode resultar tanto em uma explicação matemática avançada quanto em uma introdução simples.

### 5. Quais informações são indispensáveis?

São especialmente importantes o **objetivo**, o **contexto**, o **público-alvo**, o conteúdo que deve ser abordado e, quando necessário, as **restrições e critérios de qualidade**.

### 6. Como essa habilidade pode ser utilizada profissionalmente?

O refinamento de prompts pode ser utilizado para obter melhores resultados de IA em atividades como **programação, análise de dados, documentação, criação de relatórios, atendimento ao cliente, pesquisa e automação de tarefas**.

### 7. Quais riscos existem ao confiar automaticamente na IA?

A IA pode produzir informações incorretas, interpretações equivocadas ou exemplos inconsistentes. Por isso, suas respostas precisam ser **verificadas**, principalmente em situações técnicas ou profissionais nas quais erros podem gerar consequências importantes.

---

## Take Away

> Um bom prompt não é simplesmente um prompt longo. Ele precisa **ser claro, apresentar contexto, definir o objetivo, considerar o público e estabelecer critérios adequados para a resposta**. Quanto mais importante for a tarefa, mais útil será especificar como a resposta deve atender à necessidade do usuário.

---

## Cinco recomendações

1. **Defina claramente o objetivo** que deseja alcançar com a IA.
2. **Informe o público-alvo e seu nível de conhecimento** para adequar a resposta.
3. **Forneça contexto suficiente** para evitar interpretações equivocadas.
4. **Defina estrutura, restrições e critérios de qualidade** quando a tarefa exigir maior precisão.
5. **Sempre valide as informações fornecidas pela IA**, principalmente em conteúdos técnicos.

---

## Elementos utilizados no refinamento dos prompts

| Elemento                    | Prompt 1 | Prompt 2 | Prompt 3 |
| --------------------------- | :------: | :------: | :------: |
| Papel                       |    NAO   |    SIM   |    SIM   |
| Público                     |    NAO   |    SIM   |    SIM   |
| Contexto                    |    NAO   |  Parcial |    SIM   |
| Objetivo                    | Genérico |    SIM   |    SIM   |
| Estrutura                   |    NAO   |    SIM   |    SIM   |
| Restrições                  |    NAO   |    SIM   |    SIM   |
| Critérios de qualidade      |    NAO   |    NAO   |    SIM   |
| Verificação da aprendizagem |    NAO   |    NAO   |    SIM   |

