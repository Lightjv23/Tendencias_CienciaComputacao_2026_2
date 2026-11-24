/*
 * Base de conhecimento e parâmetros do Assistente Acadêmico (protótipo).
 *
 * Tudo o que o agente sabe está neste arquivo. Para atualizar o conteúdo
 * a cada semestre, edite apenas aqui: o código do agente não muda.
 *
 * ATENÇÃO: as respostas abaixo são orientações gerais. Cada item tem o campo
 * `validado`, que só deve passar a `true` depois de conferido pela equipe
 * com o documento oficial da UDF correspondente.
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.BASE = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* Parâmetros do template (parte dinâmica do "prompt"). */
  var config = {
    SEMESTRE: '2026/2',
    ACERVO_ATUALIZADO_EM: 'novembro de 2026',
    CANAL: 'os canais oficiais de atendimento da UDF',
    TEMAS: ['Rematrícula', 'Estágio', 'TCC', 'Dependência', 'Faltas'],
    LIMITE_MEMORIA_CURTA: 6, // quantidade de trocas guardadas
    LIMIAR_CONFIANCA: 3, // pontuação mínima para aceitar uma intenção
    MAX_FALHAS: 2 // falhas seguidas antes de encaminhar ao atendimento
  };

  var setores = {
    secretaria: 'a secretaria acadêmica',
    coordenacao: 'a coordenação do seu curso',
    estagio: 'o setor de estágio',
    tcc: 'o professor responsável pelo TCC no seu curso',
    financeiro: 'o setor financeiro'
  };

  /*
   * Intenções acadêmicas.
   *  - fortes: termos que valem 3 pontos (ou {t, p} para peso próprio)
   *  - fracos: termos que valem 1 ponto
   *  - combos: pares de grupos; se houver um termo de cada grupo, soma 6
   *  - termo terminado em * casa por prefixo (ex.: "abon*" casa "abona", "abono")
   *  - temporal: a resposta depende do semestre; nunca afirmar data sem fonte vigente
   *  - generica: só é usada se nenhuma outra intenção acadêmica for reconhecida
   * Os termos são escritos sem acento e em minúsculas (forma normalizada).
   */
  var REMAT = ['rematricula', 'renovar matricula', 'renovar a matricula', 'renovo a matricula',
    'renova a matricula', 'renovacao de matricula', 'renovar meu vinculo', 'renovar o vinculo'];

  var intencoes = [
    {
      id: 'rematricula_como', tema: 'matricula', rotulo: 'Rematrícula', setor: 'secretaria',
      fortes: REMAT, fracos: ['vinculo'],
      validado: false,
      resposta:
        'A rematrícula é a renovação do seu vínculo com a UDF a cada semestre.\n\n' +
        '1. Acesse a **Área do Aluno**.\n' +
        '2. Procure a opção de rematrícula e o edital do semestre.\n' +
        '3. Siga as etapas indicadas e confira se a confirmação foi registrada.\n\n' +
        'Pendências acadêmicas ou financeiras podem impedir a renovação. ' +
        'Se aparecer algum bloqueio, procure {SETOR}.'
    },
    {
      id: 'rematricula_prazo', tema: 'matricula', rotulo: 'Prazo da rematrícula', setor: 'secretaria',
      temporal: true,
      fracos: ['prazo', 'quando', 'data'],
      combos: [[REMAT, ['prazo', 'quando', 'ate quando', 'data', 'abre', 'perdi', 'termina', 'encerra', 'aproximada', 'chuta*']]],
      validado: false,
      resposta:
        'Não tenho a data da rematrícula confirmada para {SEMESTRE}, e não vou arriscar um palpite: ' +
        'uma data errada poderia fazer você perder o prazo.\n\n' +
        'O período vigente está no **calendário acadêmico** e no edital de rematrícula, na Área do Aluno. ' +
        'Se o prazo já tiver passado, procure {SETOR} para saber se ainda há como regularizar.'
    },
    {
      id: 'trancamento', tema: 'matricula', rotulo: 'Trancamento', setor: 'secretaria',
      fortes: ['trancar', 'tranco', 'tranca', 'trancamento'],
      validado: false,
      resposta:
        'O trancamento suspende o seu vínculo por um período, sem perder a vaga. ' +
        'O pedido é formal e as condições (prazo, duração e custos) estão no regulamento da instituição.\n\n' +
        'Eu não consigo dizer se o seu pedido será aceito. Quem analisa é {SETOR}: ' +
        'o próximo passo é abrir a solicitação por lá.'
    },
    {
      id: 'matricula_geral', tema: 'matricula', rotulo: 'Matrícula', generica: true,
      fortes: ['matricula'],
      esclarecer: ['Rematrícula', 'Trancamento', 'Declaração de matrícula'],
      resposta: 'Sobre matrícula, qual destes assuntos você procura?'
    },
    {
      id: 'dp', tema: 'dependencia', rotulo: 'Dependência', setor: 'coordenacao', cuidado: true,
      fortes: ['dp', 'dps', 'dependencia', 'dependencias', 'reprovei', 'reprovado', 'reprovada', 'reprovar',
        'bombei', 'devendo materia', 'devendo disciplina', 'devendo uma materia', 'repeti', 'repetir a materia'],
      validado: false,
      resposta:
        'Reprovar em uma disciplina acontece, e tem caminho para resolver. ' +
        'A **dependência (DP)** é cursar de novo a disciplina em que você não foi aprovado, por nota ou por falta.\n\n' +
        '1. Veja no seu histórico, na Área do Aluno, quais disciplinas estão pendentes.\n' +
        '2. Confira quando e em que formato a disciplina será oferecida outra vez.\n' +
        '3. Inclua a DP na sua matrícula do período em que ela for ofertada.\n\n' +
        'A forma de oferta e os custos variam conforme o curso. Para montar o seu plano, procure {SETOR}.'
    },
    {
      id: 'faltas_regra', tema: 'frequencia', rotulo: 'Faltas', setor: 'secretaria',
      fortes: ['falt*', 'frequencia', 'presenca'],
      validado: false,
      resposta:
        'Nos cursos presenciais, a regra geral é frequência mínima de **75% das aulas de cada disciplina**. ' +
        'Abaixo disso há reprovação por falta, mesmo com nota suficiente.\n\n' +
        'Eu não tenho acesso às suas faltas: elas aparecem na Área do Aluno. ' +
        'Para a regra do seu curso ou modalidade, vale confirmar no regulamento ou com {SETOR}.'
    },
    {
      id: 'faltas_abono', tema: 'frequencia', rotulo: 'Atestado e justificativa de faltas', setor: 'secretaria',
      fortes: ['atestado', 'abon*', 'justific*'],
      combos: [[['doente', 'medico', 'internad*', 'cirurgia'], ['falt*']]],
      validado: false,
      resposta:
        'Em geral, o atestado **justifica** a ausência, mas não apaga a falta automaticamente. ' +
        'O abono ou um regime especial só existem em situações previstas em lei e no regulamento.\n\n' +
        'Eu não consigo dizer se o seu caso será aceito, porque essa análise é feita por pessoas. ' +
        'O próximo passo é protocolar o pedido com o documento em {SETOR}, o quanto antes.'
    },
    {
      id: 'estagio_como', tema: 'estagio', rotulo: 'Estágio', setor: 'estagio',
      fortes: ['estagio', 'estagios', 'estagiar', 'estagiario', 'estagiaria'],
      validado: false,
      resposta:
        'Existem dois tipos de estágio:\n\n' +
        '1. **Obrigatório**: previsto no projeto do curso e exigido para a formatura.\n' +
        '2. **Não obrigatório**: opcional, feito por escolha sua.\n\n' +
        'Nos dois casos é preciso um **termo de compromisso** assinado por você, pela empresa e pela instituição, ' +
        'e as atividades têm de ser compatíveis com o seu horário de aulas. ' +
        'Carga horária, semestre de início e aproveitamento de emprego como estágio variam por curso e turno.\n\n' +
        'Para o seu caso, o próximo passo é falar com {SETOR}.'
    },
    {
      id: 'estagio_docs', tema: 'estagio', rotulo: 'Documentos do estágio', setor: 'estagio',
      combos: [[['estagio', 'estagiar'], ['documento*', 'contrato', 'termo', 'assina*', 'entrego', 'entregar', 'papel', 'papeis']]],
      validado: false,
      resposta:
        'O documento central do estágio é o **termo de compromisso**, assinado por você, pela empresa e pela instituição, ' +
        'acompanhado do plano de atividades.\n\n' +
        'Modelos, prazos de entrega e outros documentos exigidos são definidos pela instituição. ' +
        'O próximo passo é pedir a lista atual para {SETOR} antes de começar a estagiar.'
    },
    {
      id: 'tcc', tema: 'tcc', rotulo: 'TCC', setor: 'tcc',
      fortes: ['tcc', 'trabalho de conclusao', 'monografia'],
      validado: false,
      resposta:
        'O TCC é o trabalho de conclusão de curso, feito com acompanhamento de um professor orientador.\n\n' +
        'Formato (individual ou em grupo, monografia, artigo ou projeto), prazos e forma de avaliação ' +
        '**mudam de um curso para outro** e podem mudar entre presencial e EAD. ' +
        'Por isso não vou afirmar uma regra única.\n\n' +
        'O próximo passo é consultar o regulamento de TCC do seu curso com {SETOR}.'
    },
    {
      id: 'horas_complementares', tema: 'horas', rotulo: 'Horas complementares', setor: 'coordenacao',
      fortes: ['horas complementares', 'hora complementar', 'atividades complementares', 'atividade complementar',
        'certificado*', 'curso online', 'curso livre', 'minicurso', 'palestra', 'workshop'],
      validado: false,
      resposta:
        'Cursos, palestras, eventos, monitoria e projetos podem contar como **horas complementares**, ' +
        'que são atividades fora da grade exigidas para a formatura.\n\n' +
        '1. Guarde o certificado, com carga horária e data.\n' +
        '2. Confira no regulamento do seu curso quais atividades são aceitas e o limite por categoria.\n' +
        '3. Envie o certificado pelo canal indicado pela instituição.\n\n' +
        'O total exigido e o que é aceito variam por curso. Em caso de dúvida, procure {SETOR}.'
    },
    {
      id: 'documento', tema: 'documentos', rotulo: 'Declaração de matrícula', setor: 'secretaria',
      fortes: ['declaracao', 'historico', 'diploma', { t: 'atestado de matricula', p: 6 },
        { t: 'comprovante de matricula', p: 6 }, { t: 'declaracao de matricula', p: 6 }],
      fracos: ['documento*'],
      validado: false,
      resposta:
        'Declarações, histórico e outros documentos acadêmicos são solicitados pela **Área do Aluno** ' +
        'ou diretamente com {SETOR}. Eu não emito documentos.\n\n' +
        'O próximo passo é abrir a solicitação e conferir o prazo de entrega informado no pedido.'
    },
    {
      id: 'financeiro', tema: 'financeiro', rotulo: 'Financeiro', setor: 'financeiro',
      fortes: ['mensalidade*', 'boleto*', 'pagar', 'pagamento*', 'desconto*', 'bolsa', 'bolsas',
        'financeiro', 'fies', 'prouni', 'negociar', 'divida', 'dividas'],
      validado: false,
      resposta:
        'Boletos e a situação dos pagamentos ficam na **Área do Aluno**. ' +
        'Eu não tenho acesso a valores nem informo descontos, porque eles dependem do seu contrato.\n\n' +
        'Para negociar, pedir segunda via ou tirar dúvidas sobre bolsas, o próximo passo é procurar {SETOR}.'
    },
    {
      id: 'calendario', tema: 'calendario', rotulo: 'Calendário acadêmico', setor: 'secretaria',
      temporal: true,
      fortes: ['calendario', 'comecam as aulas', 'inicio das aulas', 'volta as aulas', 'quando sao as provas',
        'data das provas', 'semana de provas', 'recesso', 'ferias'],
      validado: false,
      resposta:
        'Não tenho as datas de {SEMESTRE} confirmadas, então prefiro não informar nenhuma.\n\n' +
        'Início das aulas, provas e recessos estão no **calendário acadêmico** vigente, na Área do Aluno. ' +
        'Se não encontrar, {SETOR} pode confirmar.'
    },
    {
      id: 'contato', tema: 'contato', rotulo: 'Contatos',
      fortes: ['telefone', 'email', 'e mail', 'whatsapp', 'contato', 'contatos', 'endereco', 'ramal'],
      resposta:
        'Não tenho telefones, e-mails ou endereços confirmados, e não vou inventar um contato.\n\n' +
        'Os dados atualizados de cada setor estão em {CANAL}.'
    }
  ];

  /* Intenções de conversa: só valem quando nenhuma intenção acadêmica é reconhecida. */
  var conversa = [
    {
      id: 'saudar', fortes: ['oi', 'oie', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'eai', 'opa', 'tem alguem'],
      menu: true,
      resposta:
        'Olá! Sou o assistente acadêmico virtual da UDF, um protótipo de estudantes. ' +
        'Posso tirar dúvidas sobre **{TEMAS}**.\n\n' +
        'Não preciso dos seus dados pessoais: por favor, não envie RGM, CPF ou senhas. Sobre o que você quer saber?'
    },
    {
      id: 'ajuda', fortes: ['ajuda', 'me ajuda', 'o que voce faz', 'o que voce sabe', 'quais assuntos', 'menu', 'opcoes', 'como funciona isso'],
      menu: true,
      resposta:
        'Eu explico regras e procedimentos acadêmicos e indico o setor certo para cada assunto. ' +
        'Não faço matrícula, não consulto notas e não decido pedidos.\n\nEscolha um tema ou escreva a sua dúvida:'
    },
    {
      id: 'despedir', fortes: ['obrigado', 'obrigada', 'brigado', 'brigada', 'valeu', 'tchau', 'era so isso', 'ate mais', 'ate logo'],
      resposta: 'Por nada! Se surgir outra dúvida, é só chamar.'
    }
  ];

  return { config: config, setores: setores, intencoes: intencoes, conversa: conversa };
});
