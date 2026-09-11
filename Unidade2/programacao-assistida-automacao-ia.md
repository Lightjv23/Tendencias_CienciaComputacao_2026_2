# Programação Assistida e Automação com IA
## Identificação
- Nome:
- Turma: Noturno
- Data: 11/09/2026
- Ferramenta de IA utilizada: Claude
# API de Consulta de CEP

## 1. Problema
Construir uma pequena API/função em Python que, dado um CEP (Código de Endereçamento Postal brasileiro), retorne os dados de endereço correspondentes (logradouro, bairro, cidade, estado, DDD), consumindo o serviço público [ViaCEP](https://viacep.com.br/). A solução precisa validar a entrada, tratar erros de forma explícita e ser eficiente quando consultada repetidamente.

## 2. Entrada
- Uma string representando o CEP, podendo vir:
  - Sem formatação: `"01310100"`
  - Com hífen: `"01310-100"`
  - Com espaços ou caracteres extras: `" 01310-100 "`
  - Vazia, `None` ou com tipo inválido (ex.: número inteiro)
  - Formato correto mas inexistente na base dos Correios (ex.: `"99999999"`)

## 3. Processamento
1. Normalizar a entrada (remover tudo que não for dígito).
2. Validar se o resultado possui exatamente 8 dígitos numéricos.
3. Fazer a requisição HTTP GET para `https://viacep.com.br/ws/{cep}/json/`.
4. Interpretar a resposta JSON:
   - Se contiver `{"erro": true}`, o CEP é válido no formato mas não existe.
   - Se a requisição falhar (timeout, DNS, 5xx), tratar como indisponibilidade do serviço.
5. Estruturar a saída em um formato consistente (dataclass/dict).

## 4. Saída esperada
Um objeto/dicionário estruturado, por exemplo:
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "ddd": "11"
}
```
Ou uma exceção específica e informativa quando o CEP for inválido, inexistente, ou o serviço estiver indisponível.

## 5. Prompt utilizado
> "Crie uma função Python simples que receba um CEP como string, consulte a API pública ViaCEP e retorne os dados do endereço correspondente. Não se preocupe ainda com otimizações, apenas com o funcionamento básico."

## 6. Código inicial

```python
import requests

def consultar_cep(cep):
    url = f"https://viacep.com.br/ws/{cep}/json/"
    response = requests.get(url)
    data = response.json()
    return data
```

## 7. Análise crítica
O código funciona no "caminho feliz", mas tem vários problemas latentes:

- **Sem validação de entrada**: aceita qualquer string (ou até `None`), inclusive CEPs mal formatados, e só falha quando a API retorna erro — ou nem isso.
- **Sem tratamento de exceções**: qualquer falha de rede (timeout, DNS, conexão recusada) derruba a aplicação com uma exceção não tratada.
- **Sem timeout**: `requests.get` sem `timeout` pode travar indefinidamente se o servidor não responder.
- **Não distingue "CEP inválido" de "CEP não encontrado" de "serviço fora do ar"** — tudo vira o mesmo dicionário genérico ou uma exceção genérica.
- **Sem reuso de conexão**: cada chamada abre uma nova conexão TCP/TLS, o que é ineficiente para múltiplas consultas.
- **Sem cache**: CEPs repetidos disparam novas requisições HTTP desnecessárias.
- **Sem tipagem nem contrato claro de retorno**: quem consome a função não sabe se vai receber um dicionário de sucesso ou um dicionário de erro (`{"erro": true}`).

## 8. Casos de teste

### Teste 1
**Caso normal** — CEP válido e existente (`"01310-100"`, Avenida Paulista).
**Esperado:** retorno estruturado com `uf="SP"`, `localidade="São Paulo"`, `logradouro="Avenida Paulista"`.

```python
@patch("meu_modulo._sessao_http.get")
def test_consultar_cep_valido(mock_get):
    mock_resposta = MagicMock()
    mock_resposta.json.return_value = {
        "cep": "01310-100",
        "logradouro": "Avenida Paulista",
        "bairro": "Bela Vista",
        "localidade": "São Paulo",
        "uf": "SP",
        "ddd": "11",
    }
    mock_resposta.raise_for_status.return_value = None
    mock_get.return_value = mock_resposta

    consultar_cep.cache_clear()
    endereco = consultar_cep("01310-100")

    assert endereco.uf == "SP"
    assert endereco.localidade == "São Paulo"
