import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { ItemPlanejamento } from '../components/ItemPlanejamento';
import { SeletorCompacto } from '../components/SeletorCompacto';
import { SecaoRecolhivel } from '../components/SecaoRecolhivel';
import { decomporTurma } from '../utils/turmas';
import { styles } from '../styles';

const vazio = { professor: '', turma: '', disciplina: '', data: '', horario: '', conteudo: '', objetivos: '', metodologia: '', recursosDidaticos: '', sala: '', observacoes: '' };

export function Planejamento({ dados, usuario, atualizar }) {
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState(null);
  const [filtroAno, setFiltroAno] = useState('');
  const [filtroSecao, setFiltroSecao] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('');
  const proprio = usuario.perfil === 'Professor';
  const turmas = [...dados.turmas].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }));
  const anos = [...new Set(turmas.map((turma) => decomporTurma(turma).ano))]
    .sort((a, b) => a === 'outras' ? 1 : b === 'outras' ? -1 : Number(a) - Number(b));
  const secoes = [...new Set(turmas.map((turma) => decomporTurma(turma).secao))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
  const opcoesAno = [{ label: 'Todos os anos', value: '' }, ...anos.map((ano) => ({ label: ano === 'outras' ? 'Outras' : `${ano}º Ano`, value: ano }))];
  const opcoesSecao = [{ label: 'Todas', value: '' }, ...secoes.map((secao) => ({ label: secao, value: secao }))];
  const opcoesTurno = [{ label: 'Todos os turnos', value: '' }, ...['Manhã', 'Tarde'].map((turno) => ({ label: turno, value: turno }))];
  const opcoesDisciplina = [{ label: 'Todas as disciplinas', value: '' }, ...dados.disciplinas.map((disciplina) => ({ label: disciplina, value: disciplina }))];
  const opcoesTurmaFormulario = turmas.map((turma) => ({ label: `${turma.nome} · ${turma.turno || decomporTurma(turma).turno}`, value: turma.nome }));
  const professores = [...new Set([
    ...dados.professores.map((professor) => professor.nome),
    ...dados.planejamentos.map((plano) => plano.professor),
    ...(dados.horariosAula || []).map((aula) => aula.professor),
  ])].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const opcoesProfessorFormulario = [{ label: 'Selecione um professor', value: '' }, ...professores.map((professor) => ({ label: professor, value: professor }))];
  const disciplinaDoProfessor = (nome) => dados.professores.find((professor) => professor.nome === nome)?.disciplina
    || (dados.horariosAula || []).find((aula) => aula.professor === nome)?.disciplina
    || dados.planejamentos.find((plano) => plano.professor === nome)?.disciplina;
  const turnoPorTurma = Object.fromEntries(turmas.map((turma) => [turma.nome, turma.turno || 'Manhã']));
  const planos = dados.planejamentos.filter((plano) => {
    if (proprio && plano.professor !== usuario.nome) return false;
    if (filtroDisciplina && plano.disciplina !== filtroDisciplina) return false;
    const nomeTurma = turmas.find((turma) => turma.nome === plano.turma);
    const partes = nomeTurma ? decomporTurma(nomeTurma) : decomporTurma(plano.turma);
    return (!filtroAno || partes.ano === filtroAno)
      && (!filtroSecao || partes.secao === filtroSecao)
      && (!filtroTurno || (turnoPorTurma[plano.turma] || partes.turno) === filtroTurno);
  });
  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const salvar = () => {
    const professor = proprio ? usuario.nome : form.professor || usuario.nome;
    const disciplina = disciplinaDoProfessor(professor) || form.disciplina;
    if (!form.turma || !professor || !disciplina || !form.data || !form.horario || !form.conteudo || !form.objetivos || !form.metodologia || !form.recursosDidaticos || !form.sala) return Alert.alert('Campos obrigatórios', 'Abra “Detalhes do planejamento” e preencha objetivos, metodologia, recursos e sala.');
    const item = { ...form, professor, disciplina, status: 'Enviado' };
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
        <SeletorCompacto label="Turma" value={form.turma} opcoes={opcoesTurmaFormulario} placeholder="Selecione a turma" onChange={(v) => alterar('turma', v)} />
        {form.turma && <>
          {!proprio && <SeletorCompacto label="Professor" value={form.professor} opcoes={opcoesProfessorFormulario} onChange={(professor) => setForm((atual) => ({ ...atual, professor, disciplina: disciplinaDoProfessor(professor) || '' }))} />}
          <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><CampoTexto label="Data (AAAA-MM-DD)" value={form.data} onChangeText={(v) => alterar('data', v)} placeholder="2026-11-12" /></View><View style={{ flex: 1 }}><CampoTexto label="Horário" value={form.horario} onChangeText={(v) => alterar('horario', v)} placeholder="09:00" /></View></View>
          <CampoTexto label="Conteúdo programático" value={form.conteudo} onChangeText={(v) => alterar('conteudo', v)} />
          <SecaoRecolhivel titulo="Detalhes do planejamento" resumo="Obrigatórios: objetivos, metodologia, recursos e sala">
            <CampoTexto label="Objetivos de aprendizagem" value={form.objetivos} onChangeText={(v) => alterar('objetivos', v)} multiline />
            <CampoTexto label="Metodologia" value={form.metodologia} onChangeText={(v) => alterar('metodologia', v)} multiline />
            <CampoTexto label="Recursos didáticos" value={form.recursosDidaticos} onChangeText={(v) => alterar('recursosDidaticos', v)} />
            <CampoTexto label="Sala necessária" value={form.sala} onChangeText={(v) => alterar('sala', v)} />
            <CampoTexto label="Observações" value={form.observacoes} onChangeText={(v) => alterar('observacoes', v)} multiline />
          </SecaoRecolhivel>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}><Botao titulo={editando ? 'Salvar alterações' : 'Enviar planejamento'} onPress={salvar} />{editando && <Botao titulo="Cancelar" variante="secundario" onPress={() => { setEditando(null); setForm(vazio); }} />}</View>
        </>}
      </View>
      <Text style={styles.sectionTitle}>Planejamentos anteriores</Text>
      <SeletorCompacto label="Ano" value={filtroAno} opcoes={opcoesAno} onChange={setFiltroAno} />
      <SeletorCompacto label="Turma" value={filtroSecao} opcoes={opcoesSecao} onChange={setFiltroSecao} />
      <SeletorCompacto label="Turno" value={filtroTurno} opcoes={opcoesTurno} onChange={setFiltroTurno} />
      <SeletorCompacto label="Disciplina" value={filtroDisciplina} opcoes={opcoesDisciplina} onChange={setFiltroDisciplina} />
      {planos.length ? planos.map((item) => <ItemPlanejamento key={item.id} item={item} acoes={proprio && item.status !== 'Aprovado'} onEditar={editar} onExcluir={excluir} />) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum planejamento encontrado para este filtro.</Text></View>}
    </View>
  );
}