# Trabalho – Acesso API e Cache

App em React Native (Expo) que consulta a API pública do [ViaCEP](https://viacep.com.br) usando
**Axios** e armazena o resultado em cache com **AsyncStorage**.

## Como funciona

1. O usuário digita um CEP e toca em "Buscar".
2. O app primeiro verifica se aquele CEP já está salvo no `AsyncStorage`.
   - Se estiver, mostra o endereço na hora, sem chamar a API (indicado como "📦 Cache").
3. Se não estiver em cache, faz a requisição com `axios.get` na API do ViaCEP
   (indicado como "🌐 API").
4. O resultado da API é salvo no `AsyncStorage` para as próximas consultas.
5. Botão "Limpar cache" remove todos os CEPs salvos, para testar a busca na API novamente.

## Como executar o projeto

### 1. Instalar as dependências

Após baixar ou clonar o projeto, abra o terminal na pasta do projeto e execute:

```bash
npm install
```

### 2. Iniciar o projeto

Para iniciar normalmente:

```bash
npx expo start
```

### 3. Executar utilizando Tunnel

Caso seja necessário executar o projeto utilizando uma conexão externa:

```bash
npx expo start --tunnel
```

Depois de iniciar o Expo, será exibido um **QR Code** no terminal.

O projeto pode ser executado das seguintes formas:

- Escaneando o QR Code utilizando o aplicativo **Expo Go** no Android ou iOS;
- Executando o projeto em um emulador;
- Utilizando as opções disponibilizadas pelo Expo.


## Estrutura

- `App.js` – toda a lógica (interface + Axios + AsyncStorage)
- `package.json` – dependências (`axios`, `@react-native-async-storage/async-storage`)

## Integrantes

- Caliel Lourinho Souza (04177481)
- Guilherme Mergulhão Alfaia do Carmo (04197979)
- Kaleb Victor Rocha Brito (04187577)
---

## Testes com Jest (Trabalho 02 – Ferramenta de Teste)

Ferramenta: **Jest** (com `jest-expo` e React Native Testing Library).

| Arquivo | Tipo | O que testa |
|---|---|---|
| `__tests__/App.test.js` | Componente / integração | O app da AV1: CEP inválido, busca na API (Axios), cache (AsyncStorage), CEP inexistente, falha de rede, limpar cache. A API é simulada (mock), sem internet. |
| `__tests__/algoritmos.test.js` | Unitário / integração | Heap Sort e DFS com poucos dados |
| `__tests__/carga.test.js` | **Carga** | 500.000 registros, Heap Sort vs DFS, mediana de 5 execuções, limite de 5000 ms |

```bash
npm install --legacy-peer-deps
npm test             # todos
npm run test:app     # só o app
npm run test:unit    # só os algoritmos
npm run test:carga   # só o teste de carga
```

Observações:
- Para facilitar a seleção dos elementos nos testes, foram adicionados `testID` ao `App.js` (campo, botões, cartão de resultado e texto de origem). Nenhuma lógica do app foi alterada.
- O vencedor do teste de carga pode mudar de uma execução para outra, dependendo da máquina.
- O Jest roda em Node.js: não mede renderização nem hardware real do celular.
