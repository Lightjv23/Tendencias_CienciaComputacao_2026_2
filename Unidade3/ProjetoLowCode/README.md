# LabTech — Chatbot Acadêmico

## 1. Sobre o projeto

O **LabTech** é um chatbot acadêmico desenvolvido para auxiliar os alunos na consulta de informações institucionais, como rematrícula, atividades complementares e procedimentos acadêmicos.

O sistema utiliza Python e FastAPI no backend, Ollama para executar o modelo de inteligência artificial localmente e HTML, CSS e JavaScript no frontend.

Este guia explica como configurar e executar o projeto em outro computador Windows.

## 2. Requisitos

Antes de começar, o computador precisa ter:

- Windows 10 ou Windows 11.
- Conexão com a internet para baixar os programas e o modelo de IA.
- Python instalado.
- Ollama instalado.
- A pasta completa do projeto LabTech.

O modelo de inteligência artificial utilizado é `qwen2.5:3b`. O download ocupa aproximadamente 2 GB, e o desempenho depende do hardware disponível.

## 3. Copiar o projeto

Copie a pasta completa do LabTech para o computador que será utilizado nos testes.

A estrutura deve ser semelhante a esta:

```text
labtech-chatbot-basico/
├── index.html
├── styles.css
├── app.js
├── main.py
├── knowledge_base/
│   └── chunks.jsonl
└── .venv/
```

**Importante:** a pasta `knowledge_base` e o arquivo `chunks.jsonl` são essenciais, pois contêm os trechos institucionais utilizados pelo chatbot.

Não é necessário copiar a pasta `.venv` de outro computador. O recomendado é criar um novo ambiente virtual na máquina de teste.

## 4. Instalar o Python

1. Acesse https://www.python.org/downloads/
2. Baixe e instale uma versão estável do Python compatível com as dependências do projeto.
3. Se a opção estiver disponível, marque a opção para adicionar o Python ao PATH durante a instalação.
4. Abra o terminal e execute:

```powershell
python --version
```

Se aparecer a versão instalada, o Python está pronto para uso.

## 5. Instalar o Ollama

O Ollama é responsável por executar o modelo de inteligência artificial utilizado pelo LabTech.

1. Acesse https://ollama.com/
2. Baixe e instale o programa.
3. Abra o Ollama e verifique se ele está em execução.
4. Abra o terminal e execute:

```powershell
ollama pull qwen2.5:3b
```

Aguarde o download do modelo terminar.

Para confirmar a instalação, execute:

```powershell
ollama list
```

O modelo `qwen2.5:3b` deverá aparecer na lista.

## 6. Configurar o ambiente Python

Abra a pasta do projeto no VS Code.

No terminal integrado, entre na pasta onde está o arquivo `main.py`. Em seguida, execute:

```powershell
python -m venv .venv
```

Esse comando cria um ambiente virtual para as dependências do projeto.

Ative o ambiente:

```powershell
.\.venv\Scripts\Activate.ps1
```

Se o PowerShell impedir a ativação, abra o Prompt de Comando (CMD) e utilize:

```bat
.venv\Scripts\activate.bat
```

Agora instale as dependências:

```powershell
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn requests
```

## 7. Iniciar o backend

Com o terminal aberto na pasta do projeto e o ambiente virtual ativado, execute:

```powershell
python -m uvicorn main:app --reload
```

Mantenha esse terminal aberto enquanto estiver utilizando o chatbot.

O backend será disponibilizado em:

- API: http://127.0.0.1:8000
- Documentação da API: http://127.0.0.1:8000/docs
- Verificação do sistema: http://127.0.0.1:8000/saude

Abra o endereço abaixo no navegador:

http://127.0.0.1:8000/saude

O sistema deverá apresentar informações semelhantes a estas:

```json
{
  "status": "ok",
  "arquivo_encontrado": true,
  "quantidade_trechos": 668,
  "ollama_disponivel": true,
  "modelo_configurado": "qwen2.5:3b",
  "modelo_instalado": true
}
```

A quantidade de trechos poderá mudar conforme a versão da base institucional.

Se o arquivo da base não for encontrado ou o Ollama estiver indisponível, revise as etapas anteriores.

