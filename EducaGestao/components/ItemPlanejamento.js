import { Text, View } from 'react-native';
import { Botao } from './Botao';
import { styles, colors } from '../styles';

const corStatus = { Aprovado: colors.green, Pendente: colors.amber, Reprovado: colors.red, Enviado: colors.blue };

export function ItemPlanejamento({ item, onEditar, onExcluir, acoes = false }) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 14 }}>{item.disciplina} · {item.turma}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 5 }}>{item.professor} · {item.data} às {item.horario}</Text>
        </View>
        <Text style={{ color: corStatus[item.status] || colors.muted, fontSize: 11, fontWeight: '700' }}>{item.status}</Text>
      </View>
      <Text style={{ color: colors.ink, fontSize: 13, marginTop: 12 }}>{item.conteudo}</Text>
      {!!item.rescheduled && <Text style={{ color: colors.teal, fontSize: 11, marginTop: 6 }}>Reposição em {item.rescheduled}</Text>}
      {acoes && <View style={{ flexDirection: 'row', gap: 8, marginTop: 13 }}><Botao titulo="Editar" variante="secundario" compact onPress={() => onEditar(item)} /><Botao titulo="Excluir" variante="perigo" compact onPress={() => onExcluir(item.id)} /></View>}
    </View>
  );
}