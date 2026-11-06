import AsyncStorage from '@react-native-async-storage/async-storage';
import { criarDadosIniciais } from '../data/dadosIniciais';

const CHAVE_DADOS = '@educagestao/dados-v1';

export async function carregarDados() {
  const salvo = await AsyncStorage.getItem(CHAVE_DADOS);
  if (salvo) return JSON.parse(salvo);
  const iniciais = criarDadosIniciais();
  await AsyncStorage.setItem(CHAVE_DADOS, JSON.stringify(iniciais));
  return iniciais;
}

export async function salvarDados(dados) {
  await AsyncStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
}