import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

const simbolos = { Painel: '⌂', Coordenação: '◎', Planejamento: '▤', Frequência: '✓', Diário: '▣', Calendário: '▦', Reservas: '◈', Cadastros: '+', Relatórios: '▥' };

export function Menu({ telas, ativa, onSelecionar }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, backgroundColor: colors.white, borderBottomWidth: 1, borderColor: colors.line }} contentContainerStyle={{ paddingHorizontal: 15, alignItems: 'center' }}>
      {telas.map((tela) => {
        const selecionada = tela === ativa;
        return (
          <TouchableOpacity key={tela} onPress={() => onSelecionar(tela)} style={{ paddingHorizontal: 11, paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: selecionada ? colors.blue : 'transparent', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: selecionada ? colors.blue : colors.muted, marginRight: 6, fontSize: 13 }}>{simbolos[tela]}</Text>
            <Text style={{ color: selecionada ? colors.blue : colors.muted, fontSize: 12, fontWeight: selecionada ? '700' : '500' }}>{tela}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}