import { Text, TouchableOpacity } from 'react-native';
import { colors, styles } from '../styles';

export function Botao({ titulo, onPress, variante = 'primario', compact = false }) {
  const secundaria = variante === 'secundario';
  const perigo = variante === 'perigo';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.78} style={[styles.button, compact && { minHeight: 36, paddingVertical: 8 }, secundaria && styles.buttonSecondary, perigo && styles.buttonDanger]}>
      <Text style={[styles.buttonText, secundaria && styles.buttonSecondaryText, perigo && styles.buttonDangerText]}>{titulo}</Text>
    </TouchableOpacity>
  );
}