```

### Teste 2
**Caso limite** — entrada vazia (`""`).
**Esperado:** deve lançar `CepInvalidoError` imediatamente, sem sequer chamar a rede.

```python
def test_consultar_cep_entrada_vazia():
    consultar_cep.cache_clear()
    with pytest.raises(CepInvalidoError):
        consultar_cep("")
```

### Teste 3
**Caso de erro** — CEP com formato válido (8 dígitos) mas inexistente na base (`"99999999"`).
**Esperado:** a API responde `{"erro": true}` e a função deve lançar `CepNaoEncontradoError`, distinguindo esse caso de um erro de formato.

```python
@patch("meu_modulo._sessao_http.get")
def test_consultar_cep_nao_encontrado(mock_get):
    mock_resposta = MagicMock()
    mock_resposta.json.return_value = {"erro": True}
    mock_resposta.raise_for_status.return_value = None
    mock_get.return_value = mock_resposta

    consultar_cep.cache_clear()
    with pytest.raises(CepNaoEncontradoError):
        consultar_cep("99999999")
```

## 9. Problemas encontrados
- Uma chamada sem `timeout` pode travar a thread da aplicação por tempo indefinido em caso de instabilidade de rede.
- `response.raise_for_status()` estava ausente: erros HTTP 4xx/5xx passavam despercebidos e o `.json()` podia falhar de forma confusa.
- Não havia diferenciação entre "CEP mal formatado" (erro do cliente) e "CEP não encontrado" (resposta válida da API dizendo que não existe) e "serviço fora do ar" (problema de infraestrutura) — todos precisam de tratamento diferente por quem consome a função.
- Consultas repetidas ao mesmo CEP geravam tráfego de rede desnecessário, aumentando latência e risco de rate limiting.
- Sem `Session`, cada requisição refazia o handshake TLS, aumentando a latência média das chamadas.

## 10. Prompt de refatoração
> "Refatore essa função para produção: adicione validação e normalização de entrada com regex, exceções específicas para cada tipo de falha (formato inválido, não encontrado, serviço indisponível), timeout e política de retry nas requisições, reuso de conexão HTTP via `Session`, cache para CEPs já consultados, tipagem estática e um objeto de retorno estruturado (dataclass) em vez de um dicionário solto."

## 11. Código refatorado

```python
"""
API de consulta de CEP (Brasil) usando o serviço público ViaCEP.

Módulo responsável por validar, consultar e formatar dados de
endereço a partir de um CEP.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Final

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logger = logging.getLogger(__name__)

_CEP_REGEX: Final = re.compile(r"^\d{8}$")
_BASE_URL: Final = "https://viacep.com.br/ws/{cep}/json/"
_TIMEOUT: Final = 5  # segundos


class CepError(Exception):
    """Erro base para falhas na consulta de CEP."""


class CepInvalidoError(CepError):
    """CEP não está no formato esperado (8 dígitos numéricos)."""


class CepNaoEncontradoError(CepError):
    """CEP formatado corretamente mas não existe na base do ViaCEP."""


class CepServicoIndisponivelError(CepError):
    """Falha de rede, timeout ou erro no serviço externo."""


@dataclass(frozen=True)
class Endereco:
    cep: str
    logradouro: str
    bairro: str
    localidade: str
    uf: str
    ddd: str = ""


def _normalizar_cep(cep: str) -> str:
    """Remove caracteres não numéricos (ex.: hífen) e valida o formato."""
    if not isinstance(cep, str):
        raise CepInvalidoError(
            f"CEP deve ser uma string, recebido: {type(cep).__name__}"
        )

    cep_limpo = re.sub(r"\D", "", cep)

    if not _CEP_REGEX.match(cep_limpo):
        raise CepInvalidoError(
            f"CEP inválido: '{cep}'. Esperado 8 dígitos numéricos."
        )

    return cep_limpo


def _criar_sessao() -> requests.Session:
    """Cria uma sessão HTTP com política de retry para maior resiliência."""
    sessao = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=(500, 502, 503, 504),
        allowed_methods=("GET",),
    )
    adapter = HTTPAdapter(max_retries=retry)
    sessao.mount("https://", adapter)
    return sessao


_sessao_http = _criar_sessao()


@lru_cache(maxsize=256)
def consultar_cep(cep: str) -> Endereco:
    """
    Consulta um CEP na API pública ViaCEP e retorna um objeto Endereco.

    Args:
        cep: CEP no formato "00000000" ou "00000-000".

    Returns:
        Endereco com os dados retornados pela API.

    Raises:
        CepInvalidoError: se o CEP não tiver o formato esperado.
        CepNaoEncontradoError: se o CEP não existir na base do ViaCEP.
        CepServicoIndisponivelError: se houver falha de rede/timeout.
    """
    cep_normalizado = _normalizar_cep(cep)
    url = _BASE_URL.format(cep=cep_normalizado)

    try:
        resposta = _sessao_http.get(url, timeout=_TIMEOUT)
        resposta.raise_for_status()
    except requests.exceptions.RequestException as exc:
        logger.error("Falha ao consultar CEP %s: %s", cep_normalizado, exc)
        raise CepServicoIndisponivelError(
            f"Não foi possível consultar o CEP {cep_normalizado}: {exc}"
        ) from exc

    dados = resposta.json()

    if dados.get("erro"):
        raise CepNaoEncontradoError(f"CEP não encontrado: {cep_normalizado}")

    return Endereco(
        cep=dados.get("cep", cep_normalizado),
        logradouro=dados.get("logradouro", ""),
        bairro=dados.get("bairro", ""),
        localidade=dados.get("localidade", ""),
        uf=dados.get("uf", ""),
        ddd=dados.get("ddd", ""),
    )
```

## 12. Comparação
| Critério | Inicial | Refatorado |
|---|---:|---:|
| Funcionamento | Só cobre o caminho feliz | Cobre sucesso, formato inválido, não encontrado e falha de rede |
| Clareza | Baixa (retorno ambíguo) | Alta (dataclass tipada, exceções nomeadas) |
| Organização | Uma função monolítica | Responsabilidades separadas (normalização, sessão, exceções, consulta) |
| Legibilidade | Simples mas enganosa | Boa, com docstrings e nomes explícitos |
| Tratamento de erros | Inexistente | Explícito, com exceções específicas por tipo de falha |

## 13. Reflexão
- **Onde a IA mais ajudou?** Na estruturação rápida do esqueleto (validação, exceções, retry, cache) e em lembrar detalhes fáceis de esquecer, como `timeout`, `raise_for_status()` e a política de retry via `urllib3.util.retry.Retry`.
- **Onde a IA errou?** O código inicial "ingênuo" gerado propositalmente já expõe o tipo de erro mais comum: aceitar qualquer entrada sem validar e não tratar exceções de rede — é o tipo de falha que passa despercebida em revisão superficial se não houver testes cobrindo casos de borda.
- **O que precisei modificar?** Ajustar as exceções para refletir o domínio do problema (diferenciar "inválido" de "não encontrado" de "indisponível"), decidir o tamanho do cache (`maxsize=256`) e confirmar que `lru_cache` não guarda exceções em cache — apenas retornos bem-sucedidos, o que é o comportamento desejado aqui.
- **Consigo explicar o código?** Cada função tem uma responsabilidade única (normalizar, criar sessão, consultar), as exceções formam uma hierarquia clara (`CepError` como base) e o fluxo de dados é rastreável do input bruto até o `Endereco` final.

## 14. Take Away
Programar com IA não significa **delegar a responsabilidade de entender, validar e testar o código**. A IA acelera a escrita do esqueleto e lembra boas práticas (timeouts, retries, exceções específicas), mas cabe a quem programa decidir o que realmente importa para o domínio do problema, revisar criticamente as suposições do código gerado e garantir, com testes reais, que os casos normais, limites e de erro se comportam como esperado.
