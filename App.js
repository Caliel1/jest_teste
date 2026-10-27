import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prefixo usado para separar as chaves deste app dentro do AsyncStorage
const CACHE_PREFIX = "@cep_cache:";

export default function App() {
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [origem, setOrigem] = useState(null); // "api" ou "cache"

  async function buscarEndereco() {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      Alert.alert("CEP inválido", "Digite um CEP com 8 dígitos, ex: 01001000");
      return;
    }

    setCarregando(true);
    setEndereco(null);
    setOrigem(null);

    const chaveCache = CACHE_PREFIX + cepLimpo;

    try {
      // 1) Tenta buscar primeiro no cache (AsyncStorage)
      const cacheado = await AsyncStorage.getItem(chaveCache);
      if (cacheado) {
        setEndereco(JSON.parse(cacheado));
        setOrigem("cache");
        setCarregando(false);
        return;
      }

      // 2) Se não tem no cache, busca na API usando Axios
      const resposta = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (resposta.data.erro) {
        Alert.alert("Não encontrado", "CEP não existe.");
        setCarregando(false);
        return;
      }

      setEndereco(resposta.data);
      setOrigem("api");

      // 3) Salva o resultado no cache para as próximas consultas
      await AsyncStorage.setItem(chaveCache, JSON.stringify(resposta.data));
    } catch (erro) {
      Alert.alert(
        "Erro",
        "Não foi possível buscar o CEP. Verifique sua conexão."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function limparCache() {
    const chaves = await AsyncStorage.getAllKeys();
    const chavesDoApp = chaves.filter((k) => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(chavesDoApp);
    Alert.alert("Cache limpo", `${chavesDoApp.length} item(ns) removido(s).`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Consulta de CEP (Axios + AsyncStorage)</Text>

      <TextInput
        testID="cep-input"
        style={styles.input}
        placeholder="Digite o CEP (ex: 01001000)"
        keyboardType="numeric"
        value={cep}
        onChangeText={setCep}
        maxLength={9}
      />

      <TouchableOpacity testID="buscar-button" style={styles.botao} onPress={buscarEndereco}>
        <Text style={styles.botaoTexto}>Buscar</Text>
      </TouchableOpacity>

      <TouchableOpacity testID="limpar-button" style={styles.botaoSecundario} onPress={limparCache}>
        <Text style={styles.botaoSecundarioTexto}>Limpar cache</Text>
      </TouchableOpacity>

      {carregando && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {endereco && !carregando && (
        <View testID="resultado-card" style={styles.card}>
          <Text testID="origem-text" style={styles.origem}>
            Fonte: {origem === "cache" ? "📦 Cache (AsyncStorage)" : "🌐 API (Axios)"}
          </Text>
          <Text style={styles.linha}>CEP: {endereco.cep}</Text>
          <Text style={styles.linha}>Logradouro: {endereco.logradouro}</Text>
          <Text style={styles.linha}>Bairro: {endereco.bairro}</Text>
          <Text style={styles.linha}>Cidade: {endereco.localidade}</Text>
          <Text style={styles.linha}>Estado: {endereco.uf}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "flex-start",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoSecundario: {
    padding: 10,
    alignItems: "center",
  },
  botaoSecundarioTexto: {
    color: "#dc2626",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  origem: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 14,
  },
  linha: {
    fontSize: 15,
    marginBottom: 4,
  },
});
