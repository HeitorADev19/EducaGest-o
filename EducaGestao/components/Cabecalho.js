import { Text, TouchableOpacity, View } from 'react-native';
import { styles, colors } from '../styles';

export function Cabecalho({ usuario, onSair, tema, onAlternarTema }) {
  return (
    <View style={{ backgroundColor: colors.white, paddingHorizontal: 22, paddingVertical: 15, borderBottomWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={styles.row}>
        <View style={{ backgroundColor: colors.ink, width: 39, height: 39, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 11 }}>
          <Text style={{ color: colors.white, fontWeight: '900', fontSize: 16 }}>E</Text>
        </View>
        <View>
          <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '800' }}>EducaGestão</Text>
          <Text style={{ color: colors.muted, fontSize: 10 }}>EMEF Caminhos do Saber</Text>
        </View>
      </View>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Ativar tema ${tema === 'dark' ? 'claro' : 'escuro'}`} onPress={onAlternarTema} style={{ padding: 8 }}>
        <Text style={{ color: colors.blue, fontWeight: '700', fontSize: 11 }}>{tema === 'dark' ? '☀ Claro' : '☾ Escuro'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSair} style={{ alignItems: 'flex-end', paddingVertical: 4 }}>
        <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 12 }}>{usuario.nome}</Text>
        <Text style={{ color: colors.blue, fontSize: 10, marginTop: 3 }}>{usuario.perfil} · Trocar perfil</Text>
      </TouchableOpacity>
    </View>
  );
}