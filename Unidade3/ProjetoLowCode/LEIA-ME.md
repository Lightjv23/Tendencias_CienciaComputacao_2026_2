# Base de conhecimento inicial — LabTech / UDF

Preparação inicial dos 15 PDFs enviados.

- `manifesto.json`: inventário dos documentos e extração.
- `chunks.jsonl`: trechos associados a documento e página, para futura busca/indexação.
- `textos/`: texto extraído, separado por página.
- `originais/Docs/`: PDFs originais preservados.

## Cuidados antes de produção
- O calendário acadêmico tem páginas majoritariamente em imagem; confirmar datas por OCR/revisão visual.
- Os guias de envio de comprovantes contêm capturas de tela; revisar os passos visualmente.
- Conferir prazos e eventuais conflitos entre edital, prorrogação, informativo e manual.
- Na implementação, recuperar trechos relevantes e citar documento/página. Se a base não confirmar uma resposta, o bot deve admitir a incerteza e orientar o aluno ao canal oficial.
- Esta é uma base preparada para integração; ainda não conecta automaticamente a IA ao chatbot.
