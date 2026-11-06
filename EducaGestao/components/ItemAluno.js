import { Text, View } from 'react-native';
import { styles, colors } from '../styles';

export function ItemAluno({ aluno, presente, justificativa, onAlternar, onJustificativa }) {
  return (
    <View style={[styles.card, { padding: 13 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 13 }}>{aluno.nome}</Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{aluno.matricula}</Text>
        </View>
        <Text onPress={onAlternar} style={{ color: presente ? colors.green : colors.red, fontWeight: '800', fontSize: 12, padding: 8 }}>
          {presente ? '● Presente' : '○ Ausente'}
        </Text>
      </View>
      {!presente && <Text onPress={onJustificativa} style={{ color: colors.blue, fontSize: 11, paddingTop: 7 }}>{justificativa || 'Adicionar justificativa'}</Text>}
    </View>
  );
}