import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { styles, colors } from '../styles';

const tipos = ['Feriado', 'Reunião', 'Evento', 'Paralisação', 'Suspensão', 'Reposição'];

export function Calendario({ dados, usuario, atualizar }) {
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('Evento');
  const [descricao, setDescricao] = useState('');
  const [reposicao, setReposicao] = useState({});
  const gestor = usuario.perfil === 'Gestor';
  const cadastrar = () => {
    if (!titulo.trim() || !data.trim()) return Alert.alert('Dados obrigatórios', 'Informe o nome do evento e a data.');
    const afetados = tipo === 'Paralisação' || tipo === 'Suspensão' ? dados.planejamentos.filter((p) => p.data === data).map((p) => p.id) : [];
    atualizar('eventos', (lista) => [{ id: `ev-${Date.now()}`, titulo, data, tipo, descricao, afetados }, ...lista]);
    setTitulo(''); setData(''); setDescricao('');
    Alert.alert('Evento registrado', afetados.length ? `${afetados.length} planejamento(s) afetado(s). Cadastre a reposição abaixo.` : 'O evento foi adicionado ao calendário.');
  };
  const salvarReposicao = (evento, plano) => {
    const novaData = reposicao[plano.id];
    if (!novaData) return Alert.alert('Data necessária', 'Informe uma data para a reposição.');
    atualizar('planejamentos', (lista) => lista.map((p) => p.id === plano.id ? { ...p, rescheduled: novaData } : p));
    atualizar('eventos', (lista) => [{ id: `rep-${Date.now()}`, titulo: `Reposição · ${plano.turma} · ${plano.disciplina}`, data: novaData, tipo: 'Reposição', descricao: `Reposição da aula suspensa em ${evento.data}.`, planejamentoId: plano.id }, ...lista]);
    Alert.alert('Reposição vinculada', 'O planejamento original foi preservado e a nova data foi incluída no calendário.');
  };
  const eventos = [...dados.eventos].sort((a, b) => a.data.localeCompare(b.data));
  return (
    <View>
      <Text style={styles.heading}>Calendário escolar</Text><Text style={styles.subheading}>Eventos, suspensão de aulas e reorganização do calendário.</Text>
      {gestor && <View style={styles.card}><Text style={styles.sectionTitle}>Novo evento</Text>
        <View style={styles.wrap}>{tipos.map((item) => <Text key={item} onPress={() => setTipo(item)} style={[styles.chip, { color: tipo === item ? colors.blue : colors.muted }]}>{item}</Text>)}</View>
        <CampoTexto label="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Paralisação municipal" />
        <CampoTexto label="Data (AAAA-MM-DD)" value={data} onChangeText={setData} placeholder="2026-11-12" />
        <CampoTexto label="Descrição" value={descricao} onChangeText={setDescricao} multiline />
        <View style={{ marginTop: 12 }}><Botao titulo="Adicionar ao calendário" onPress={cadastrar} /></View>
      </View>}
      {eventos.length ? eventos.map((evento) => {
        const planosAfetados = dados.planejamentos.filter((p) => (evento.afetados || []).includes(p.id));
        return <View key={evento.id} style={styles.card}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.ink, fontWeight: '700', fontSize: 14, flex: 1 }}>{evento.titulo}</Text><Text style={{ color: evento.tipo === 'Paralisação' || evento.tipo === 'Suspensão' ? colors.red : colors.blue, fontSize: 11, fontWeight: '700' }}>{evento.tipo}</Text></View><Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>{evento.data} · {evento.descricao}</Text>
          {planosAfetados.map((plano) => <View key={plano.id} style={{ borderTopWidth: 1, borderColor: colors.line, marginTop: 12, paddingTop: 11 }}><Text style={{ color: colors.ink, fontSize: 12, fontWeight: '700' }}>Aula afetada: {plano.turma} · {plano.disciplina} · {plano.professor}</Text>{gestor && <><CampoTexto label="Data de reposição (AAAA-MM-DD)" value={reposicao[plano.id] || ''} onChangeText={(v) => setReposicao((atual) => ({ ...atual, [plano.id]: v }))} /><View style={{ marginTop: 8 }}><Botao titulo="Vincular reposição" onPress={() => salvarReposicao(evento, plano)} /></View></>}{plano.rescheduled && <Text style={{ color: colors.teal, fontSize: 11, marginTop: 7 }}>Reposição marcada para {plano.rescheduled}</Text>}</View>)}
        </View>;
      }) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum evento cadastrado.</Text></View>}
    </View>
  );
}