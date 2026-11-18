import { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { ItemPlanejamento } from '../components/ItemPlanejamento';
import { ItemSolicitacao } from '../components/ItemSolicitacao';
import { SecaoRecolhivel } from '../components/SecaoRecolhivel';
import { styles, colors } from '../styles';

export function Coordenacao({ dados, atualizar }) {
  const [planoParaRecusar, setPlanoParaRecusar] = useState(null);
  const revisarPlano = (plano, status) => atualizar('planejamentos', (lista) => lista.map((item) => item.id === plano.id ? { ...item, status } : item));
  const revisarReserva = (reserva, status) => atualizar('reservas', (lista) => lista.map((item) => item.id === reserva.id ? { ...item, status, justificativa: status === 'Aprovada' ? 'Reserva confirmada pela coordenação.' : 'Solicitação não aprovada.' } : item));
  const chamadas = dados.diario;
  const pendentes = dados.planejamentos.filter((p) => p.status === 'Pendente' || p.status === 'Enviado');
  const aulasRealizadas = chamadas.filter((aula) => aula.realizada).length;
  const turmas = [...dados.turmas].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }));
  return (
    <View>
      <Text style={styles.heading}>Coordenação pedagógica</Text><Text style={styles.subheading}>Acompanhe a rotina e revise itens enviados pela equipe.</Text>
      <View style={styles.wrap}><View style={[styles.card, { flexGrow: 1, minWidth: 140 }]}><Text style={{ color: colors.muted, fontSize: 11 }}>Planejamentos em análise</Text><Text style={{ color: colors.amber, fontSize: 24, fontWeight: '800', marginTop: 5 }}>{pendentes.length}</Text></View><View style={[styles.card, { flexGrow: 1, minWidth: 140 }]}><Text style={{ color: colors.muted, fontSize: 11 }}>Aulas realizadas</Text><Text style={{ color: colors.green, fontSize: 24, fontWeight: '800', marginTop: 5 }}>{aulasRealizadas}</Text></View><View style={[styles.card, { flexGrow: 1, minWidth: 140 }]}><Text style={{ color: colors.muted, fontSize: 11 }}>Aulas não realizadas</Text><Text style={{ color: colors.red, fontSize: 24, fontWeight: '800', marginTop: 5 }}>{chamadas.length - aulasRealizadas}</Text></View></View>
      <Text style={styles.sectionTitle}>Planejamentos para revisão</Text>
      {pendentes.length ? pendentes.map((item) => <View key={item.id}><ItemPlanejamento item={item} /><View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}><Botao titulo="Aprovar" compact onPress={() => revisarPlano(item, 'Aprovado')} /><Botao titulo="Recusar" variante="perigo" compact onPress={() => setPlanoParaRecusar(item)} /></View></View>) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum planejamento aguarda revisão.</Text></View>}
      <Text style={styles.sectionTitle}>Solicitações de recursos</Text>
      {dados.reservas.filter((r) => r.status === 'Pendente').length ? dados.reservas.filter((r) => r.status === 'Pendente').map((item) => <View key={item.id}><ItemSolicitacao item={item} /><View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}><Botao titulo="Aprovar" compact onPress={() => revisarReserva(item, 'Aprovada')} /><Botao titulo="Recusar" variante="perigo" compact onPress={() => revisarReserva(item, 'Recusada')} /></View></View>) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhuma solicitação aguarda aprovação.</Text></View>}
      <SecaoRecolhivel titulo="Frequência por turma" resumo={`${turmas.length} turmas`}>
        {turmas.map((turma) => { const registros = dados.frequencias.filter((ch) => ch.turma === turma.nome).flatMap((ch) => ch.registros); const pct = registros.length ? Math.round((registros.filter((r) => r.presente).length / registros.length) * 100) : null; return <View key={turma.id} style={styles.card}><Text style={{ color: colors.ink, fontWeight: '700' }}>{turma.nome} · {turma.turno || 'Manhã'}</Text><Text style={{ color: colors.blue, marginTop: 6 }}>{pct === null ? 'Sem chamadas registradas' : `${pct}% de frequência`}</Text></View>; })}
      </SecaoRecolhivel>
      <Text style={styles.sectionTitle}>Reposições pendentes</Text>{dados.eventos.filter((e) => (e.afetados || []).length).flatMap((e) => (e.afetados || []).map((id) => ({ evento: e, plano: dados.planejamentos.find((p) => p.id === id) }))).filter(({ plano }) => plano && !plano.rescheduled).map(({ evento, plano }) => <View key={`${evento.id}-${plano.id}`} style={styles.card}><Text style={{ color: colors.red, fontWeight: '700' }}>{plano.turma} · {plano.disciplina}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 5 }}>Suspensa em {evento.data} · aguardando data de reposição</Text></View>)}
      <Modal visible={!!planoParaRecusar} transparent animationType="fade" onRequestClose={() => setPlanoParaRecusar(null)}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0, 0, 0, 0.45)' }}>
          <View accessibilityRole="alert" style={styles.card}>
            <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '700' }}>Recusar planejamento?</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 8 }}>A coordenação registrará a decisão.</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <Botao titulo="Cancelar" variante="secundario" onPress={() => setPlanoParaRecusar(null)} />
              <Botao titulo="Recusar" variante="perigo" onPress={() => {
                revisarPlano(planoParaRecusar, 'Reprovado');
                setPlanoParaRecusar(null);
              }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}