// TESTES UNITÁRIOS e DE INTEGRAÇÃO (rápidos, com poucos dados)
const { heapSort, dfs, gerarGrafo, gerarArray } = require('../algoritmos');

describe('Testes unitários', () => {
  test('heapSort ordena um array pequeno', () => {
    expect(heapSort([5, 3, 8, 1, 9, 2])).toEqual([1, 2, 3, 5, 8, 9]);
  });

  test('heapSort lida com array vazio e com um elemento', () => {
    expect(heapSort([])).toEqual([]);
    expect(heapSort([7])).toEqual([7]);
  });

  test('heapSort mantém valores repetidos', () => {
    expect(heapSort([2, 2, 1, 1])).toEqual([1, 1, 2, 2]);
  });

  test('dfs visita todos os nós alcançáveis', () => {
    const grafo = { 0: [1, 2], 1: [3], 2: [3], 3: [], 4: [] };
    expect(dfs(grafo, 0)).toBe(4); // o nó 4 é inalcançável
  });

  test('dfs não entra em loop em grafos com ciclo', () => {
    const grafo = { 0: [1], 1: [2], 2: [0] };
    expect(dfs(grafo, 0)).toBe(3);
  });
});

describe('Teste de integração', () => {
  test('gerarArray + heapSort resultam em array ordenado', () => {
    const resultado = heapSort(gerarArray(1000));
    for (let i = 1; i < resultado.length; i++) {
      expect(resultado[i - 1]).toBeLessThanOrEqual(resultado[i]);
    }
  });

  test('gerarGrafo + dfs alcançam todos os nós', () => {
    expect(dfs(gerarGrafo(1000), 0)).toBe(1000);
  });
});
