# Aula 02 — Engenharia de Prompt

## 1. Identificação
- Turma: Noturno
- Grupo: JMS
- Data: 20/08/26
- Integrantes:

  João Vítor Miranda de Moraes - 34070681

  Márcio Henrique Pereira Vieira - 33078114

  Samuel Rodrigues Melo - 32765185
## 2. Problema escolhido
Resumo de documentação de frameworks/linguagens
## 3. Objetivo
Facilitar o aprendizado de frameworks/linguagens
## 4. Prompt inicial
```text
Cite os principais pontos sobre a criação de classes em Java
```
## 5. Resultado inicial
```text
Os principais pontos sobre a criação de classes em Java são:

Classe: define a estrutura e o comportamento de um objeto.
Atributos: representam as características/estado do objeto.
Métodos: definem as ações/comportamentos do objeto.
Construtor: inicializa o objeto quando ele é criado.
Encapsulamento: controla o acesso aos atributos usando private, public, protected e métodos get/set.
Objetos: são instâncias de uma classe, criadas geralmente com new.
Herança: permite que uma classe herde características e métodos de outra usando extends.
Polimorfismo: permite que objetos de diferentes classes sejam tratados de forma semelhante.
Abstração: permite representar apenas os aspectos importantes de uma entidade.
Modificadores de acesso: determinam onde atributos, métodos e classes podem ser acessados.
this: referencia o próprio objeto.
static: indica que um atributo ou método pertence à classe, e não a uma instância específica.
```
## 6. Análise Crítica
O que funcionou?

-A IA retornou de forma sucinta os principais pontos da criação de classes em Java

O que não funcionou?

-Não houve nenhum erro grotesco

O que faltou?

-Não houve uma explicação mais aprofundada sobre os pontos

O que precisa ser validado?
-O trecho exato da documentação que a IA se baseou para a explicação

## 7. Prompt refinado
```text
Você é um especialista em Java. 
CONTEXTO:
O estudante está iniciando sua formação em Computação
e possui conhecimentos básicos de lógica de programação.
OBJETIVO:
Explicar os principais pontos da criação de classes em Java, detalhando cada um levando em consideração o nível de conhecimento do aluno 
TAREFA:
Cite os principais pontos da criação de classes em Java 


CRITÉRIOS DE QUALIDADE:
Citar a fonte de cada ponto, para demonstrar a veracidade da explicação
```

## 8. Resultado refinado

## Principais pontos da criação de classes em Java

Para quem está começando, uma boa forma de entender uma **classe** é pensar nela como um **molde** para criar objetos. A documentação oficial do Java define que o corpo de uma classe pode conter **campos, métodos e construtores**, que representam, respectivamente, o estado, o comportamento e a inicialização dos objetos. ([Oracle Docs][1])

### 1. Declaração da classe

Uma classe é criada utilizando a palavra-chave `class`:

```java
public class Pessoa {
    // conteúdo da classe
}
```

* `public` → define o nível de acesso da classe.
* `class` → indica que estamos declarando uma classe.
* `Pessoa` → nome da classe.

A especificação da linguagem Java define a declaração de classes e seus modificadores no capítulo dedicado a classes. ([Oracle Docs][2])

### 2. Atributos (campos)

Os **atributos** representam as características ou o estado de um objeto.

```java
public class Pessoa {
    String nome;
    int idade;
}
```

Nesse exemplo, cada objeto `Pessoa` pode possuir um `nome` e uma `idade` diferentes. A documentação oficial descreve os campos como elementos utilizados para armazenar o estado da classe e de seus objetos. ([Oracle Docs][1])

### 3. Métodos

Os **métodos** representam comportamentos ou ações que um objeto pode realizar.

```java
public void apresentar() {
    System.out.println("Olá!");
}
```

Um método pode receber parâmetros e também retornar um valor:

```java
public int somar(int a, int b) {
    return a + b;
}
```

A especificação do Java define métodos como membros que implementam o comportamento associado à classe. ([Oracle Docs][3])

### 4. Construtores

O **construtor** é utilizado para inicializar um objeto quando ele é criado. Ele possui o mesmo nome da classe e **não possui tipo de retorno**, nem mesmo `void`. ([Oracle Docs][4])

```java
public Pessoa(String nome, int idade) {
    this.nome = nome;
    this.idade = idade;
}
```

O objeto pode então ser criado com `new`:

```java
Pessoa p = new Pessoa("João", 20);
```

O `new` cria uma nova instância e chama o construtor correspondente. ([Oracle Docs][4])

### 5. Objetos e instâncias

A **classe é o molde**, enquanto o **objeto é uma instância desse molde**.

```java
Pessoa p1 = new Pessoa("Ana", 20);
Pessoa p2 = new Pessoa("Carlos", 25);
```

`p1` e `p2` são objetos da classe `Pessoa`, mas possuem seus próprios valores. A documentação Java explica que classes são utilizadas para criar e manipular objetos por meio de instâncias. ([Oracle Docs][5])

### 6. Encapsulamento e modificadores de acesso

