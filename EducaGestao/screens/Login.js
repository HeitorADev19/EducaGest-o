import { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, styles } from '../styles';

const perfis = [
  { perfil: 'Professor', nome: 'Letícia Almeida', email: 'leticia@educagestao.demo', iniciais: 'LA' },
  { perfil: 'Coordenador', nome: 'Cláudia Mendes', email: 'coordenacao@educagestao.demo', iniciais: 'CM' },
  { perfil: 'Gestor', nome: 'Paulo Ribeiro', email: 'gestor@educagestao.demo', iniciais: 'PR' },
];

export function Login({ onEntrar, tema, onAlternarTema, erroPreferencia }) {
  const [email, setEmail] = useState(perfis[0].email);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [selecionado, setSelecionado] = useState(perfis[0]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <StatusBar barStyle={tema === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.canvas} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 22 }} keyboardShouldPersistTaps="handled">
        <View style={{ width: '100%', maxWidth: 440, alignSelf: 'center' }}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Ativar tema ${tema === 'dark' ? 'claro' : 'escuro'}`} onPress={onAlternarTema} style={{ alignSelf: 'flex-end', padding: 10, marginBottom: 8 }}>
            <Text style={{ color: colors.blue, fontWeight: '700', fontSize: 12 }}>{tema === 'dark' ? '☀ Ativar tema claro' : '☾ Ativar tema escuro'}</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: '#172B4D', borderRadius: 16, padding: 25, marginBottom: 18 }}>
            <Text style={{ color: '#9CCAFF', fontSize: 12, fontWeight: '700' }}>GESTÃO ESCOLAR INTEGRADA</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 29, fontWeight: '900', marginTop: 9 }}>EducaGestão</Text>
            <Text style={{ color: '#D5E1F2', fontSize: 13, marginTop: 6 }}>Rotina pedagógica em um só lugar.</Text>
          </View>
          <View style={styles.card}>
            {erroPreferencia && <Text accessibilityRole="alert" style={{ color: colors.red, fontSize: 12, marginBottom: 8 }}>Não foi possível salvar a preferência de tema: {erroPreferencia.message}</Text>}
            <Text style={{ color: colors.ink, fontSize: 19, fontWeight: '800' }}>Acessar ambiente</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, marginBottom: 10 }}>Escolha um perfil de demonstração para continuar.</Text>
            {perfis.map((perfil) => (
              <TouchableOpacity key={perfil.perfil} onPress={() => { setSelecionado(perfil); setEmail(perfil.email); }} style={{ borderColor: selecionado.perfil === perfil.perfil ? colors.blue : colors.line, borderWidth: 1, borderRadius: 9, padding: 11, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}><Text style={{ color: colors.blue, fontWeight: '800', fontSize: 11 }}>{perfil.iniciais}</Text></View>
                <View style={{ flex: 1 }}><Text style={{ color: colors.ink, fontWeight: '700', fontSize: 13 }}>{perfil.nome}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{perfil.perfil}</Text></View>
                <Text style={{ color: colors.blue, fontSize: 16 }}>{selecionado.perfil === perfil.perfil ? '●' : '○'}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
            <Text style={styles.fieldLabel}>Senha demonstrativa</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput value="educagestao" editable={false} secureTextEntry={!senhaVisivel} style={[styles.input, { flex: 1 }]} />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={{ padding: 12 }}><Text style={{ color: colors.blue, fontSize: 12 }}>{senhaVisivel ? 'Ocultar' : 'Ver'}</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => onEntrar({ ...selecionado, email })} style={[styles.button, { marginTop: 18 }]}><Text style={styles.buttonText}>Entrar no ambiente</Text></TouchableOpacity>
            <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 10, marginTop: 12 }}>Acesso acadêmico · sem autenticação real ou senha armazenada</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}