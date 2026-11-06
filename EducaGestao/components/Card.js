import { Text, View } from 'react-native';
import { styles } from '../styles';

export function Card({ titulo, valor, detalhe, cor = '#246BCE' }) {
  return (
    <View style={[styles.card, { flexGrow: 1, flexBasis: 140, minWidth: 140 }]}>
      <View style={{ width: 30, height: 4, borderRadius: 2, backgroundColor: cor, marginBottom: 13 }} />
      <Text style={{ color: '#718096', fontSize: 12 }}>{titulo}</Text>
      <Text style={{ color: '#172B4D', fontSize: 25, fontWeight: '800', marginTop: 4 }}>{valor}</Text>
      {!!detalhe && <Text style={{ color: '#718096', fontSize: 11, marginTop: 4 }}>{detalhe}</Text>}
    </View>
  );
}