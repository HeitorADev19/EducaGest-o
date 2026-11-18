import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { colors, styles } from '../styles';

export function SeletorCompacto({ label, value, opcoes, onChange, placeholder = 'Selecionar' }) {
  const { height } = useWindowDimensions();
  const [aberto, setAberto] = useState(false);
  const selecionada = opcoes.find((opcao) => opcao.value === value);

  return (
    <View style={{ marginBottom: 10 }}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 8 }}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={aberto ? `Fechar ${label || 'seletor'}` : `Abrir ${label || 'seletor'}`}
          accessibilityState={{ expanded: aberto }}
          onPress={() => setAberto((valor) => !valor)}
          style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}
        >
          <View style={{ width: 20, marginRight: 10 }}>
            <View style={{ height: 2, backgroundColor: colors.ink, marginBottom: 4 }} />
            <View style={{ height: 2, backgroundColor: colors.ink, marginBottom: 4 }} />
            <View style={{ height: 2, backgroundColor: colors.ink }} />
          </View>
          <Text style={{ color: colors.ink, fontSize: 13, fontWeight: '700' }}>{selecionada?.label || value || placeholder}</Text>
        </TouchableOpacity>
        {aberto && (
          <ScrollView style={{ maxHeight: Math.min(height * 0.4, 300), borderTopWidth: 1, borderColor: colors.line }}>
            {opcoes.map((opcao) => {
              const atual = value === opcao.value;
              return (
                <TouchableOpacity
                  key={`${opcao.value}-${opcao.label}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: atual }}
                  onPress={() => {
                    onChange(opcao.value);
                    setAberto(false);
                  }}
                  style={{ minHeight: 40, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: atual ? colors.blueLight : colors.white }}
                >
                  <Text style={{ color: atual ? colors.blue : colors.ink, fontSize: 12, fontWeight: atual ? '700' : '500' }}>{opcao.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
