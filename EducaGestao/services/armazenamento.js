import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { criarDadosIniciais } from '../data/dadosIniciais';

const NOME_BANCO = 'educagestao.db';
const CHAVE_LEGADA = '@educagestao/dados-v1';
let bancoPromise;
let filaGravacao = Promise.resolve();

function obterBanco() {
  if (!bancoPromise) {
    bancoPromise = (async () => {
      const banco = await SQLite.openDatabaseAsync(NOME_BANCO);
      await banco.execAsync(`
        CREATE TABLE IF NOT EXISTS estado_aplicacao (
          id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
          dados_json TEXT NOT NULL,
          atualizado_em TEXT NOT NULL
        );
      `);
      return banco;
    })().catch((erro) => {
      bancoPromise = null;
      throw erro;
    });
  }
  return bancoPromise;
}

export async function carregarDados() {
  const banco = await obterBanco();
  const salvo = await banco.getFirstAsync(
    'SELECT dados_json FROM estado_aplicacao WHERE id = 1'
  );

  if (salvo) return JSON.parse(salvo.dados_json);

  const legado = await AsyncStorage.getItem(CHAVE_LEGADA);
  const dados = legado === null ? criarDadosIniciais() : JSON.parse(legado);
  await banco.runAsync(
    `INSERT INTO estado_aplicacao (id, dados_json, atualizado_em)
     VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       dados_json = excluded.dados_json,
       atualizado_em = excluded.atualizado_em`,
    JSON.stringify(dados),
    new Date().toISOString()
  );

  if (legado !== null) await AsyncStorage.removeItem(CHAVE_LEGADA);
  return dados;
}

async function persistirDados(dados) {
  const banco = await obterBanco();
  await banco.runAsync(
    `INSERT INTO estado_aplicacao (id, dados_json, atualizado_em)
     VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       dados_json = excluded.dados_json,
       atualizado_em = excluded.atualizado_em`,
    JSON.stringify(dados),
    new Date().toISOString()
  );
}

export function salvarDados(dados) {
  const gravacao = filaGravacao.then(
    () => persistirDados(dados),
    () => persistirDados(dados)
  );
  filaGravacao = gravacao;
  return gravacao;
}
