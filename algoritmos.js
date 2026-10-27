// Implementação dos algoritmos testados

// Heap Sort (ordena o array in-place e o retorna)
function heapSort(arr) {
  const n = arr.length;

  const heapify = (a, len, i) => {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < len && a[l] > a[largest]) largest = l;
    if (r < len && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(a, len, largest);
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

// DFS iterativo (evita estouro de pilha em grafos profundos).
// Retorna a quantidade de nós visitados.
function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = graph[node] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) stack.push(neighbors[i]);
    }
  }
  return visited.size;
}

// Gera um grafo "profundo": cada nó i aponta para i+1 e i+2
function gerarGrafo(tamanho) {
  const grafo = {};
  for (let i = 0; i < tamanho; i++) {
    grafo[i] = [];
    if (i + 1 < tamanho) grafo[i].push(i + 1);
    if (i + 2 < tamanho) grafo[i].push(i + 2);
  }
  return grafo;
}

// Gerador pseudoaleatório com semente (mulberry32): dados iguais em toda execução
function gerarArray(tamanho, semente = 42) {
  let s = semente >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: tamanho }, () => Math.floor(rand() * 100000));
}

module.exports = { heapSort, dfs, gerarGrafo, gerarArray };
