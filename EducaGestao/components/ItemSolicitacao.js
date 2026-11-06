import { Text, View } from 'react-native';
import { styles, colors } from '../styles';

export function ItemSolicitacao({ item }) {
  const statusColor = item.status === 'Aprovada' ? colors.green : item.status === 'Recusada' ? colors.red : colors.amber;
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.ink, fontSize: 14, fontWeight: '700', flex: 1 }}>{item.recurso}</Text>
        <Text style={{ color: statusColor, fontSize: 11, fontWeight: '700' }}>{item.status}</Text>
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{item.solicitante} · {item.turma}</Text>
      <Text style={{ color: colors.ink, fontSize: 12, marginTop: 5 }}>{item.data} às {item.horario} · {item.finalidade}</Text>
      {!!item.justificativa && <Text style={{ color: colors.muted, fontSize: 11, marginTop: 5 }}>Observação: {item.justificativa}</Text>}
    </View>
  );
}