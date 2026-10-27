// TESTES DO APP DA AV1 (consulta de CEP com Axios + AsyncStorage)
// A API (axios) é simulada com mock, então o teste não depende de internet.
import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const CEP_RESPOSTA = {
  cep: '01001-000',
  logradouro: 'Praça da Sé',
  bairro: 'Sé',
  localidade: 'São Paulo',
  uf: 'SP',
};

const buscar = async (cep) => {
  await fireEvent.changeText(screen.getByTestId('cep-input'), cep);
  await fireEvent.press(screen.getByTestId('buscar-button'));
};

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

describe('App AV1 - consulta de CEP', () => {
  test('CEP inválido mostra alerta e não chama a API', async () => {
    await render(<App />);
    await buscar('123');

    expect(Alert.alert).toHaveBeenCalledWith('CEP inválido', expect.any(String));
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('primeira busca vem da API (Axios) e mostra o endereço', async () => {
    axios.get.mockResolvedValue({ data: CEP_RESPOSTA });
    await render(<App />);
    await buscar('01001000');

    await waitFor(() => expect(screen.getByTestId('resultado-card')).toBeTruthy());
    expect(axios.get).toHaveBeenCalledWith('https://viacep.com.br/ws/01001000/json/');
    expect(screen.getByTestId('origem-text')).toHaveTextContent(/API \(Axios\)/);
    expect(screen.getByText('Cidade: São Paulo')).toBeTruthy();
  });

  test('segunda busca do mesmo CEP vem do cache (AsyncStorage)', async () => {
    axios.get.mockResolvedValue({ data: CEP_RESPOSTA });
    await render(<App />);

    await buscar('01001000');
    await waitFor(() => screen.getByText(/API \(Axios\)/));
    await buscar('01001000');
    await waitFor(() => screen.getByText(/Cache \(AsyncStorage\)/));

    expect(axios.get).toHaveBeenCalledTimes(1); // só a primeira foi para a API
  });

  test('CEP inexistente mostra alerta "Não encontrado"', async () => {
    axios.get.mockResolvedValue({ data: { erro: true } });
    await render(<App />);
    await buscar('99999999');

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Não encontrado', 'CEP não existe.')
    );
    expect(screen.queryByTestId('resultado-card')).toBeNull();
  });

  test('falha de rede mostra alerta de erro', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await render(<App />);
    await buscar('01001000');

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Erro', expect.stringContaining('conexão'))
    );
  });

  test('"Limpar cache" remove os CEPs salvos', async () => {
    axios.get.mockResolvedValue({ data: CEP_RESPOSTA });
    await render(<App />);
    await buscar('01001000');
    await waitFor(() => screen.getByTestId('resultado-card'));
    expect(await AsyncStorage.getItem('@cep_cache:01001000')).not.toBeNull();

    await fireEvent.press(screen.getByTestId('limpar-button'));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Cache limpo', '1 item(ns) removido(s).')
    );
    expect(await AsyncStorage.getItem('@cep_cache:01001000')).toBeNull();
  });
});
