import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { CampoTexto } from '../components/CampoTexto';
import { Botao } from '../components/Botao';
import { SeletorCompacto } from '../components/SeletorCompacto';
import { decomporTurma } from '../utils/turmas';
import { styles, colors } from '../styles';

const tipos = ['Feriado', 'Reunião', 'Evento', 'Paralisação', 'Suspensão', 'Reposição'];
const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const diasDaSemanaLongos = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const diasLetivos = diasDaSemana.slice(0, 5).map((dia, indice) => ({ dia, numero: indice + 1 }));
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
  const [anoFiltro, setAnoFiltro] = useState('');
  const [secaoFiltro, setSecaoFiltro] = useState('');
  const [turnoFiltro, setTurnoFiltro] = useState('');
  const gestor = usuario.perfil === 'Gestor';
  const turmas = [...(dados.turmas || [])].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }));
  const anos = [...new Set(turmas.map((turma) => decomporTurma(turma).ano))]
    .filter((ano) => ano !== 'outras')
    .sort((a, b) => Number(a) - Number(b));
  const secoes = [...new Set(turmas.map((turma) => decomporTurma(turma).secao))]
    .filter((secao) => secao === 'A' || secao === 'B')
    .sort();
  const temOutrasTurmas = turmas.some((turma) => decomporTurma(turma).ano === 'outras');
  const opcoesAno = [{ label: 'Todos os anos', value: '' }, ...anos.map((ano) => ({ label: `${ano}º Ano`, value: ano }))];
  const opcoesSecao = [{ label: 'Todas', value: '' }, ...secoes.map((secao) => ({ label: secao, value: secao })), ...(temOutrasTurmas ? [{ label: 'Outras', value: 'outras' }] : [])];
  const opcoesTurno = [{ label: 'Todos os turnos', value: '' }, ...['Manhã', 'Tarde'].map((turno) => ({ label: turno, value: turno }))];
  const temFiltroTurma = Boolean(anoFiltro || secaoFiltro || turnoFiltro);
  const correspondeSecao = (partes, secao) => !secao || (secao === 'outras' ? partes.ano === 'outras' : partes.secao === secao);
  const nomesTurmasFiltradas = new Set(turmas.filter((turma) => {
    const partes = decomporTurma(turma);
    return (!anoFiltro || partes.ano === anoFiltro)
      && correspondeSecao(partes, secaoFiltro)
      && (!turnoFiltro || partes.turno === turnoFiltro);
  }).map((turma) => turma.nome));
  const correspondeTurma = (nome) => !temFiltroTurma || nomesTurmasFiltradas.has(nome);
  const professores = [...new Set([
    ...dados.professores.map((professor) => professor.nome),
    ...dados.planejamentos.map((plano) => plano.professor),
    ...(dados.horariosAula || []).map((horario) => horario.professor),
  ])].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const opcoesProfessor = [{ label: 'Todos os professores', value: '' }, ...professores.map((nome) => ({ label: nome, value: nome }))];
  const coresPorProfessor = Object.fromEntries(professores.map((nome, indice) => [nome, coresProfessores[indice % coresProfessores.length]]));
  const aulas = dados.planejamentos
    .filter((plano) => (!professorFiltro || plano.professor === professorFiltro)
      && correspondeTurma(plano.turma))
    .sort((a, b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario));
  const horariosSemana = (dados.horariosAula || [])
    .filter((horario) => (!professorFiltro || horario.professor === professorFiltro)
      && correspondeTurma(horario.turma))
    .sort((a, b) => a.horario.localeCompare(b.horario) || a.diaSemana - b.diaSemana);
  const faixasDeHorario = [...new Set(horariosSemana.map((horario) => horario.horario))].sort();
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
  const diaSelecionado = new Date(ano, mes, Number(dataSelecionada.slice(-2)));
  const numeroDiaSelecionado = diaSelecionado.getDay();
  const diaLetivoSelecionado = ((numeroDiaSelecionado + 6) % 7) + 1;
  const horariosRecorrentesDoDia = horariosSemana.filter((horario) => horario.diaSemana === diaLetivoSelecionado);

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
        <SeletorCompacto label="Ano" value={anoFiltro} opcoes={opcoesAno} onChange={(valor) => {
          setAnoFiltro(valor);
          if (valor && secaoFiltro && turnoFiltro && !turmas.some((turma) => {
            const partes = decomporTurma(turma);
            return partes.ano === valor && correspondeSecao(partes, secaoFiltro) && partes.turno === turnoFiltro;
          })) setSecaoFiltro('');
        }} />
        <SeletorCompacto label="Turma" value={secaoFiltro} opcoes={opcoesSecao} onChange={setSecaoFiltro} />
        <SeletorCompacto label="Turno" value={turnoFiltro} opcoes={opcoesTurno} onChange={(valor) => {
          setTurnoFiltro(valor);
          if (anoFiltro && secaoFiltro && valor && !turmas.some((turma) => {
            const partes = decomporTurma(turma);
            return partes.ano === anoFiltro && correspondeSecao(partes, secaoFiltro) && partes.turno === valor;
          })) setSecaoFiltro('');
        }} />
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
              const recorrentesNoDia = dia
                ? horariosSemana.filter((horario) => horario.diaSemana === ((new Date(ano, mes, Number(dia.slice(-2))).getDay() + 6) % 7) + 1)
                : [];
              const aulasNoDia = [...(dia ? aulasPorData[dia] || [] : []), ...recorrentesNoDia];
              const selecionado = dia === dataSelecionada;
              return (
                <TouchableOpacity
                  key={dia || `vazio-${semana}-${indice}`}
                  accessibilityRole={dia ? 'button' : undefined}
                  accessibilityLabel={dia ? `${formatarData(dia)}, ${aulasNoDia.length} aulas e horários recorrentes` : undefined}
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
        <SeletorCompacto label="Professor" value={professorFiltro} opcoes={opcoesProfessor} onChange={setProfessorFiltro} />
      </View>
      <Text style={styles.sectionTitle}>Planejamentos para {formatarData(dataSelecionada)}</Text>
      {aulasDoDia.length ? aulasDoDia.map((aula) => (
        <View key={aula.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: coresPorProfessor[aula.professor] }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ color: colors.blue, fontSize: 20, fontWeight: '800', width: 72 }}>{aula.horario}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontSize: 13, fontWeight: '700' }}>{aula.disciplina} · {aula.turma}</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{aula.professor} · {aula.sala || 'Sala não informada'}</Text>
            </View>
          </View>
        </View>
      )) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum planejamento específico para esta data, turma e professor.</Text></View>}
      <Text style={styles.sectionTitle}>Horário recorrente · {diasDaSemanaLongos[numeroDiaSelecionado]} · {turnoFiltro || 'Todos os turnos'}</Text>
      {horariosRecorrentesDoDia.length ? horariosRecorrentesDoDia.map((aula) => (
        <View key={aula.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: coresPorProfessor[aula.professor] }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ color: colors.blue, fontSize: 20, fontWeight: '800', width: 72 }}>{aula.horario}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontSize: 13, fontWeight: '700' }}>{aula.disciplina} · {aula.turma}</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{aula.professor}</Text>
            </View>
          </View>
        </View>
      )) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhuma aula recorrente para esta data e este filtro.</Text></View>}
      <Text style={styles.sectionTitle}>Horário semanal recorrente · {turnoFiltro || 'Todos os turnos'}</Text>
      <Text style={[styles.subheading, { marginBottom: 10 }]}>Grade de demonstração por dia da semana, turma e horário.</Text>
      {horariosSemana.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 64, justifyContent: 'center', padding: 6, borderBottomWidth: 1, borderColor: colors.line }}>
                <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '700' }}>Hora</Text>
              </View>
              {diasLetivos.map(({ dia }) => (
                <View key={dia} style={{ width: 120, justifyContent: 'center', alignItems: 'center', padding: 6, borderBottomWidth: 1, borderColor: colors.line }}>
                  <Text style={{ color: colors.ink, fontSize: 11, fontWeight: '700' }}>{dia}</Text>
                </View>
              ))}
            </View>
            {faixasDeHorario.map((horario) => (
              <View key={horario} style={{ flexDirection: 'row' }}>
                <View style={{ width: 64, justifyContent: 'center', padding: 6, borderBottomWidth: 1, borderColor: colors.line }}>
                  <Text style={{ color: colors.blue, fontSize: 12, fontWeight: '800' }}>{horario}</Text>
                </View>
                {diasLetivos.map(({ dia, numero }) => {
                  const aulasDaFaixa = horariosSemana.filter((aula) => aula.diaSemana === numero && aula.horario === horario);
                  return (
                    <View key={dia} style={{ width: 120, minHeight: 76, justifyContent: 'center', padding: 4, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: colors.line }}>
                      {aulasDaFaixa.length ? aulasDaFaixa.map((aula) => (
                        <View key={aula.id} style={{ backgroundColor: colors.canvas, borderLeftWidth: 3, borderLeftColor: coresPorProfessor[aula.professor], borderRadius: 5, padding: 5, marginVertical: 2 }}>
                          <Text numberOfLines={2} style={{ color: colors.ink, fontSize: 10, fontWeight: '700' }}>{aula.disciplina}</Text>
                          <Text style={{ color: colors.muted, fontSize: 9 }}>{aula.turma}</Text>
                          <Text numberOfLines={1} style={{ color: colors.muted, fontSize: 9 }}>{aula.professor}</Text>
                        </View>
                      )) : <Text style={{ color: colors.muted, fontSize: 10, textAlign: 'center' }}>—</Text>}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : <View style={styles.empty}><Text style={styles.emptyText}>Nenhum horário semanal para este professor.</Text></View>}
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
