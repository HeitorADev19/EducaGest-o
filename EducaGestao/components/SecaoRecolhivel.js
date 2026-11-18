import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles';

export function SecaoRecolhivel({ titulo, resumo, children }) {
  const [aberta, setAberta] = useState(false);

  return (
    <View style={{ marginTop: 16 }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${aberta ? 'Recolher' : 'Expandir'} ${titulo}`}
        accessibilityState={{ expanded: aberta }}
        onPress={() => setAberta((valor) => !valor)}
        style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.line }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '700' }}>{titulo}</Text>
          {!!resumo && <Text style={{ color: colors.muted, fontSize: 11, marginTop: 3 }}>{resumo}</Text>}
        </View>
        <Text style={{ color: colors.blue, fontSize: 20, fontWeight: '700', paddingHorizontal: 8 }}>{aberta ? '-' : '+'}</Text>
      </TouchableOpacity>
      {aberta && <View style={{ marginTop: 8 }}>{children}</View>}
    </View>
  );
}
