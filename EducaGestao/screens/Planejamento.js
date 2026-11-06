import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { ItemPlanejamento } from '../components/ItemPlanejamento';
import { styles, colors } from '../styles';

const vazio = { professor: '', turma: '', disciplina: '', data: '', horario: '', conteudo: '', objetivos: '', metodologia: '', recursosDidaticos: '', sala: '', observacoes: '' };

export function Planejamento({ dados, usuario, atualizar }) {
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const proprio = usuario.perfil === 'Professor';
  const planos = dados.planejamentos.filter((plano) => (!proprio || plano.professor === usuario.nome) && (!filtro || plano.turma === filtro || plano.disciplina === filtro));
  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const salvar = () => {
    if (!form.turma || !form.disciplina || !form.data || !form.horario || !form.conteudo || !form.objetivos || !form.metodologia || !form.recursosDidaticos || !form.sala) return Alert.alert('Campos obrigatórios', 'Preencha turma, disciplina, data, horário, conteúdo, objetivos, metodologia, recursos e sala.');
    const item = { ...form, professor: proprio ? usuario.nome : form.professor || usuario.nome, status: 'Enviado' };
    atualizar('planejamentos', (lista) => editando ? lista.map((p) => p.id === editando ? { ...p, ...item } : p) : [{ ...item, id: `pl-${Date.now()}` }, ...lista]);
    setForm(vazio); setEditando(null); Alert.alert('Planejamento salvo', 'O planejamento foi enviado para acompanhamento.');
  };
  const editar = (item) => { setEditando(item.id); setForm({ ...vazio, ...item }); };
  const excluir = (id) => Alert.alert('Excluir planejamento?', 'Esta ação não pode ser desfeita.', [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: () => atualizar('planejamentos', (lista) => lista.filter((p) => p.id !== id)) }]);
  return (
    <View>
      <Text style={styles.heading}>Planejamento docente</Text><Text style={styles.subheading}>Organize objetivos, recursos e aulas por turma.</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{editando ? 'Editar planejamento' : 'Novo planejamento'}</Text>
        {!proprio && <CampoTexto label="Professor" value={form.professor} onChangeText={(v) => alterar('professor', v)} placeholder="Nome do professor" />}
        <CampoTexto label="Turma" value={form.turma} onChangeText={(v) => alterar('turma', v)} placeholder="Ex.: 5º Ano A" />
        <CampoTexto label="Disciplina" value={form.disciplina} onChangeText={(v) => alterar('disciplina', v)} />
        <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><CampoTexto label="Data (AAAA-MM-DD)" value={form.data} onChangeText={(v) => alterar('data', v)} placeholder="2026-11-12" /></View><View style={{ flex: 1 }}><CampoTexto label="Horário" value={form.horario} onChangeText={(v) => alterar('horario', v)} placeholder="09:00" /></View></View>
        <CampoTexto label="Conteúdo programático" value={form.conteudo} onChangeText={(v) => alterar('conteudo', v)} />
        <CampoTexto label="Objetivos de aprendizagem" value={form.objetivos} onChangeText={(v) => alterar('objetivos', v)} multiline />
        <CampoTexto label="Metodologia" value={form.metodologia} onChangeText={(v) => alterar('metodologia', v)} multiline />
        <CampoTexto label="Recursos didáticos" value={form.recursosDidaticos} onChangeText={(v) => alterar('recursosDidaticos', v)} />
        <CampoTexto label="Sala necessária" value={form.sala} onChangeText={(v) => alterar('sala', v)} />
        <CampoTexto label="Observações" value={form.observacoes} onChangeText={(v) => alterar('observacoes', v)} multiline />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}><Botao titulo={editando ? 'Salvar alterações' : 'Enviar planejamento'} onPress={salvar} />{editando && <Botao titulo="Cancelar" variante="secundario" onPress={() => { setEditando(null); setForm(vazio); }} />}</View>
      </View>
      <Text style={styles.sectionTitle}>Planejamentos anteriores</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>{['', ...dados.turmas.map((t) => t.nome), ...dados.disciplinas].map((opcao) => <TouchableOpacity key={opcao || 'todos'} onPress={() => setFiltro(opcao)} style={styles.chip}><Text style={styles.chipText}>{opcao || 'Todas as turmas'}</Text></TouchableOpacity>)}</View>
      {planos.length ? planos.map((item) => <ItemPlanejamento key={item.id} item={item} acoes={proprio && item.status !== 'Aprovado'} onEditar={editar} onExcluir={excluir} />) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum planejamento encontrado para este filtro.</Text></View>}
    </View>
  );
}