import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { carregarDados, salvarDados } from './services/armazenamento';
import { Cabecalho } from './components/Cabecalho';
import { Menu } from './components/Menu';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { Planejamento } from './screens/Planejamento';
import { Frequencia } from './screens/Frequencia';
import { DiarioClasse } from './screens/DiarioClasse';
import { Calendario } from './screens/Calendario';
import { Reservas } from './screens/Reservas';
import { Cadastros } from './screens/Cadastros';
import { Coordenacao } from './screens/Coordenacao';
import { Relatorios } from './screens/Relatorios';
import { styles, colors } from './styles';

const telasPorPerfil = {
  Professor: ['Painel', 'Planejamento', 'Frequência', 'Diário', 'Calendário', 'Reservas'],
  Coordenador: ['Painel', 'Coordenação', 'Planejamento', 'Frequência', 'Diário', 'Calendário', 'Reservas', 'Relatórios'],
  Gestor: ['Painel', 'Coordenação', 'Planejamento', 'Frequência', 'Diário', 'Calendário', 'Reservas', 'Cadastros', 'Relatórios'],
};

export default function App() {
  const [dados, setDados] = useState(null);
  const [erroBanco, setErroBanco] = useState(null);
  const [erroSalvamento, setErroSalvamento] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [tela, setTela] = useState('Painel');

  useEffect(() => {
    let ativo = true;
    setErroBanco(null);
    carregarDados()
      .then((resultado) => { if (ativo) setDados(resultado); })
      .catch((erro) => { if (ativo) setErroBanco(erro); });
    return () => { ativo = false; };
  }, [tentativa]);

  useEffect(() => {
    if (!dados) return;
    salvarDados(dados)
      .then(() => setErroSalvamento(null))
      .catch((erro) => setErroSalvamento(erro));
  }, [dados]);

  if (!dados) {
    return (
      <SafeAreaView style={styles.loading}>
        {erroBanco ? (
          <>
            <Text style={styles.heading}>Não foi possível abrir os dados locais</Text>
            <Text style={styles.loadingText}>{erroBanco.message}</Text>
            <TouchableOpacity onPress={() => setTentativa((valor) => valor + 1)} style={styles.button}>
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color={colors.blue} />
            <Text style={styles.loadingText}>Preparando seu ambiente escolar...</Text>
          </>
        )}
      </SafeAreaView>
    );
  }

  if (!usuario) {
    return <Login onEntrar={(perfil) => { setUsuario(perfil); setTela('Painel'); }} />;
  }

  const atualizar = (chave, transformacao) => {
    setDados((atual) => ({
      ...atual,
      [chave]: typeof transformacao === 'function' ? transformacao(atual[chave] || []) : transformacao,
    }));
  };

  const sair = () => { setUsuario(null); setTela('Painel'); };
  const props = { dados, usuario, atualizar, onIrPara: setTela };
  let conteudo;

  switch (tela) {
    case 'Planejamento': conteudo = <Planejamento {...props} />; break;
    case 'Frequência': conteudo = <Frequencia {...props} />; break;
    case 'Diário': conteudo = <DiarioClasse {...props} />; break;
    case 'Calendário': conteudo = <Calendario {...props} />; break;
    case 'Reservas': conteudo = <Reservas {...props} />; break;
    case 'Cadastros': conteudo = <Cadastros {...props} />; break;
    case 'Coordenação': conteudo = <Coordenacao {...props} />; break;
    case 'Relatórios': conteudo = <Relatorios {...props} />; break;
    default: conteudo = <Dashboard {...props} />;
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.canvas} />
      <View style={styles.shell}>
        <Cabecalho usuario={usuario} onSair={sair} />
        <Menu telas={telasPorPerfil[usuario.perfil] || telasPorPerfil.Professor} ativa={tela} onSelecionar={setTela} />
        {erroSalvamento && <Text accessibilityRole="alert" style={{ color: colors.red, paddingHorizontal: 22, paddingTop: 12 }}>Não foi possível salvar neste dispositivo: {erroSalvamento.message}</Text>}
        <ScrollView style={styles.pageScroll} contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">
          {conteudo}
          <Text style={styles.footer}>EducaGestão · Dados locais neste dispositivo · Ambiente demonstrativo</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