É possível controlar quem pode acessar os atributos e métodos de uma classe usando modificadores como:

* `public` → acesso amplo;
* `private` → acesso restrito à própria classe;
* `protected` → acesso relacionado à classe e à herança;
* sem modificador → acesso dentro do pacote.

A documentação oficial destaca que os modificadores de acesso controlam quais classes podem utilizar determinados campos e métodos. ([Oracle Docs][6])

Por isso, é comum utilizar:

```java
private String nome;

public String getNome() {
    return nome;
}

public void setNome(String nome) {
    this.nome = nome;
}
```

### 7. `this`

A palavra-chave `this` representa o **próprio objeto atual**.

```java
public Pessoa(String nome) {
    this.nome = nome;
}
```

Nesse caso, `this.nome` representa o atributo da classe, enquanto `nome` representa o parâmetro recebido pelo construtor. A documentação de classes e objetos do Java inclui `this` entre os conceitos fundamentais para trabalhar com objetos. ([Oracle Docs][5])

### 8. `static`

Um membro `static` pertence à **classe**, e não a cada objeto individualmente.

```java
public class Pessoa {
    static int quantidade = 0;
}
```

A especificação do Java diferencia membros de classe (`static`) dos membros de instância. ([Oracle Docs][7])

### 9. Herança

Uma classe pode ser criada a partir de outra utilizando `extends`:

```java
public class Aluno extends Pessoa {
    String matricula;
}
```

`Aluno` é uma **subclasse** de `Pessoa` e pode herdar membros da classe superior. Java permite uma única superclasse direta para uma classe. ([Oracle Docs][8])

### 10. Polimorfismo e sobrescrita

Uma subclasse pode fornecer uma implementação própria para um método herdado. Isso é chamado de **sobrescrita (overriding)** e está relacionado ao polimorfismo.

```java
@Override
public void apresentar() {
    System.out.println("Sou um aluno.");
}
```

A especificação da linguagem trata explicitamente de herança, sobrescrita e polimorfismo entre classes. ([Oracle Docs][3])

### Resumindo

Para um iniciante, os conceitos mais importantes para dominar primeiro são:

**Classe → atributos → métodos → construtor → objetos → `this` → encapsulamento → `static` → herança → polimorfismo.**

Esses conceitos formam a base da **Programação Orientada a Objetos (POO)** em Java. A principal referência utilizada aqui é a documentação oficial da Oracle e a **Java Language Specification (JLS)**. ([Oracle Docs][5])

[1]: https://docs.oracle.com/javase/tutorial/java/javaOO/summaryclasses.html?utm_source=chatgpt.com "Summary of Creating and Using Classes and Objects (The Java™ Tutorials > Learning the Java Language > Classes and Objects)"
[2]: https://docs.oracle.com/javase/specs/jls/se26/html/jls-8.html?utm_source=chatgpt.com "Chapter 8. Classes"
[3]: https://docs.oracle.com/en/java/javase/26/docs/specs/jls/index.html?utm_source=chatgpt.com "The Java® Language Specification"
[4]: https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html?utm_source=chatgpt.com "Providing Constructors for Your Classes (The Java™ Tutorials > Learning the Java Language > Classes and Objects)"
[5]: https://docs.oracle.com/javase/tutorial/java/javaOO/?utm_source=chatgpt.com "Lesson: Classes and Objects (The Java™ Tutorials > Learning the Java Language)"
[6]: https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html?utm_source=chatgpt.com "Controlling Access to Members of a Class (The Java™ Tutorials > Learning the Java Language > Classes and Objects)"
[7]: https://docs.oracle.com/javase/specs/jls/se26/html/jls-1.html?utm_source=chatgpt.com "Chapter 1. Introduction"
[8]: https://docs.oracle.com/javase/tutorial/java/IandI/summaryinherit.html?utm_source=chatgpt.com "Summary of Inheritance (The Java™ Tutorials > Learning the Java Language > Interfaces and Inheritance)"

## 9. Técnicas Utilizadas

[X] Role Prompting

[ ] Few-Shot Prompting

[X] Contexto

[ ] Restrições

[ ] Formato de saída

[ ] Prompt em etapas

[ ] Refinamento iterativo

[ ] Outra

## 10. Comparação

O prompt refinado fez com que a IA fosse mais específica, pois forneceu um papel e um contexto, enquanto que o prompt simples trouxe uma resposta mais resumida.

## 11. Comparação

Verificamos o resultado por meio dos links fornecidos pela própria IA (documentação ORACLE)

## 12. Ética e responsabilidade

Se o resultado não for validado adequadamente, o processo de aprendizado do aluno pode ser prejudicado, consequentemente levando ao desenvolvimento de aplicações ineficientes/inseguras

## 13. Take Away

Engenharia de prompt é uma técnica que, se usada e validada adequadamente, pode acelerar e melhorar milhares de processos

## 14. Link

[Link][9]

[9]: https://github.com/Lightjv23/Tendencias_CienciaComputacao_2026_2/blob/main/Unidade1/aula-02/engenharia-de-prompt.md
