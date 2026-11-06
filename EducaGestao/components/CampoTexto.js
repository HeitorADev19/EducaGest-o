import { Text, TextInput, View } from 'react-native';
import { styles, colors } from '../styles';

export function CampoTexto({ label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default', secureTextEntry = false }) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder || label} placeholderTextColor={colors.muted} multiline={multiline} keyboardType={keyboardType} secureTextEntry={secureTextEntry} style={[styles.input, multiline && { minHeight: 82, textAlignVertical: 'top' }]} />
    </View>
  );
}