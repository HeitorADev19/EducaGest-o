import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { SeletorCompacto } from '../components/SeletorCompacto';
import { SeletorTurma } from '../components/SeletorTurma';
import { styles, colors } from '../styles';

const tipos = { Alunos: ['alunos', 'nome', 'Nome do aluno'], Professores: ['professores', 'nome', 'Nome do professor'], Turmas: ['turmas', 'nome', 'Nome da turma'], Disciplinas: ['disciplinas', null, 'Nome da disciplina'], Salas: ['salas', null, 'Nome da sala'], Equipamentos: ['equipamentos', null, 'Nome do equipamento'], Recursos: ['recursos', null, 'Nome do recurso'] };
const opcoesTurno = ['Manhã', 'Tarde'].map((item) => ({ label: item, value: item }));
const horariosPorTurno = { Manhã: ['08:00', '09:00', '10:00', '11:00'], Tarde: ['13:00', '14:00', '15:00', '16:00'] };

export function Cadastros({ dados, atualizar }) {
  const [secao, setSecao] = useState('Alunos');
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('5º Ano A');
  const [turno, setTurno] = useState('Manhã');
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(null);
  const [disciplina, setDisciplina] = useState('');
  const [matricula, setMatricula] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [mostrarTodasTurmas, setMostrarTodasTurmas] = useState(false);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(null);
  const config = tipos[secao];
  const lista = dados[config[0]] || [];
  const filtrados = lista.filter((item) => (typeof item === 'string' ? item : item.nome).toLowerCase().includes(busca.toLowerCase()));
  const resultados = secao === 'Turmas' ? [...filtrados].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true })) : filtrados;
  const itensVisiveis = secao === 'Turmas' && !busca.trim() && !mostrarTodasTurmas ? resultados.slice(0, 5) : resultados;
  const salvar = () => {
    if (!nome.trim()) return Alert.alert('Campo obrigatório', 'Informe um nome para o cadastro.');
    if (secao === 'Alunos' && !turma.trim()) return Alert.alert('Campo obrigatório', 'Informe a turma do aluno.');
    if (editando) {
      const turmaAnterior = secao === 'Turmas' ? lista.find((item) => item.id === editando) : null;
      atualizar(config[0], (itens) => itens.map((item) => typeof item === 'string' ? item === editando ? nome : item : item.id === editando ? { ...item, nome, ...(secao === 'Alunos' ? { turma, matricula: matricula || item.matricula } : {}), ...(secao === 'Professores' ? { disciplina: disciplina || item.disciplina } : {}), ...(secao === 'Turmas' ? { turno } : {}) } : item));
      if (turmaAnterior && (turmaAnterior.turno || 'Manhã') !== turno) {
        atualizar('horariosAula', (horarios) => horarios.map((horario) => {
          if (horario.turma !== turmaAnterior.nome) return horario;
          const indicePeriodo = [...horariosPorTurno.Manhã, ...horariosPorTurno.Tarde].indexOf(horario.horario);
          return {
            ...horario,
            turma: nome,
            turno,
            horario: indicePeriodo < 0 ? horario.horario : horariosPorTurno[turno][indicePeriodo % horariosPorTurno[turno].length],
          };
        }));
      }
      setEditando(null);
    } else if (['Disciplinas', 'Salas', 'Equipamentos', 'Recursos'].includes(secao)) {
      if (lista.includes(nome)) return Alert.alert('Cadastro existente', 'Esse item já está na lista.');
      atualizar(config[0], [...lista, nome]);
    } else {
      atualizar(config[0], [{ id: `cad-${Date.now()}`, nome, ...(secao === 'Alunos' ? { turma, matricula: matricula || `EG-${Date.now().toString().slice(-5)}` } : {}), ...(secao === 'Professores' ? { disciplina } : {}), ...(secao === 'Turmas' ? { turno } : {}) }, ...lista]);
    }
    setNome(''); setMatricula(''); setDisciplina(''); setConfirmacaoExclusao(null); Alert.alert('Cadastro salvo', `${secao.slice(0, -1)} atualizado com sucesso.`);
  };
  const carregarEdicao = (item) => { setEditando(item.id); setNome(item.nome); if (item.turma) setTurma(item.turma); if (item.turno) setTurno(item.turno); if (item.matricula) setMatricula(item.matricula); if (item.disciplina) setDisciplina(item.disciplina); };
  const confirmarExclusao = () => {
    const item = confirmacaoExclusao;
    if (!item) return;
    atualizar(config[0], (itens) => itens.filter((registro) => {
      if (typeof item === 'string') return typeof registro !== 'string' || registro !== item;
      if (typeof registro !== 'object' || registro === null) return true;
      if (item.id && registro.id) return registro.id !== item.id;
      return registro.nome !== item.nome;
    }));
    if (editando === (typeof item === 'string' ? item : item.id)) {
      setEditando(null);
      setNome('');
      setMatricula('');
      setDisciplina('');
    }
    setConfirmacaoExclusao(null);
  };
  return (
    <View>
      <Text style={styles.heading}>Cadastros escolares</Text><Text style={styles.subheading}>Gerencie registros fictícios da unidade.</Text>
      <View style={styles.wrap}>{Object.keys(tipos).map((item) => <Text key={item} onPress={() => { setSecao(item); setEditando(null); setNome(''); setConfirmacaoExclusao(null); setMostrarTodasTurmas(false); }} style={[styles.chip, { color: item === secao ? colors.blue : colors.muted }]}>{item}</Text>)}</View>
      <View style={styles.card}><Text style={styles.sectionTitle}>{editando ? 'Editar registro' : `Novo cadastro · ${secao}`}</Text>
        <CampoTexto label={config[2]} value={nome} onChangeText={setNome} />
        {secao === 'Alunos' && <><CampoTexto label="Matrícula fictícia (opcional)" value={matricula} onChangeText={setMatricula} /><SeletorTurma turmas={dados.turmas} value={turma} onChange={setTurma} /></>}
        {secao === 'Turmas' && <SeletorCompacto label="Turno" value={turno} opcoes={opcoesTurno} onChange={setTurno} />}
        {secao === 'Professores' && <CampoTexto label="Disciplina principal" value={disciplina} onChangeText={setDisciplina} />}
        <View style={{ marginTop: 12 }}><Botao titulo={editando ? 'Salvar edição' : 'Adicionar cadastro'} onPress={salvar} /></View>
      </View>
      <CampoTexto label="Pesquisar" value={busca} onChangeText={setBusca} placeholder={`Buscar em ${secao.toLowerCase()}`} />
      <Text style={styles.sectionTitle}>{secao} · {lista.length}</Text>
      {itensVisiveis.map((item) => {
        const chave = typeof item === 'string' ? item : item.id;
        const confirmado = typeof confirmacaoExclusao === 'string'
          ? confirmacaoExclusao === item
          : confirmacaoExclusao?.id === chave;
        return (
          <View key={chave} style={[styles.card, confirmado ? { backgroundColor: colors.redLight } : null]}>
            {confirmado ? (
              <View>
                <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 13 }}>
                  Confirmar exclusão de {typeof item === 'string' ? item : item.nome}?
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                  <TouchableOpacity accessibilityRole="button" onPress={() => setConfirmacaoExclusao(null)} style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                    <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 12 }}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity accessibilityRole="button" onPress={confirmarExclusao} style={{ backgroundColor: colors.red, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 13 }}>{typeof item === 'string' ? item : item.nome}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{typeof item === 'string' ? secao.slice(0, -1) : [item.matricula, item.turma, item.disciplina, item.turno && `Turno ${item.turno}`].filter(Boolean).join(' · ')}</Text>
                </View>
                <TouchableOpacity accessibilityRole="button" onPress={() => typeof item === 'string' ? (setEditando(item), setNome(item)) : carregarEdicao(item)} style={{ padding: 8 }}>
                  <Text style={{ color: colors.blue, fontSize: 12 }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity accessibilityRole="button" onPress={() => setConfirmacaoExclusao(item)} style={{ padding: 8 }}>
                  <Text style={{ color: colors.red, fontSize: 12 }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
      {secao === 'Turmas' && resultados.length > 5 && !busca.trim() && (
        <TouchableOpacity accessibilityRole="button" onPress={() => setMostrarTodasTurmas((mostrar) => !mostrar)} style={{ alignItems: 'center', padding: 12 }}>
          <Text style={{ color: colors.blue, fontWeight: '700', fontSize: 12 }}>{mostrarTodasTurmas ? 'Mostrar menos turmas' : `Mostrar todas as ${resultados.length} turmas`}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}