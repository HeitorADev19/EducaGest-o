import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { styles, colors } from '../styles';

const tipos = { Alunos: ['alunos', 'nome', 'Nome do aluno'], Professores: ['professores', 'nome', 'Nome do professor'], Turmas: ['turmas', 'nome', 'Nome da turma'], Disciplinas: ['disciplinas', null, 'Nome da disciplina'], Salas: ['salas', null, 'Nome da sala'], Equipamentos: ['equipamentos', null, 'Nome do equipamento'], Recursos: ['recursos', null, 'Nome do recurso'] };

export function Cadastros({ dados, atualizar }) {
  const [secao, setSecao] = useState('Alunos');
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('5º Ano A');
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(null);
  const [disciplina, setDisciplina] = useState('');
  const [matricula, setMatricula] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const config = tipos[secao];
  const lista = dados[config[0]] || [];
  const salvar = () => {
    if (!nome.trim()) return Alert.alert('Campo obrigatório', 'Informe um nome para o cadastro.');
    if (secao === 'Alunos' && !turma.trim()) return Alert.alert('Campo obrigatório', 'Informe a turma do aluno.');
    if (editando) {
      atualizar(config[0], (itens) => itens.map((item) => typeof item === 'string' ? item === editando ? nome : item : item.id === editando ? { ...item, nome, ...(secao === 'Alunos' ? { turma, matricula: matricula || item.matricula } : {}), ...(secao === 'Professores' ? { disciplina: disciplina || item.disciplina } : {}) } : item));
      setEditando(null);
    } else if (['Disciplinas', 'Salas', 'Equipamentos', 'Recursos'].includes(secao)) {
      if (lista.includes(nome)) return Alert.alert('Cadastro existente', 'Esse item já está na lista.');
      atualizar(config[0], [...lista, nome]);
    } else {
      atualizar(config[0], [{ id: `cad-${Date.now()}`, nome, ...(secao === 'Alunos' ? { turma, matricula: matricula || `EG-${Date.now().toString().slice(-5)}` } : {}), ...(secao === 'Professores' ? { disciplina } : {}) }, ...lista]);
    }
    setNome(''); setMatricula(''); Alert.alert('Cadastro salvo', `${secao.slice(0, -1)} atualizado com sucesso.`);
  };
  const carregarEdicao = (item) => { setEditando(item.id); setNome(item.nome); if (item.turma) setTurma(item.turma); if (item.matricula) setMatricula(item.matricula); if (item.disciplina) setDisciplina(item.disciplina); };
  const excluir = (item) => Alert.alert('Excluir cadastro?', `Remover ${typeof item === 'string' ? item : item.nome}?`, [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: () => atualizar(config[0], (itens) => itens.filter((registro) => registro.id ? registro.id !== item.id : registro !== item)) }]);
  return (
    <View>
      <Text style={styles.heading}>Cadastros escolares</Text><Text style={styles.subheading}>Gerencie registros fictícios da unidade.</Text>
      <View style={styles.wrap}>{Object.keys(tipos).map((item) => <Text key={item} onPress={() => { setSecao(item); setEditando(null); setNome(''); }} style={[styles.chip, { color: item === secao ? colors.blue : colors.muted }]}>{item}</Text>)}</View>
      <View style={styles.card}><Text style={styles.sectionTitle}>{editando ? 'Editar registro' : `Novo cadastro · ${secao}`}</Text>
        <CampoTexto label={config[2]} value={nome} onChangeText={setNome} />
        {secao === 'Alunos' && <><CampoTexto label="Matrícula fictícia (opcional)" value={matricula} onChangeText={setMatricula} /><CampoTexto label="Turma" value={turma} onChangeText={setTurma} /></>}
        {secao === 'Professores' && <CampoTexto label="Disciplina principal" value={disciplina} onChangeText={setDisciplina} />}
        <View style={{ marginTop: 12 }}><Botao titulo={editando ? 'Salvar edição' : 'Adicionar cadastro'} onPress={salvar} /></View>
      </View>
      <CampoTexto label="Pesquisar" value={busca} onChangeText={setBusca} placeholder={`Buscar em ${secao.toLowerCase()}`} />
      <Text style={styles.sectionTitle}>{secao} · {lista.length}</Text>
      {lista.filter((item) => (typeof item === 'string' ? item : item.nome).toLowerCase().includes(busca.toLowerCase())).map((item) => <View key={typeof item === 'string' ? item : item.id} style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}><View style={{ flex: 1 }}><Text style={{ color: colors.ink, fontWeight: '700', fontSize: 13 }}>{typeof item === 'string' ? item : item.nome}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{typeof item === 'string' ? secao.slice(0, -1) : [item.matricula, item.turma, item.disciplina].filter(Boolean).join(' · ')}</Text></View><Text onPress={() => typeof item === 'string' ? (setEditando(item), setNome(item)) : carregarEdicao(item)} style={{ color: colors.blue, padding: 8, fontSize: 12 }}>Editar</Text><Text onPress={() => excluir(item)} style={{ color: colors.red, padding: 8, fontSize: 12 }}>Excluir</Text></View>)}
    </View>
  );
}