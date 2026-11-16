import { useState } from 'react';
import { Alert, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { styles, colors } from '../styles';

const tipos = ['Feriado', 'Reunião', 'Evento', 'Paralisação', 'Suspensão', 'Reposição'];
const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const nomesDosMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const coresProfessores = ['#246BCE', '#168A91', '#17865B', '#A96912', '#C34848', '#805AD5', '#D53F8C'];

const chaveData = (ano, mes, dia) => `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
const formatarData = (data) => {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};
const iniciais = (nome) => {
  const partes = nome.trim().split(/\s+/);
  return `${partes[0][0]}${partes.length > 1 ? partes[partes.length - 1][0] : ''}`.toUpperCase();
};

export function Calendario({ dados, usuario, atualizar }) {
  const { width } = useWindowDimensions();
  const hoje = new Date();
  const [mesExibido, setMesExibido] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hojeChave = chaveData(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const mesAtual = hojeChave.slice(0, 7);
    const aulasDoMes = dados.planejamentos
      .filter((plano) => plano.data.startsWith(mesAtual))
      .sort((a, b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario));
    return aulasDoMes.find((plano) => plano.data >= hojeChave)?.data || aulasDoMes[0]?.data || hojeChave;
  });
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('Evento');
  const [descricao, setDescricao] = useState('');
  const [reposicao, setReposicao] = useState({});
  const [professorFiltro, setProfessorFiltro] = useState('');
  const gestor = usuario.perfil === 'Gestor';
  const professores = [...new Set([
    ...dados.professores.map((professor) => professor.nome),
    ...dados.planejamentos.map((plano) => plano.professor),
  ])].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const coresPorProfessor = Object.fromEntries(professores.map((nome, indice) => [nome, coresProfessores[indice % coresProfessores.length]]));
  const aulas = dados.planejamentos
    .filter((plano) => !professorFiltro || plano.professor === professorFiltro)
    .sort((a, b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario));
  const aulasPorData = aulas.reduce((grupos, aula) => {
    grupos[aula.data] = [...(grupos[aula.data] || []), aula];
    return grupos;
  }, {});
  const ano = mesExibido.getFullYear();
  const mes = mesExibido.getMonth();
  const primeiroDia = new Date(ano, mes, 1);
  const deslocamento = (primeiroDia.getDay() + 6) % 7;
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const totalCelulas = Math.ceil((deslocamento + totalDias) / 7) * 7;
  const dias = Array.from({ length: totalCelulas }, (_, indice) => (
    indice < deslocamento ? null : chaveData(ano, mes, indice - deslocamento + 1)
  ));
  const larguraCelula = Math.max(28, Math.min(150, Math.floor((width - 64) / 7)));
  const aulasDoDia = aulasPorData[dataSelecionada] || [];

  const navegarMes = (incremento) => {
    const proximo = new Date(ano, mes + incremento, 1);
    setMesExibido(proximo);
    setDataSelecionada(chaveData(proximo.getFullYear(), proximo.getMonth(), 1));
  };
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
      <Text style={styles.heading}>Calendário escolar</Text>
      <Text style={styles.subheading}>Aulas de todos os professores e eventos da escola.</Text>
      <View style={[styles.card, { padding: 10 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mês anterior" onPress={() => navegarMes(-1)} style={{ padding: 8 }}>
            <Text style={{ color: colors.blue, fontSize: 22, fontWeight: '700' }}>‹</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.ink, fontSize: 18, fontWeight: '800' }}>{nomesDosMeses[mes]} {ano}</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Próximo mês" onPress={() => navegarMes(1)} style={{ padding: 8 }}>
            <Text style={{ color: colors.blue, fontSize: 22, fontWeight: '700' }}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {diasDaSemana.map((dia) => (
            <View key={dia} style={{ width: larguraCelula, alignItems: 'center', paddingBottom: 7 }}>
              <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '700' }}>{dia}</Text>
            </View>
          ))}
        </View>
        {Array.from({ length: totalCelulas / 7 }, (_, semana) => (
          <View key={semana} style={{ flexDirection: 'row' }}>
            {dias.slice(semana * 7, semana * 7 + 7).map((dia, indice) => {
              const aulasNoDia = dia ? aulasPorData[dia] || [] : [];
              const selecionado = dia === dataSelecionada;
              return (
                <TouchableOpacity
                  key={dia || `vazio-${semana}-${indice}`}
                  accessibilityRole={dia ? 'button' : undefined}
                  accessibilityLabel={dia ? `${formatarData(dia)}, ${aulasNoDia.length} aulas` : undefined}
                  disabled={!dia}
                  onPress={() => setDataSelecionada(dia)}
                  style={{
                    width: larguraCelula,
                    minHeight: 72,
                    padding: 3,
                    borderWidth: 1,
                    borderColor: selecionado ? colors.blue : colors.line,
                    backgroundColor: selecionado ? colors.blueLight : colors.white,
                  }}
                >
                  {dia && <>
                    <Text style={{ color: selecionado ? colors.blue : colors.ink, fontSize: 10, fontWeight: selecionado ? '800' : '600', marginBottom: 2 }}>
                      {Number(dia.slice(-2))}
                    </Text>
                    {aulasNoDia.slice(0, 2).map((aula) => (
                      <View key={aula.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.canvas, borderRadius: 3, paddingHorizontal: 2, marginTop: 2 }}>
                        <Text numberOfLines={1} style={{ color: colors.ink, fontSize: 7, flexShrink: 1 }}>{aula.horario.slice(0, 5)}</Text>
                        <Text numberOfLines={1} style={{ color: coresPorProfessor[aula.professor], fontSize: 7, fontWeight: '800', marginLeft: 2 }}>{iniciais(aula.professor)}</Text>
                      </View>
                    ))}
                    {aulasNoDia.length > 2 && <Text style={{ color: colors.muted, fontSize: 7, marginTop: 2 }}>+{aulasNoDia.length - 2}</Text>}
                  </>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <Text style={styles.sectionTitle}>Professores</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {professores.map((nome) => (
            <TouchableOpacity key={nome} onPress={() => setProfessorFiltro(professorFiltro === nome ? '' : nome)} style={[styles.chip, { flexDirection: 'row', alignItems: 'center', opacity: !professorFiltro || professorFiltro === nome ? 1 : 0.45 }]}>
              <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: coresPorProfessor[nome], marginRight: 6 }} />
              <Text style={styles.chipText}>{nome}</Text>
            </TouchableOpacity>
          ))}
          {!!professorFiltro && <TouchableOpacity onPress={() => setProfessorFiltro('')} style={styles.chip}><Text style={[styles.chipText, { color: colors.blue }]}>Mostrar todos</Text></TouchableOpacity>}
        </View>
      </View>
      <Text style={styles.sectionTitle}>Aulas de {formatarData(dataSelecionada)}</Text>
      {aulasDoDia.length ? aulasDoDia.map((aula) => (
        <View key={aula.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: coresPorProfessor[aula.professor] }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ color: colors.blue, fontSize: 14, fontWeight: '800', width: 55 }}>{aula.horario}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontSize: 13, fontWeight: '700' }}>{aula.disciplina} · {aula.turma}</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{aula.professor} · {aula.sala || 'Sala não informada'}</Text>
            </View>
          </View>
        </View>
      )) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhuma aula para esta data e este filtro.</Text></View>}
      {gestor && <View style={styles.card}><Text style={styles.sectionTitle}>Novo evento</Text>
        <View style={styles.wrap}>{tipos.map((item) => <Text key={item} onPress={() => setTipo(item)} style={[styles.chip, { color: tipo === item ? colors.blue : colors.muted }]}>{item}</Text>)}</View>
        <CampoTexto label="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Paralisação municipal" />
        <CampoTexto label="Data (AAAA-MM-DD)" value={data} onChangeText={setData} placeholder="2026-11-12" />
        <CampoTexto label="Descrição" value={descricao} onChangeText={setDescricao} multiline />
        <View style={{ marginTop: 12 }}><Botao titulo="Adicionar ao calendário" onPress={cadastrar} /></View>
      </View>}
      <Text style={styles.sectionTitle}>Eventos escolares</Text>
      {eventos.length ? eventos.map((evento) => {
        const planosAfetados = dados.planejamentos.filter((p) => (evento.afetados || []).includes(p.id));
        return <View key={evento.id} style={styles.card}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.ink, fontWeight: '700', fontSize: 14, flex: 1 }}>{evento.titulo}</Text><Text style={{ color: evento.tipo === 'Paralisação' || evento.tipo === 'Suspensão' ? colors.red : colors.blue, fontSize: 11, fontWeight: '700' }}>{evento.tipo}</Text></View><Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>{evento.data} · {evento.descricao}</Text>
          {planosAfetados.map((plano) => <View key={plano.id} style={{ borderTopWidth: 1, borderColor: colors.line, marginTop: 12, paddingTop: 11 }}><Text style={{ color: colors.ink, fontSize: 12, fontWeight: '700' }}>Aula afetada: {plano.turma} · {plano.disciplina} · {plano.professor}</Text>{gestor && <><CampoTexto label="Data de reposição (AAAA-MM-DD)" value={reposicao[plano.id] || ''} onChangeText={(v) => setReposicao((atual) => ({ ...atual, [plano.id]: v }))} /><View style={{ marginTop: 8 }}><Botao titulo="Vincular reposição" onPress={() => salvarReposicao(evento, plano)} /></View></>}{plano.rescheduled && <Text style={{ color: colors.teal, fontSize: 11, marginTop: 7 }}>Reposição marcada para {plano.rescheduled}</Text>}</View>)}
        </View>;
      }) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum evento cadastrado.</Text></View>}
    </View>
  );
}
