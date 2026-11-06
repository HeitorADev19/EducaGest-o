import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { ItemSolicitacao } from '../components/ItemSolicitacao';
import { styles, colors } from '../styles';

export function Reservas({ dados, usuario, atualizar }) {
  const [recurso, setRecurso] = useState(dados.recursos[0] || '');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [turma, setTurma] = useState(dados.turmas[0]?.nome || '');
  const [finalidade, setFinalidade] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const coordenador = usuario.perfil !== 'Professor';
  const solicitar = () => {
    if (!recurso || !data || !horario || !turma || !finalidade.trim()) return Alert.alert('Solicitação incompleta', 'Preencha recurso, data, horário, turma e finalidade.');
    const conflito = dados.reservas.some((r) => r.recurso === recurso && r.data === data && r.horario === horario && (r.status === 'Pendente' || r.status === 'Aprovada'));
    if (conflito) return Alert.alert('Horário indisponível', 'Já existe uma solicitação ou reserva para este recurso, data e horário.');
    atualizar('reservas', (lista) => [{ id: `res-${Date.now()}`, recurso, data, horario, turma, finalidade, solicitante: usuario.nome, status: 'Pendente', justificativa: '' }, ...lista]);
    setFinalidade(''); Alert.alert('Solicitação enviada', 'A coordenação poderá analisar o pedido.');
  };
  const decidir = (item, status) => atualizar('reservas', (lista) => lista.map((r) => r.id === item.id ? { ...r, status, justificativa: justificativa || (status === 'Aprovada' ? 'Reserva confirmada.' : 'Conflito de agenda.') } : r));
  return (
    <View>
      <Text style={styles.heading}>Salas e recursos</Text><Text style={styles.subheading}>Solicite materiais e acompanhe a disponibilidade da escola.</Text>
      {!coordenador && <View style={styles.card}><Text style={styles.sectionTitle}>Nova solicitação</Text>
        <View style={styles.wrap}>{dados.recursos.map((item) => <Text key={item} onPress={() => setRecurso(item)} style={[styles.chip, { color: recurso === item ? colors.blue : colors.muted }]}>{item}</Text>)}</View>
        <CampoTexto label="Data (AAAA-MM-DD)" value={data} onChangeText={setData} placeholder="2026-11-12" />
        <CampoTexto label="Horário" value={horario} onChangeText={setHorario} placeholder="09:00" />
        <CampoTexto label="Turma" value={turma} onChangeText={setTurma} />
        <CampoTexto label="Finalidade" value={finalidade} onChangeText={setFinalidade} multiline />
        <View style={{ marginTop: 12 }}><Botao titulo="Solicitar recurso" onPress={solicitar} /></View>
      </View>}
      {coordenador && <View style={styles.card}><CampoTexto label="Justificativa (opcional)" value={justificativa} onChangeText={setJustificativa} placeholder="Informe um motivo para a decisão" /></View>}
      <Text style={styles.sectionTitle}>Solicitações e reservas</Text>
      {dados.reservas.length ? dados.reservas.map((item) => <View key={item.id}><ItemSolicitacao item={item} />{coordenador && item.status === 'Pendente' && <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}><Botao titulo="Aprovar" compact onPress={() => decidir(item, 'Aprovada')} /><Botao titulo="Recusar" variante="perigo" compact onPress={() => decidir(item, 'Recusada')} /></View>}</View>) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhuma solicitação registrada.</Text></View>}
    </View>
  );
}