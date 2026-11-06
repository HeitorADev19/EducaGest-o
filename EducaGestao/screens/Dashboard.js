import { Text, View } from 'react-native';
import { Card } from '../components/Card';
import { styles, colors } from '../styles';

export function Dashboard({ dados, usuario, onIrPara }) {
  const alunos = dados.alunos.length;
  const presencas = dados.frequencias.flatMap((chamada) => chamada.registros || []);
  const frequencia = presencas.length ? Math.round((presencas.filter((registro) => registro.presente).length / presencas.length) * 100) : 0;
  const planosPendentes = dados.planejamentos.filter((plano) => plano.status === 'Pendente' || plano.status === 'Enviado').length;
  const proximos = [...dados.eventos].sort((a, b) => a.data.localeCompare(b.data)).slice(0, 3);
  const metricas = [
    ['Alunos matriculados', alunos, 'cadastros fictícios', colors.blue],
    ['Professores', dados.professores.length, 'equipe escolar', colors.teal],
    ['Turmas ativas', dados.turmas.length, 'anos em acompanhamento', colors.green],
    ['Frequência média', `${frequencia}%`, 'com base nas chamadas', colors.amber],
    ['Planejamentos enviados', dados.planejamentos.filter((p) => p.status !== 'Pendente').length, 'inclui aprovados', colors.blue],
    ['Aguardando análise', planosPendentes + dados.reservas.filter((r) => r.status === 'Pendente').length, 'planos e solicitações', colors.red],
  ];
  return (
    <View>
      <Text style={styles.heading}>Bom dia, {usuario.nome.split(' ')[0]}</Text>
      <Text style={styles.subheading}>Acompanhe o movimento pedagógico da EMEF Caminhos do Saber.</Text>
      <View style={styles.wrap}>{metricas.map(([titulo, valor, detalhe, cor]) => <Card key={titulo} titulo={titulo} valor={valor} detalhe={detalhe} cor={cor} />)}</View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ritmo pedagógico</Text>
        {dados.turmas.map((turma) => {
          const planos = dados.planejamentos.filter((plano) => plano.turma === turma.nome);
          const percentual = planos.length ? Math.round((planos.filter((plano) => plano.status === 'Aprovado').length / planos.length) * 100) : 0;
          return <View key={turma.id} style={{ marginTop: 13 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.ink, fontSize: 12, fontWeight: '700' }}>{turma.nome}</Text><Text style={{ color: colors.muted, fontSize: 11 }}>{percentual}% aprovados</Text></View><View style={{ height: 7, borderRadius: 5, backgroundColor: colors.canvas, marginTop: 7 }}><View style={{ width: `${percentual}%`, height: 7, borderRadius: 5, backgroundColor: colors.blue }} /></View></View>;
        })}
      </View>
      <Text style={styles.sectionTitle}>Acesso rápido</Text>
      <View style={styles.wrap}>{[['Novo planejamento', 'Planejamento'], ['Registrar chamada', 'Frequência'], ['Solicitar recurso', 'Reservas']].map(([label, destino]) => <Text key={destino} onPress={() => onIrPara(destino)} style={{ color: colors.blue, fontWeight: '700', padding: 12, marginRight: 8, marginBottom: 8, backgroundColor: colors.blueLight, borderRadius: 8 }}>{label}  →</Text>)}</View>
      <View style={styles.card}><Text style={styles.sectionTitle}>Próximos eventos</Text>{proximos.length ? proximos.map((evento) => <View key={evento.id} style={{ borderTopWidth: 1, borderColor: colors.line, paddingVertical: 11 }}><Text style={{ color: colors.ink, fontWeight: '700', fontSize: 13 }}>{evento.titulo}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{evento.data} · {evento.tipo}</Text></View>) : <Text style={styles.emptyText}>Nenhum evento cadastrado.</Text>}</View>
      <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8 }}>Atualizado a partir dos cadastros, planejamentos, chamadas e reservas salvos neste dispositivo.</Text>
    </View>
  );
}