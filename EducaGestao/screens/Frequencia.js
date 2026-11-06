import { useMemo, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { ItemAluno } from '../components/ItemAluno';
import { styles, colors } from '../styles';

export function Frequencia({ dados, usuario, atualizar }) {
  const [turma, setTurma] = useState(dados.turmas[0]?.nome || '');
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [presencas, setPresencas] = useState({});
  const [justificativas, setJustificativas] = useState({});
  const alunos = useMemo(() => dados.alunos.filter((aluno) => aluno.turma === turma), [dados.alunos, turma]);
  const salvar = () => {
    if (!turma || !data || !alunos.length) return Alert.alert('Chamada incompleta', 'Selecione uma turma com alunos e informe a data.');
    const registros = alunos.map((aluno) => ({ alunoId: aluno.id, nome: aluno.nome, matricula: aluno.matricula, presente: presencas[aluno.id] !== false, justificativa: justificativas[aluno.id] || '' }));
    atualizar('frequencias', (lista) => [{ id: `ch-${Date.now()}`, turma, data, professor: usuario.nome, registros }, ...lista.filter((chamada) => chamada.turma !== turma || chamada.data !== data)]);
    Alert.alert('Chamada registrada', `Frequência salva para ${turma} em ${data}.`);
  };
  const alternar = (id) => setPresencas((atual) => ({ ...atual, [id]: atual[id] === false }));
  const solicitarJustificativa = (aluno) => Alert.prompt ? Alert.prompt('Justificativa', `Ausência de ${aluno.nome}`, (texto) => setJustificativas((atual) => ({ ...atual, [aluno.id]: texto }))) : setJustificativas((atual) => ({ ...atual, [aluno.id]: atual[aluno.id] ? '' : 'Justificativa registrada' }));
  const chamadasTurma = dados.frequencias.filter((chamada) => chamada.turma === turma);
  return (
    <View>
      <Text style={styles.heading}>Frequência dos alunos</Text><Text style={styles.subheading}>Registre presença e consulte as chamadas salvas.</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nova chamada</Text>
        <View style={styles.wrap}>{dados.turmas.map((item) => <Text key={item.id} onPress={() => setTurma(item.nome)} style={[styles.chip, { color: turma === item.nome ? colors.blue : colors.muted }]}>{item.nome}</Text>)}</View>
        <CampoTexto label="Data (AAAA-MM-DD)" value={data} onChangeText={setData} />
        <FlatList data={alunos} keyExtractor={(item) => item.id} scrollEnabled={false} renderItem={({ item }) => <ItemAluno aluno={item} presente={presencas[item.id] !== false} justificativa={justificativas[item.id]} onAlternar={() => alternar(item.id)} onJustificativa={() => solicitarJustificativa(item)} />} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>Cadastre alunos para iniciar a chamada.</Text></View>} />
        <Botao titulo="Salvar chamada" onPress={salvar} />
      </View>
      <View style={styles.card}><Text style={styles.sectionTitle}>Frequência individual · {turma}</Text>{alunos.map((aluno) => {
        const registros = dados.frequencias.flatMap((chamada) => chamada.registros || []).filter((registro) => registro.alunoId === aluno.id);
        const percentual = registros.length ? Math.round((registros.filter((registro) => registro.presente).length / registros.length) * 100) : null;
        return <View key={aluno.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderColor: colors.line }}><Text style={{ color: colors.ink, fontSize: 12 }}>{aluno.nome}</Text><Text style={{ color: colors.blue, fontSize: 12, fontWeight: '700' }}>{percentual === null ? 'Sem chamadas' : `${percentual}%`}</Text></View>;
      })}<Text style={{ color: colors.muted, fontSize: 11, marginTop: 7 }}>Chamadas registradas para a turma: {chamadasTurma.length}</Text></View>
    </View>
  );
}