## 8. Abrir o frontend

O frontend é a interface visual do chatbot, composta pelos arquivos `index.html`, `styles.css` e `app.js`.

**Não abra o `index.html` diretamente com dois cliques no arquivo.** Isso pode causar um erro de comunicação entre o navegador e o backend.

### Opção A — Utilizando o VS Code

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão Live Server, caso ainda não esteja instalada.
3. Clique com o botão direito no arquivo `index.html`.
4. Selecione **Open with Live Server**.

O navegador deverá abrir um endereço semelhante a:

http://127.0.0.1:5500/index.html

### Opção B — Utilizando o servidor do Python

Abra um segundo terminal na pasta do projeto e execute:

```powershell
python -m http.server 5500
```

Depois, acesse:

http://127.0.0.1:5500/index.html

Mantenha os dois terminais abertos durante o teste: um para o backend e outro para o frontend.

O `main.py` atual permite as origens `localhost` e `127.0.0.1` nas portas 5500 e 5501. Se o frontend utilizar outra porta, será necessário ajustar a configuração de CORS no backend.

## 9. Testar o LabTech

Depois de iniciar o backend e abrir o frontend:

1. Digite uma pergunta acadêmica no campo de mensagem.
2. Pressione Enter para enviar a pergunta.
3. Aguarde a resposta do chatbot.
4. Confira as fontes consultadas, quando forem apresentadas.
5. Faça outras perguntas relacionadas aos documentos institucionais.

Sugestões de perguntas para os testes:

- Como faço para realizar a rematrícula?
- Onde encontro as informações sobre rematrícula?
- Como funcionam as Atividades Complementares?
- Qual é o prazo de validação dos comprovantes de AC?

As respostas dependem das informações disponíveis na base institucional. Se uma informação não estiver presente ou não puder ser confirmada, o chatbot poderá informar essa limitação.

## 10. Problemas comuns

### O chatbot não consegue se conectar

- Confira se o backend continua em execução.
- Acesse http://127.0.0.1:8000/saude.
- Verifique se o frontend foi aberto pelo Live Server ou pelo servidor HTTP do Python.
- Confira se o endereço da API no arquivo `app.js` está configurado para `http://127.0.0.1:8000/buscar`.

### O Ollama não está disponível

- Abra o aplicativo Ollama.
- Verifique se ele está em execução.
- Abra novamente o endereço de verificação do sistema.

### O modelo não está instalado

Execute:

```powershell
ollama pull qwen2.5:3b
```

Aguarde o download terminar e tente novamente.

### A base institucional não foi encontrada

Confira se existe o arquivo:

```text
knowledge_base/chunks.jsonl
```

Ele deve estar dentro da pasta `knowledge_base`, no mesmo nível do arquivo `main.py`.

### O navegador apresenta erro de CORS

- Abra o frontend utilizando `http://127.0.0.1:5500` ou `http://localhost:5500`.
- Não abra o arquivo diretamente pelo explorador do Windows.
- Se utilizar outra porta, verifique a configuração `allow_origins` do `main.py`.

### O chatbot demora para responder

O modelo é executado localmente, e a velocidade depende da memória, do processador e dos demais recursos do computador. Na primeira utilização, ele também poderá levar mais tempo para carregar.

## 11. Encerrar o sistema

Para encerrar os servidores:

1. Vá ao terminal do backend e pressione `Ctrl + C`.
2. Vá ao terminal do frontend e pressione `Ctrl + C`, caso esteja utilizando o servidor HTTP do Python.

O Ollama pode continuar aberto para futuras utilizações.

## 12. Orientações para os testadores

- O LabTech está em desenvolvimento e suas respostas podem conter erros ou informações incompletas.
- Confira as fontes apresentadas e sinalize informações incorretas, desatualizadas ou sem comprovação.
- Não utilize dados pessoais reais, senhas ou informações financeiras nos testes.
- Não altere nem substitua a base institucional sem autorização da equipe responsável.
- Cada computador executará sua própria cópia do projeto.
- O endereço `127.0.0.1` é local. Ele não disponibiliza automaticamente o chatbot para outros computadores da rede.

## 13. Resumo rápido

Para executar o