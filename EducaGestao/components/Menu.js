import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { colors } from '../styles';

const simbolos = { Painel: '⌂', Coordenação: '◎', Planejamento: '▤', Frequência: '✓', Diário: '▣', Calendário: '▦', Reservas: '◈', Cadastros: '+', Relatórios: '▥' };
const larguraMobile = 640;

export function Menu({ telas, ativa, onSelecionar }) {
  const { width, height } = useWindowDimensions();
  const [aberto, setAberto] = useState(false);

  if (width < larguraMobile) {
    return (
      <View style={{ backgroundColor: colors.white, borderBottomWidth: 1, borderColor: colors.line }}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={aberto ? 'Fechar menu' : 'Abrir menu'}
          accessibilityState={{ expanded: aberto }}
          onPress={() => setAberto((valor) => !valor)}
          style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}
        >
          <View style={{ width: 23, marginRight: 12 }}>
            <View style={{ height: 2, backgroundColor: colors.ink, marginBottom: 5 }} />
            <View style={{ height: 2, backgroundColor: colors.ink, marginBottom: 5 }} />
            <View style={{ height: 2, backgroundColor: colors.ink }} />
          </View>
          <Text style={{ color: colors.ink, fontSize: 13, fontWeight: '700' }}>{ativa}</Text>
        </TouchableOpacity>
        {aberto && (
          <ScrollView style={{ maxHeight: Math.min(height * 0.5, 360) }} contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 6 }}>
            {telas.map((tela) => {
              const selecionada = tela === ativa;
              return (
                <TouchableOpacity
                  key={tela}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionada }}
                  onPress={() => {
                    onSelecionar(tela);
                    setAberto(false);
                  }}
                  style={{ minHeight: 42, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 8, backgroundColor: selecionada ? colors.blueLight : 'transparent' }}
                >
                  <Text style={{ color: selecionada ? colors.blue : colors.muted, marginRight: 10, fontSize: 13 }}>{simbolos[tela]}</Text>
                  <Text style={{ color: selecionada ? colors.blue : colors.muted, fontSize: 13, fontWeight: selecionada ? '700' : '500' }}>{tela}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }

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
