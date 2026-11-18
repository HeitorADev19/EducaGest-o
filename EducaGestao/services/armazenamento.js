import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { criarDadosIniciais, VERSAO_DADOS_INICIAIS } from '../data/dadosIniciais';

const NOME_BANCO = 'educagestao.db';
const CHAVE_LEGADA = '@educagestao/dados-v1';
let bancoPromise;
let filaGravacao = Promise.resolve();

function migrarDadosIniciais(dados) {
  if ((dados.versaoDadosIniciais || 0) >= VERSAO_DADOS_INICIAIS) return dados;

  const iniciais = criarDadosIniciais();
  const professores = dados.professores || [];
  const alunos = [...(dados.alunos || [])];
  const turmas = (dados.turmas || []).map((turma) => {
    const turmaInicial = iniciais.turmas.find((item) => item.id === turma.id);
    return { ...turma, turno: turma.turno || turmaInicial?.turno || 'Manhã' };
  });
  const turmasComSementes = [...turmas, ...iniciais.turmas.filter((turma) => !turmas.some((item) => item.id === turma.id))];
  for (const turma of iniciais.turmas) {
    let quantidade = alunos.filter((aluno) => aluno.turma === turma.nome).length;
    const sementesDisponiveis = iniciais.alunos.filter((aluno) => (
      aluno.turma === turma.nome && !alunos.some((existente) => existente.id === aluno.id)
    ));
    for (const aluno of sementesDisponiveis) {
      if (quantidade >= 6) break;
      alunos.push(aluno);
      quantidade += 1;
    }
    while (quantidade < 6) {
      const numero = quantidade + 1;
      let id = `al-migracao-${turma.id}-${numero}`;
      while (alunos.some((aluno) => aluno.id === id)) id = `${id}-novo`;
      alunos.push({
        id,
        nome: `Aluno ${numero} · ${turma.nome}`,
        matricula: `EG-MIG-${turma.id}-${numero}`,
        turma: turma.nome,
      });
      quantidade += 1;
    }
  }
  const disciplinas = dados.disciplinas || [];
  const planejamentos = dados.planejamentos || [];
  const idsHorariosDemonstracaoAntigos = new Set(Array.from({ length: 15 }, (_, indice) => `ha${indice + 1}`));
  const idsHorariosDemonstracao = new Set(iniciais.horariosAula.map((horario) => horario.id));
  const horariosAula = (dados.horariosAula || []).filter((horario) => (
    !idsHorariosDemonstracaoAntigos.has(horario.id) && !idsHorariosDemonstracao.has(horario.id)
  )).map((horario) => ({
    ...horario,
    turno: horario.turno || turmasComSementes.find((turma) => turma.nome === horario.turma)?.turno || 'Manhã',
  }));

  return {
    ...dados,
    alunos,
    professores: [...professores, ...iniciais.professores.filter((professor) => !professores.some((item) => item.id === professor.id))],
    turmas: turmasComSementes,
    disciplinas: [...disciplinas, ...iniciais.disciplinas.filter((disciplina) => !disciplinas.includes(disciplina))],
    planejamentos: [...planejamentos, ...iniciais.planejamentos.filter((plano) => !planejamentos.some((item) => item.id === plano.id))],
    horariosAula: [...horariosAula, ...iniciais.horariosAula],
    versaoDadosIniciais: VERSAO_DADOS_INICIAIS,
  };
}

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

  if (salvo) {
    const dados = JSON.parse(salvo.dados_json);
    const atualizados = migrarDadosIniciais(dados);
    if (atualizados !== dados) await persistirDados(atualizados);
    return atualizados;
  }

  const legado = await AsyncStorage.getItem(CHAVE_LEGADA);
  const dados = migrarDadosIniciais(legado === null ? criarDadosIniciais() : JSON.parse(legado));
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
