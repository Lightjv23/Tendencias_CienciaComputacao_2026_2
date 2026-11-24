/*
 * Assistente Acadêmico Virtual da UDF — agente em 4 camadas (protótipo).
 *
 *   1. PERCEPTIVA  recebe a mensagem, remove dados pessoais e normaliza o texto
 *   2. COGNITIVA   identifica a intenção e os sinais de risco, usando a memória
 *   3. DECISÓRIA   aplica regras explícitas, em ordem, e escolhe UMA ação
 *   4. EXECUTIVA   monta a resposta, atualiza a memória e registra o atendimento
 *
 * Cada resposta devolve um "rastro" com o que aconteceu em cada camada,
 * para que a decisão possa ser explicada (princípio da interpretabilidade).
 *
 * O agente não usa rede, servidor nem chave de API: tudo roda no navegador
 * (ou no Node.js, para os testes automatizados).
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica(require('./base-conhecimento.js'));
  else raiz.Agente = fabrica(raiz.BASE);
})(typeof self !== 'undefined' ? self : this, function (BASE) {
  'use strict';

  var CFG = BASE.config;

  /* ===================================================================== *
   * 1. CAMADA PERCEPTIVA
   * ===================================================================== */

  /* Privacidade desde o projeto: o dado pessoal é removido ANTES de qualquer
   * outra camada ver a mensagem. Ele nunca chega à memória nem ao registro. */
  var PADROES_PESSOAIS = [
    { tipo: 'senha', re: /(senha[^,.;!?\n]{0,30}?(?:\s(?:é|e|eh)\s+|[:=]\s*))(\S+)/gi, manter: 1 },
    { tipo: 'e-mail', re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g },
    { tipo: 'CPF', re: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g },
    { tipo: 'telefone', re: /\(?\b\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}\b/g },
    { tipo: 'número de registro', re: /\b\d{7,9}\b/g }
  ];
  var MARCA = '[dado removido]';

  /* Mitigação de viés de linguagem: abreviações e formas informais são
   * convertidas para a forma comum antes da interpretação. */
  var ABREVIACOES = {
    q: 'que', oq: 'o que', pq: 'porque', cm: 'como', cmo: 'como', vc: 'voce', vcs: 'voces',
    pfv: 'por favor', pf: 'por favor', pra: 'para', pro: 'para o', to: 'estou', tou: 'estou',
    ta: 'esta', tb: 'tambem', tbm: 'tambem', mt: 'muito', n: 'nao', nao: 'nao', eh: 'e',
    blz: 'beleza', qdo: 'quando', qnd: 'quando', hj: 'hoje', obg: 'obrigado', vlw: 'valeu',
    facu: 'faculdade', mano: '', mana: '', tche: '', bah: '', oxe: '', oxente: '', uai: '', vei: '', vey: ''
  };

  function removerDadosPessoais(texto) {
    var tipos = [];
    PADROES_PESSOAIS.forEach(function (p) {
      texto = texto.replace(p.re, function (tudo, g1) {
        if (tipos.indexOf(p.tipo) < 0) tipos.push(p.tipo);
        return p.manter ? g1 + MARCA : MARCA;
      });
    });
    return { texto: texto, tipos: tipos };
  }

  function normalizar(texto) {
    var limpo = texto.toLowerCase()
      .replace(/\[dado removido\]/g, ' ')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ');
    return limpo.split(/\s+/).filter(Boolean).map(function (t) {
      return Object.prototype.hasOwnProperty.call(ABREVIACOES, t) ? ABREVIACOES[t] : t;
    }).filter(Boolean).join(' ');
  }

  function perceber(mensagem) {
    var bruto = String(mensagem == null ? '' : mensagem).slice(0, 1000);
    var seguro = removerDadosPessoais(bruto);
    var normalizado = normalizar(seguro.texto);
    /* "meu e-mail é ..." apenas anuncia o dado removido; não é a dúvida do estudante. */
    if (seguro.tipos.length) {
      normalizado = normalizado
        .replace(/\b(meu|minha|o|a) (cpf|rgm|e mail|email|telefone|celular|whatsapp|numero|registro)\b( e\b)?/g, ' ')
        .replace(/\s+/g, ' ').trim();
    }
    return {
      texto: seguro.texto.trim(), // já sem dados pessoais
      normalizado: normalizado,
      dadosPessoais: seguro.tipos,
      vazio: normalizado.replace(/[^a-z]/g, '').length < 2
    };
  }

  /* ===================================================================== *
   * 2. CAMADA COGNITIVA
   * ===================================================================== */

  var cacheRegex = {};
  function contem(texto, termo) {
    var re = cacheRegex[termo];
    if (!re) {
      var fonte = termo.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '\\w*').replace(/\s+/g, '\\s+');
      re = cacheRegex[termo] = new RegExp('\\b' + fonte + '\\b');
    }
    return re.test(texto);
  }
  function algum(texto, termos) {
    return termos.some(function (t) { return contem(texto, t); });
  }

  function pontuar(texto, intencao) {
    var pontos = 0;
    (intencao.fortes || []).forEach(function (t) {
      if (typeof t === 'string') { if (contem(texto, t)) pontos += 3; }
      else if (contem(texto, t.t)) pontos += t.p;
    });
    (intencao.fracos || []).forEach(function (t) { if (contem(texto, t)) pontos += 1; });
    (intencao.combos || []).forEach(function (c) {
      if (algum(texto, c[0]) && algum(texto, c[1])) pontos += 6;
    });
    return pontos;
  }

  /* Sinais de risco: situações que o agente precisa reconhecer antes de
   * tentar responder (testes adversariais, privacidade e limites de escopo). */
  var SINAIS = [
    { id: 'sofrimento', re: /quero desistir de tudo|nao vejo saida|desesperad|me matar|suicid|acabar com tudo|nao quero mais viver/ },
    { id: 'manipulacao', re: /ignor\w* .*(instruc|regra|orientac)|esquec\w* .*(instruc|regra)|seu prompt|suas instrucoes|suas regras|finja|faca de conta|aja como|voce agora e|modo desenvolvedor|sem restric/ },
    { id: 'autoridade', re: /\bsou (o |a |um |uma )?(coordenador|professor|diretor|reitor|administrador|secretari|funcionari|desenvolvedor)/ },
    { id: 'fraude', re: /respostas? da prova|gabarito|\bcolar? na prova|(escrev|faz|faca|fazer|redij)\w* (o |a |todo o )?(meu|minha|nosso) (tcc|trabalho|monografia|redacao|atividade)|falsific|atestado falso|comprar (um )?(diploma|atestado|tcc)/ },
    { id: 'ofensa', re: /\b(lixo|burro|burra|idiota|inutil|imbecil|merda|porcaria|bosta|estupid\w*|otario|nao serve para nada|vai se)\b/ },
    { id: 'terceiros', re: /(nota|notas|faltas|boleto|historico|dados|telefone|endereco) d[oa]s? (aluno|aluna|alunos|colega|estudante|fulan\w*|professor\w*)/ },
    { id: 'individual', re: /\b(minha|minhas|meu|meus) (nota|notas|media|medias|boleto|boletos|faltas)\b|quantas faltas (eu )?(ja )?tenho|qual (e )?a minha (nota|media)|(ja )?(passei|fui aprovad\w*|fui reprovad\w*) (em|na|no)\b/ },
    { id: 'transacao', re: /\b(faz|faca|fazer|realiz\w*|efetu\w*|tranc\w*|entr\w*|resolv\w*|matricul\w*|rematricul\w*|pag\w*|envi\w*|emit\w*|ger\w*) .{0,30}\b(para|por) mim\b|\bme (matricul|rematricul|inscrev)\w*\b|\b(autoriz|liber|aprov|defir)\w* (a |o )?(minha|meu|a|o)\b|confirm\w* que (a |o )?(minha|meu)/ },
    { id: 'opiniao', re: /(melhor|pior) (professor|professora|curso|coordenador|faculdade)|(professor|professora|curso)\w* .{0,25}\b(melhor|pior)\b|o que voce acha d/ },
    { id: 'inventar', re: /\b(invent\w*|chut\w*|qualquer um|pode ser falso)\b/ },
    { id: 'contestacao', re: /\b(errad\w*|incorret\w*|mentira|equivocad\w*)\b|nao e assim|(falou|falaram|disse|disseram|informou|informaram) outra coisa|nao foi isso|discordo|quero (reclamar|contestar)/ },
    { id: 'identidade', re: /voce e (uma? )?(pessoa|humano|humana|robo|bot|maquina|ia|real|gente)|e um robo|estou falando com (uma? )?(pessoa|robo|humano)/ },
    { id: 'humano', re: /falar com (uma? )?(pessoa|atendente|alguem|humano|funcionari\w*)|tem (algum )?atendente|atendimento humano|me passa para/ }
  ];

  var PISTAS_CONTINUACAO = /^(e |mas |entao )|\b(prazo|quando|data|documento\w*|onde|quanto|quem|como|isso|esse|essa|dele|dela)\b/;

  function compreender(percepcao, memoria) {
    var texto = percepcao.normalizado;
    var sinais = SINAIS.filter(function (s) { return s.re.test(texto); }).map(function (s) { return s.id; });

    var candidatos = BASE.intencoes.map(function (i) {
      return { intencao: i, pontos: pontuar(texto, i), contexto: false };
    });

    /* Memória curta: se a mensagem parece continuação ("e o prazo?"), as
     * intenções do último tema recebem um reforço. */
    var especificos = candidatos.filter(function (c) { return !c.intencao.generica && c.pontos >= CFG.LIMIAR_CONFIANCA; });
    if (!especificos.length && memoria.ultimoTema && PISTAS_CONTINUACAO.test(texto)) {
      candidatos.forEach(function (c) {
        if (c.intencao.tema === memoria.ultimoTema && c.pontos > 0 && !c.intencao.generica) {
          c.pontos += 2; c.contexto = true;
        }
      });
    }

    candidatos = candidatos.filter(function (c) { return c.pontos > 0; })
      .sort(function (a, b) { return b.pontos - a.pontos; });
    var aceitos = candidatos.filter(function (c) { return c.pontos >= CFG.LIMIAR_CONFIANCA; });
    var naoGenericos = aceitos.filter(function (c) { return !c.intencao.generica; });
    if (naoGenericos.length) aceitos = naoGenericos;

    var principal = aceitos[0] || null;

    /* Mais de um assunto na mesma mensagem: temas diferentes com pontuação próxima. */
    var concorrentes = [];
    if (principal) {
      var temas = {};
      aceitos.forEach(function (c) {
        if (c.pontos >= principal.pontos - 2 && !temas[c.intencao.tema]) {
          temas[c.intencao.tema] = true; concorrentes.push(c);
        }
      });
    }

    var conversa = null;
    if (!principal) {
      BASE.conversa.forEach(function (i) {
        var p = pontuar(texto, i);
        if (p >= CFG.LIMIAR_CONFIANCA && (!conversa || p > conversa.pontos)) conversa = { intencao: i, pontos: p };
      });
    }

    return {
      sinais: sinais,
      principal: principal,
      varios: concorrentes.length > 1 ? concorrentes : null,
      conversa: conversa,
      candidatos: candidatos.slice(0, 3).map(function (c) { return { id: c.intencao.id, pontos: c.pontos }; })
    };
  }

  /* ===================================================================== *
   * 3. CAMADA DECISÓRIA
   * ===================================================================== */

  /* As regras são avaliadas em ordem; a primeira que se aplica decide.
   * A ordem é uma escolha ética registrada: segurança e privacidade vêm
   * antes de qualquer tentativa de ser prestativo. */
  var REGRAS = [
    { id: 'R01', acao: 'esclarecer', porque: 'Mensagem vazia ou ilegível: pedir que reformule em vez de adivinhar.',
      quando: function (c) { return c.percepcao.vazio; } },
    { id: 'R02', acao: 'acolher', porque: 'Sinal de sofrimento: acolher e indicar apoio humano tem prioridade sobre qualquer dúvida.',
      quando: function (c) { return tem(c, 'sofrimento'); } },
    { id: 'R03', acao: 'proteger_senha', porque: 'Senha recebida: nunca usar nem repetir, e orientar a não compartilhar.',
      quando: function (c) { return c.percepcao.dadosPessoais.indexOf('senha') >= 0; } },
    { id: 'R04', acao: 'recusar_manipulacao', porque: 'Tentativa de mudar as regras ou alegação de autoridade: as regras não mudam por pedido.',
      quando: function (c) { return tem(c, 'manipulacao') || (tem(c, 'autoridade') && (tem(c, 'transacao') || !c.cognicao.principal)); } },
    { id: 'R05', acao: 'recusar_fraude', porque: 'Pedido que fere a integridade acadêmica: recusar e oferecer a ajuda legítima.',
      quando: function (c) { return tem(c, 'fraude'); } },
    { id: 'R06', acao: 'recusar_terceiros', porque: 'Pedido de dados de outra pessoa: recusar para proteger a privacidade.',
      quando: function (c) { return tem(c, 'terceiros'); } },
    { id: 'R07', acao: 'acalmar', porque: 'Ofensa: não revidar e voltar a oferecer ajuda.',
      quando: function (c) { return tem(c, 'ofensa'); } },
    { id: 'R08', acao: 'remediar', porque: 'Estudante contestou a resposta: reconhecer o limite e indicar um setor humano.',
      quando: function (c) { return tem(c, 'contestacao') && c.memoria.ultimaIntencao && !c.cognicao.principal; } },
    { id: 'R09', acao: 'encaminhar_dado_individual', porque: 'Dado individual do estudante: o agente não tem acesso; indicar a Área do Aluno.',
      quando: function (c) { return tem(c, 'individual'); } },
    { id: 'R10', acao: 'recusar_transacao', porque: 'Pedido de execução ou de decisão: o agente só informa e encaminha.',
      quando: function (c) { return tem(c, 'transacao'); } },
    { id: 'R11', acao: 'recusar_opiniao', porque: 'Pedido de opinião sobre pessoas ou cursos: fora do papel do agente.',
      quando: function (c) { return tem(c, 'opiniao'); } },
    { id: 'R12', acao: 'identificar', porque: 'Pergunta sobre a natureza do assistente: dizer que é virtual (transparência).',
      quando: function (c) { return tem(c, 'identidade'); } },
    { id: 'R13', acao: 'encaminhar_humano', porque: 'Pedido de atendimento humano: indicar o setor responsável.',
      quando: function (c) { return tem(c, 'humano'); } },
    { id: 'R14', acao: 'separar_assuntos', porque: 'Mais de um assunto na mensagem: tratar um por vez para não misturar regras.',
      quando: function (c) { return !!c.cognicao.varios; } },
    { id: 'R15', acao: 'esclarecer_tema', porque: 'Assunto amplo demais: oferecer as opções em vez de supor.',
      quando: function (c) { return c.cognicao.principal && c.cognicao.principal.intencao.generica; } },
    { id: 'R16', acao: 'responder_sem_data', porque: 'Informação que muda a cada semestre e sem fonte vigente: não afirmar data; indicar onde consultar.',
      quando: function (c) { return c.cognicao.principal && c.cognicao.principal.intencao.temporal; } },
    { id: 'R17', acao: 'recusar_inventar', porque: 'Pedido para inventar ou chutar: o agente só afirma o que está na base.',
      quando: function (c) { return tem(c, 'inventar') && (!c.cognicao.principal || c.cognicao.principal.intencao.id === 'contato'); } },
    { id: 'R18', acao: 'responder', porque: 'Dúvida dentro do escopo e com conteúdo na base: responder e indicar o próximo passo.',
      quando: function (c) { return !!c.cognicao.principal; } },
    { id: 'R19', acao: 'conversar', porque: 'Saudação, pedido de ajuda ou despedida.',
      quando: function (c) { return !!c.cognicao.conversa; } },
    { id: 'R20', acao: 'encaminhar_canal', porque: 'Segunda mensagem seguida sem compreensão: encaminhar em vez de insistir.',
      quando: function (c) { return c.memoria.falhas + 1 >= CFG.MAX_FALHAS; } },
    { id: 'R21', acao: 'esclarecer', porque: 'Assunto não reconhecido ou fora do escopo: dizer isso e oferecer os temas.',
      quando: function () { return true; } }
  ];

  function tem(contexto, sinal) { return contexto.cognicao.sinais.indexOf(sinal) >= 0; }

  function decidir(percepcao, cognicao, memoria) {
    var contexto = { percepcao: percepcao, cognicao: cognicao, memoria: memoria };
    for (var i = 0; i < REGRAS.length; i++) {
      if (REGRAS[i].quando(contexto)) return { regra: REGRAS[i].id, acao: REGRAS[i].acao, porque: REGRAS[i].porque };
    }
  }

  /* ===================================================================== *
   * 4. CAMADA EXECUTIVA
   * ===================================================================== */

  function preencher(modelo, intencao) {
    var setor = intencao && intencao.setor ? BASE.setores[intencao.setor] : CFG.CANAL;
    return modelo
      .replace(/\{SEMESTRE\}/g, CFG.SEMESTRE)
      .replace(/\{CANAL\}/g, CFG.CANAL)
      .replace(/\{TEMAS\}/g, CFG.TEMAS.join(', ').toLowerCase().replace('tcc', 'TCC'))
      .replace(/\{SETOR\}/g, setor);
  }

  var FALAS = {
    esclarecer: 'Não consegui relacionar a sua mensagem a um assunto acadêmico que eu conheça. ' +
      'Posso ajudar com os temas abaixo. Qual deles chega mais perto da sua dúvida?',
    acolher: 'Sinto muito que você esteja passando por isso. Eu sou um assistente virtual e só sei tratar de dúvidas acadêmicas, ' +
      'então não sou a ajuda de que você precisa agora.\n\n' +
      'Procure alguém de confiança ou o apoio ao estudante da instituição. ' +
      'Se estiver em sofrimento intenso, o **CVV atende 24 horas pelo telefone 188**.',
    proteger_senha: 'Por segurança, não compartilhe a sua senha com ninguém, nem comigo. Eu não acesso sistemas e não usei o que você enviou.\n\n' +
      'Como ela foi digitada aqui, o melhor é **trocá-la**. O que você precisa fazer é feito por você mesmo, na Área do Aluno.',
    recusar_manipulacao: 'Não posso fazer isso. As minhas regras são as mesmas para todo mundo e não mudam por pedido. ' +
      'Eu também não autorizo nem confirmo pedidos: só explico como eles funcionam.\n\nPosso ajudar com alguma dúvida acadêmica?',
    recusar_fraude: 'Com isso eu não ajudo, porque fere a integridade acadêmica.\n\n' +
      'O que posso fazer é explicar as regras e indicar quem orienta você no curso. Quer saber como funciona o TCC ou outro tema?',
    recusar_terceiros: 'Não tenho acesso a dados de estudantes ou professores e não informaria dados de outra pessoa.',
    acalmar: 'Entendo a frustração. Vamos tentar de novo: diga qual é a sua dúvida ou escolha um dos temas abaixo.',
    remediar: 'Pode ser que eu esteja errado, e você tem o direito de contestar. A informação oficial é a de {SETOR}: ' +
      'vale confirmar por lá.\n\nRegistrei que esta resposta foi contestada, para a equipe do projeto revisar.',
    encaminhar_dado_individual: 'Eu não tenho acesso a notas, faltas, boletos ou qualquer dado individual. ' +
      'Essas informações ficam na **Área do Aluno**.\n\nSe quiser, explico a regra geral sobre o assunto.',
    recusar_transacao: 'Isso eu não consigo fazer por aqui: eu não executo nem aprovo pedidos, só explico como funcionam. ' +
      'Solicitações são feitas na Área do Aluno ou com {SETOR}.',
    recusar_opiniao: 'Prefiro não opinar sobre professores, cursos ou decisões da instituição. Posso ajudar com regras e procedimentos acadêmicos.',
    identificar: 'Sou um assistente virtual, um protótipo criado por estudantes da UDF. Não sou uma pessoa nem um funcionário da instituição. ' +
      'Para falar com alguém, procure {SETOR}.',
    encaminhar_humano: 'Sou um assistente virtual e não transfiro a conversa. Para falar com uma pessoa, procure {SETOR}.',
    separar_assuntos: 'Vi mais de um assunto na sua mensagem. Para não misturar as regras, vamos um de cada vez. Por qual começamos?',
    recusar_inventar: 'Não vou inventar nem chutar uma informação: se ela estiver errada, quem sai prejudicado é você. ' +
      'Os dados corretos estão em {CANAL}.',
    encaminhar_canal: 'Ainda não consegui entender, e não quero fazer você perder tempo. ' +
      'Para essa dúvida, o melhor caminho é procurar {CANAL}.\n\nSe preferir, escolha um dos temas que eu conheço:',
    aviso_dado: 'Notei um dado pessoal na sua mensagem ({TIPOS}). Não preciso dele e não o guardei.\n\n',
    cuidado: ''
  };

  function executar(decisao, percepcao, cognicao, memoria) {
    var principal = cognicao.principal ? cognicao.principal.intencao : null;
    var anterior = memoria.ultimaIntencao ? buscarIntencao(memoria.ultimaIntencao) : null;
    var texto, opcoes = null, intencaoUsada = null;

    switch (decisao.acao) {
      case 'responder':
      case 'responder_sem_data':
        texto = preencher(principal.resposta, principal); intencaoUsada = principal; break;
      case 'esclarecer_tema':
        texto = principal.resposta; opcoes = principal.esclarecer; break;
      case 'separar_assuntos':
        texto = FALAS.separar_assuntos;
        opcoes = cognicao.varios.map(function (c) { return c.intencao.rotulo; }); break;
      case 'conversar':
        texto = preencher(cognicao.conversa.intencao.resposta);
        if (cognicao.conversa.intencao.menu) opcoes = CFG.TEMAS; break;
      case 'remediar':
      case 'encaminhar_humano':
      case 'identificar':
        texto = preencher(FALAS[decisao.acao], anterior); break;
      case 'recusar_transacao':
        texto = preencher(FALAS.recusar_transacao, principal || anterior); break;
      case 'esclarecer':
      case 'acalmar':
      case 'encaminhar_canal':
        texto = preencher(FALAS[decisao.acao]); opcoes = CFG.TEMAS; break;
      default:
        texto = preencher(FALAS[decisao.acao]);
    }

    if (percepcao.dadosPessoais.length && decisao.acao !== 'proteger_senha') {
      texto = FALAS.aviso_dado.replace('{TIPOS}', percepcao.dadosPessoais.join(', ')) + texto;
    }

    /* Atualização da memória. Só entra texto já sem dados pessoais. */
    var falhou = decisao.acao === 'esclarecer' || decisao.acao === 'encaminhar_canal';
    memoria.falhas = decisao.acao === 'esclarecer' ? memoria.falhas + 1 : 0;
    if (intencaoUsada) {
      memoria.ultimoTema = intencaoUsada.tema;
      memoria.ultimaIntencao = intencaoUsada.id;
      memoria.media.temas[intencaoUsada.tema] = (memoria.media.temas[intencaoUsada.tema] || 0) + 1;
    }
    memoria.media.trocas += 1;
    memoria.curta.push({ estudante: percepcao.texto, acao: decisao.acao, intencao: intencaoUsada ? intencaoUsada.id : null });
    if (memoria.curta.length > CFG.LIMITE_MEMORIA_CURTA) memoria.curta.shift();

    return { texto: texto, opcoes: opcoes, intencao: intencaoUsada ? intencaoUsada.id : null, naoCompreendida: falhou };
  }

  function buscarIntencao(id) {
    for (var i = 0; i < BASE.intencoes.length; i++) if (BASE.intencoes[i].id === id) return BASE.intencoes[i];
    return null;
  }

  /* ===================================================================== *
   * AGENTE
   * ===================================================================== */

  function criarAgente() {
    var memoria = novaMemoria();
    var registro = []; // insumo da curadoria; existe só enquanto a página está aberta

    function novaMemoria() {
      return {
        curta: [], // últimas trocas: mantém a coerência da conversa
        media: { temas: {}, trocas: 0 }, // resumo da sessão: sem texto, só contagens
        longa: null, // desativada por decisão de projeto: exigiria identificar o estudante
        ultimoTema: null, ultimaIntencao: null, falhas: 0
      };
    }

    function responder(mensagem) {
      var percepcao = perceber(mensagem);
      var cognicao = compreender(percepcao, memoria);
      var decisao = decidir(percepcao, cognicao, memoria);
      var execucao = executar(decisao, percepcao, cognicao, memoria);

      var item = {
        n: registro.length + 1,
        mensagem: percepcao.texto,
        intencao: execucao.intencao,
        regra: decisao.regra,
        acao: decisao.acao,
        naoCompreendida: execucao.naoCompreendida,
        contestada: decisao.acao === 'remediar',
        avaliacao: null
      };
      registro.push(item);

      return {
        n: item.n,
        texto: execucao.texto,
        opcoes: execucao.opcoes,
        acao: decisao.acao,
        intencao: execucao.intencao,
        rastro: {
          perceptiva: 'Recebi: "' + percepcao.texto + '"' +
            (percepcao.dadosPessoais.length ? ' — removi antes de processar: ' + percepcao.dadosPessoais.join(', ') + '.' : ' — nenhum dado pessoal detectado.'),
          cognitiva: (cognicao.candidatos.length
            ? 'Intenções mais prováveis: ' + cognicao.candidatos.map(function (c) { return c.id + ' (' + c.pontos + ')'; }).join(', ') + '.'
            : 'Nenhuma intenção acadêmica reconhecida.') +
            (cognicao.sinais.length ? ' Sinais: ' + cognicao.sinais.join(', ') + '.' : '') +
            (cognicao.principal && cognicao.principal.contexto ? ' Usei o assunto anterior da conversa.' : ''),
          decisoria: 'Regra ' + decisao.regra + ' — ' + decisao.porque,
          executiva: 'Ação: ' + decisao.acao + (execucao.intencao ? ' (conteúdo: ' + execucao.intencao + ').' : '.')
        }
      };
    }

    /* Remediação e ciclo de melhoria: o estudante avalia cada resposta. */
    function avaliar(n, valor) {
      var item = registro[n - 1];
      if (!item || (valor !== 'util' && valor !== 'nao_util')) return null;
      item.avaliacao = valor;
      if (valor === 'util') return 'Obrigado pelo retorno!';
      return preencher('Obrigado por avisar. Registrei que esta resposta não ajudou, para a equipe revisar. ' +
        'Para não ficar sem resposta, procure {SETOR}.', item.intencao ? buscarIntencao(item.intencao) : null);
    }

    return {
      responder: responder,
      avaliar: avaliar,
      saudacao: function () { return { texto: preencher(BASE.conversa[0].resposta), opcoes: CFG.TEMAS }; },
      memoria: function () { return JSON.parse(JSON.stringify(memoria)); },
      registro: function () { return JSON.parse(JSON.stringify(registro)); },
      reiniciar: function () { memoria = novaMemoria(); registro = []; }
    };
  }

  return { criarAgente: criarAgente, regras: REGRAS, perceber: perceber, normalizar: normalizar };
});
