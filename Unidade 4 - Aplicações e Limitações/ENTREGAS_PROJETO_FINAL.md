# Projeto Final · Entregas da Unidade 4 (novembro)

**Disciplina:** Tendências em Ciência da Computação · Profa. Kadidja Valéria (UDF)
**Avaliação:** até 5,0 pontos (A1)
**Projeto:** Assistente Acadêmico da UDF, um agente de IA em 4 camadas com ética aplicada

Esta página liga cada tarefa da Unidade 4 ao lugar do repositório onde ela foi feita. O detalhamento completo está no [README da unidade](README.md).

---

## Registro do grupo

| Estudante | RGM | Papel no projeto |
|---|---|---|
| João Felipe Soares Silva | 33455660 | Modelagem (temas, intenções, regras de decisão) |
| João Vítor Miranda de Moraes | 34070681 | Implementação |
| Luis Fernando Figueiredo Frizzo | 35388471 | Testes e curadoria |

**Repositório:** https://github.com/JoaoFelipeSS/Tendencias-em-ciencia-da-computacao

---

## Entregas

| Data | Tarefa | Valor | Onde está no repositório |
|---|---|---|---|
| 05/11 | **Criação de agentes de IA** | 1,0 | Agente próprio em JavaScript: [`agente/agente.js`](agente/agente.js) e [`agente/base-conhecimento.js`](agente/base-conhecimento.js). No README: [7.1 Modelo generativo ou agente?](README.md#71-modelo-generativo-ou-agente), [7.2 Arquitetura em 4 camadas](README.md#72-arquitetura-em-4-camadas), [7.4 Prompt estático e dinâmico](README.md#74-do-prompt-estático-ao-dinâmico) e [7.5 Gestão de memória](README.md#75-gestão-de-memória) |
| 12/11 | **Chatbot e ferramentas de chatbot, com a especificação** | 1,0 | Especificação nas 11 etapas do fluxo Serpro Bots, do [Documento de Visão](README.md#3-etapa-1--entender-a-necessidade-documento-de-visão) à [Curadoria](README.md#12-etapa-11--curadoria-ciclo-de-melhoria-contínua). Planilha [`design-conversacional.csv`](design-conversacional.csv), interface [`agente/index.html`](agente/index.html) e comparação com a ferramenta Botpress da [Unidade 3](../Unidade%203%20-%20Low%20Code%20No%20Code/) na [seção 16](README.md#16-comparação-com-a-unidade-3-e-limitações) |
| 19/11 | **Viés algorítmico e responsabilidade social** | 1,0 | [13. Privacidade desde o projeto (LGPD)](README.md#13-privacidade-desde-o-projeto-lgpd), [14. Viés algorítmico](README.md#14-viés-algorítmico), [15. Ética aplicada](README.md#15-ética-aplicada) (dilema analisado por três frameworks e licença social para operar) e testes de equidade e privacidade em [`bateria-de-testes.md`](bateria-de-testes.md) |
| 26/11 | **Apresentação do projeto de solução inteligente** | 1,0 | Demonstração ao vivo: abrir [`agente/index.html`](agente/index.html) no navegador. Resultados: 50 de 50 casos de teste aprovados ([`bateria-de-testes.md`](bateria-de-testes.md)) |
| 26/11 | **Integrar conceitos em solução aplicada: repositório GitHub na pasta da disciplina** | 1,0 | Este repositório, organizado por unidade, com a evolução do mesmo problema: chatbot low-code ([Unidade 3](../Unidade%203%20-%20Low%20Code%20No%20Code/)) → agente próprio (Unidade 4) |

---

## Como demonstrar

| O que | Como |
|---|---|
| Conversar com o agente | Abrir `agente/index.html` no navegador. Não precisa de instalação, internet ou chave de API |
| Mostrar os testes | Na pasta `agente`: `node testes.js` |
| Mostrar por que o agente respondeu algo | Botão **"Por que recebi esta resposta?"** em qualquer resposta |

---

[← Voltar ao README da unidade](README.md) · [← Voltar ao início](../README.md)
