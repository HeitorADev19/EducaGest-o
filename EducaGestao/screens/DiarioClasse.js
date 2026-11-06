import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { styles, colors } from '../styles';

export function DiarioClasse({ dados, usuario, atualizar }) {
  const [planoId, setPlanoId] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const planos = dados.planejamentos.filter((p) => usuario.perfil !== 'Professor' || p.professor === usuario.nome);
  const salvar = (realizada) => {
    if (!planoId || !conteudo.trim()) return Alert.alert('Registro incompleto', 'Selecione um planejamento e informe o conteúdo ministrado.');
    const plano = planos.find((p) => p.id === planoId);
    atualizar('diario', (lista) => [{ id: `di-${Date.now()}`, planejamentoId: planoId, professor: usuario.nome, turma: plano.turma, disciplina: plano.disciplina, data: plano.data, conteudo, observacoes, realizada }, ...lista]);
    setConteudo(''); setObservacoes(''); Alert.alert('Diário atualizado', realizada ? 'Aula registrada como realizada.' : 'Registro salvo como aula não realizada.');
  };
  return (
    <View>
      <Text style={styles.heading}>Diário de classe</Text><Text style={styles.subheading}>O planejamento é a intenção; o diário registra o que aconteceu.</Text>
      <View style={styles.card}><Text style={styles.sectionTitle}>Registrar aula</Text>
        {planos.map((plano) => <Text key={plano.id} onPress={() => setPlanoId(plano.id)} style={[styles.chip, { color: planoId === plano.id ? colors.blue : colors.ink }]}>{plano.data} · {plano.turma} · {plano.disciplina}</Text>)}
        {!planos.length && <Text style={styles.emptyText}>Ainda não há planejamentos disponíveis.</Text>}
        <CampoTexto label="Conteúdo ministrado" value={conteudo} onChangeText={setConteudo} multiline />
        <CampoTexto label="Observações" value={observacoes} onChangeText={setObservacoes} multiline />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}><Botao titulo="Aula realizada" onPress={() => salvar(true)} /><Botao titulo="Não realizada" variante="secundario" onPress={() => salvar(false)} /></View>
      </View>
      <Text style={styles.sectionTitle}>Aulas anteriores</Text>
      {dados.diario.length ? dados.diario.map((registro) => <View key={registro.id} style={styles.card}><Text style={{ color: registro.realizada ? colors.green : colors.red, fontSize: 11, fontWeight: '800' }}>{registro.realizada ? 'AULA REALIZADA' : 'AULA NÃO REALIZADA'}</Text><Text style={{ color: colors.ink, fontWeight: '700', marginTop: 6 }}>{registro.disciplina} · {registro.turma}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{registro.data} · {registro.professor}</Text><Text style={{ color: colors.ink, fontSize: 12, marginTop: 9 }}>{registro.conteudo}</Text></View>) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum registro no diário.</Text></View>}
    </View>
  );
}