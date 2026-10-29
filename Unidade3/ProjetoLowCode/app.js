const form = document.querySelector('#form');
const input = document.querySelector('#input');
const messages = document.querySelector('#messages');
const welcome = document.querySelector('#welcome');
const main = document.querySelector('#main');
const layout = document.querySelector('#layout');

// Menu lateral: começa recolhido em telas pequenas.
if (window.innerWidth <= 760) layout.classList.add('collapsed');
document.querySelector('#toggle').addEventListener('click', () => {
  layout.classList.toggle('collapsed');
});

const API_URL = 'http://127.0.0.1:8000/buscar';

// Converte o texto da IA em elementos HTML seguros.
function formatarResposta(texto) {
  const container = document.createElement('div');
  container.className = 'formatted-answer';

  // Corrige negrito escapado: \*\*texto\*\*
  texto = String(texto || '')
    .replace(/\\\*\\\*/g, '**')
    .replace(/\\\*/g, '*')
    .replace(/\r\n/g, '\n')
    .trim();

  // Divide o texto em blocos separados por linhas vazias.
  const blocos = texto.split(/\n\s*\n/);

  blocos.forEach((bloco) => {
    bloco = bloco.trim();
    if (!bloco) return;

    const linhas = bloco.split('\n');

    // Identifica listas com marcadores ou numeração.
    const ehLista = linhas.every((linha) =>
      /^\s*(?:[-*•]|\d+[.)])\s+/.test(linha)
    );

    if (ehLista) {
      const listaNumerada = linhas.some((linha) =>
        /^\s*\d+[.)]\s+/.test(linha)
      );

      const lista = document.createElement(
        listaNumerada ? 'ol' : 'ul'
      );

      linhas.forEach((linha) => {
        const item = document.createElement('li');
        const conteudo = linha.replace(
          /^\s*(?:[-*•]|\d+[.)])\s+/,
          ''
        );

        formatarTextoInline(item, conteudo);
        lista.append(item);
      });

      container.append(lista);
    } else {
      const paragrafo = document.createElement('p');

      linhas.forEach((linha, indice) => {
        if (indice > 0) paragrafo.append(document.createElement('br'));
        formatarTextoInline(paragrafo, linha);
      });

      container.append(paragrafo);
    }
  });

  return container;
}

// Formata negrito e itálico sem interpretar HTML da resposta.
function formatarTextoInline(elemento, texto) {
  const regex = /(\*\*[^*]+?\*\*|(?<!\*)\*[^*]+?\*(?!\*))/g;
  let inicio = 0;
  let match;

  while ((match = regex.exec(texto)) !== null) {
    if (match.index > inicio) {
      elemento.append(
        document.createTextNode(texto.slice(inicio, match.index))
      );
    }

    const token = match[0];

    if (token.startsWith('**')) {
      const forte = document.createElement('strong');
      forte.textContent = token.slice(2, -2);
      elemento.append(forte);
    } else {
      const italico = document.createElement('em');
      italico.textContent = token.slice(1, -1);
      elemento.append(italico);
    }

    inicio = regex.lastIndex;
  }

  if (inicio < texto.length) {
    elemento.append(document.createTextNode(texto.slice(inicio)));
  }
}

function add(text, role, fontes = []) {
  const row = document.createElement('div');
  row.className = 'message ' + role;

  if (role === 'assistant') {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const logo = document.createElement('img');
    logo.src = 'logo.svg';
    logo.alt = '';
    avatar.append(logo);
    row.append(avatar);
  }

  const content = document.createElement('div');

  if (role === 'assistant') {
    content.className = 'assistant-content';
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  if (role === 'assistant') {
    bubble.append(formatarResposta(text));
  } else {
    bubble.textContent = text;
  }

  content.append(bubble);

  // Remove fontes repetidas mantendo a ordem original.
  if (role === 'assistant' && fontes.length > 0) {
    const fontesUnicas = [];
    const fontesVistas = new Set();

    fontes.forEach((fonte) => {
      let chave;

      if (typeof fonte === 'string') {
        chave = fonte.trim().toLowerCase();
      } else {
        const documento =
          fonte.documento ||
          fonte.arquivo ||
          fonte.nome ||
          'Documento institucional';

        const pagina = fonte.pagina || '';
        chave = `${documento}|${pagina}`.trim().toLowerCase();
      }

      if (!fontesVistas.has(chave)) {
        fontesVistas.add(chave);
        fontesUnicas.push(fonte);
      }
    });

    const sourceBox = document.createElement('div');
    sourceBox.className = 'sources';

    const title = document.createElement('strong');
    title.textContent = 'Fontes consultadas';
    sourceBox.append(title);

    const list = document.createElement('ul');

    fontesUnicas.forEach((fonte) => {
      const item = document.createElement('li');

      if (typeof fonte === 'string') {
        item.textContent = fonte;
      } else {
        const documento =
          fonte.documento ||
          fonte.arquivo ||
          fonte.nome ||
          'Documento institucional';

        const pagina = fonte.pagina
          ? ` — página ${fonte.pagina}`
          : '';

        item.textContent = documento + pagina;
      }

      list.append(item);
    });

    sourceBox.append(list);
    content.append(sourceBox);
  }

  row.append(content);
  messages.append(row);

  row.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });

  return row;
}

async function submit(text) {
  text = text.trim();

  if (!text) return;

  welcome.hidden = true;
  main.classList.remove('empty');
  add(text, 'user');

  input.value = '';
  input.style.height = 'auto';
  input.focus();

  const loadingRow = add(
    'Consultando a base institucional...',
    'assistant'
  );

  const sendButton = form.querySelector(
    'button[type="submit"], button:not([type])'
  );

  if (sendButton) sendButton.disabled = true;
  input.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pergunta: text
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    loadingRow.remove();

    const resposta =
      data.resposta ||
      data.response ||
      data.answer ||
      'Não foi possível obter uma resposta. Tente novamente.';

    const fontes =
      data.fontes ||
      data.sources ||
      [];

    add(resposta, 'assistant', fontes);
  } catch (error) {
    loadingRow.remove();

    console.error('Erro ao consultar o LabTech:', error);

    add(
      'Não consegui me conectar ao assistente. Verifique se o backend do LabTech está em execução e tente novamente.',
      'assistant'
    );
  } finally {
    input.disabled = false;

    if (sendButton) sendButton.disabled = false;

    input.focus();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submit(input.value);
});

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 140) + 'px';
});

document.querySelectorAll('[data-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    submit(button.dataset.prompt);
  });
});

function reset() {
  messages.replaceChildren();
  welcome.hidden = false;
  main.classList.add('empty');
  input.value = '';
  input.style.height = 'auto';
  input.disabled = false;
  input.focus();
}

document.querySelector('#reset').addEventListener('click', reset);
document.querySelector('#newChat').addEventListener('click', reset);


input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();

    if (!input.disabled) {
      form.requestSubmit();
    }
  }
});