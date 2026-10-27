// TESTE DE CARGA (obrigatório AV2): 500.000 registros
const { heapSort, dfs, gerarGrafo, gerarArray } = require('../algoritmos');

const TAMANHO = 500000;
const LIMITE_MS = 5000;   // orçamento de tempo por algoritmo (critério de aprovação)
const EXECUCOES = 5;      // várias execuções para reduzir ruído

const medir = (fn) => {
  const inicio = performance.now();
  const resultado = fn();
  return { ms: performance.now() - inicio, resultado };
};

const mediana = (valores) => {
  const ordenados = [...valores].sort((a, b) => a - b);
  return ordenados[Math.floor(ordenados.length / 2)];
};

describe('Teste de carga - 500.000 registros', () => {
  const cargaArray = gerarArray(TAMANHO);
  const cargaGrafo = gerarGrafo(TAMANHO);

  test('Heap Sort e DFS processam a carga dentro do limite de tempo', () => {
    // aquecimento (JIT) para não penalizar a primeira execução
    heapSort(gerarArray(10000));
    dfs(gerarGrafo(10000), 0);

    const temposHeap = [];
    const temposDfs = [];
    let ordenado;
    let visitados;

    for (let i = 0; i < EXECUCOES; i++) {
      const h = medir(() => heapSort([...cargaArray]));
      const d = medir(() => dfs(cargaGrafo, 0));
      temposHeap.push(h.ms);
      temposDfs.push(d.ms);
      ordenado = h.resultado;
      visitados = d.resultado;
    }

    const heapMs = mediana(temposHeap);
    const dfsMs = mediana(temposDfs);

    console.log(
      [
        '',
        '================================================',
        `RESULTADOS DO TESTE DE CARGA (${TAMANHO.toLocaleString('pt-BR')} itens, mediana de ${EXECUCOES} execuções)`,
        '================================================',
        `Heap Sort (ordenar array): ${heapMs.toFixed(2)} ms`,
        `DFS (percorrer grafo):     ${dfsMs.toFixed(2)} ms`,
        `Limite aceito:             ${LIMITE_MS} ms`,
        '================================================',
        `VENCEDOR DE PERFORMANCE: ${heapMs < dfsMs ? 'Heap Sort' : 'Depth-First Search'}`,
        `(${(Math.max(heapMs, dfsMs) / Math.min(heapMs, dfsMs)).toFixed(2)}x mais rápido)`,
        '================================================',
        '',
      ].join('\n')
    );

    // 1) Correção: o resultado sob carga continua certo
    expect(ordenado).toHaveLength(TAMANHO);
    for (let i = 1; i < ordenado.length; i++) {
      if (ordenado[i - 1] > ordenado[i]) {
        throw new Error(`Array fora de ordem na posição ${i}`);
      }
    }
    expect(visitados).toBe(TAMANHO);

    // 2) Desempenho: o teste REPROVA se estourar o orçamento de tempo
    expect(heapMs).toBeLessThan(LIMITE_MS);
    expect(dfsMs).toBeLessThan(LIMITE_MS);
  });
});
