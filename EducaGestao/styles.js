import { StyleSheet } from 'react-native';

let temaAtivo = 'light';
const estilosPorTema = {};

const paletas = {
  light: {
    ink: '#172B4D', blue: '#246BCE', primary: '#246BCE', blueLight: '#E8F1FF', canvas: '#F3F6FA',
    white: '#FFFFFF', muted: '#718096', line: '#E4EAF1', green: '#17865B',
    greenLight: '#E7F5EE', red: '#C34848', redLight: '#FCECEC', amber: '#A96912',
    amberLight: '#FFF3DE', teal: '#168A91',
  },
  dark: {
    ink: '#E7EDF6', blue: '#78AEFF', primary: '#246BCE', blueLight: '#203654', canvas: '#111827',
    white: '#1B2535', muted: '#A0AEC0', line: '#344155', green: '#68C99A',
    greenLight: '#1D3A32', red: '#F28B8B', redLight: '#442B34', amber: '#F1BE72',
    amberLight: '#403527', teal: '#63C6CC',
  },
};

export function definirTema(tema) {
  temaAtivo = tema === 'dark' ? 'dark' : 'light';
}

export const colors = new Proxy({}, {
  get: (_, chave) => paletas[temaAtivo][chave],
});

function obterEstilos() {
  if (!estilosPorTema[temaAtivo]) {
    const palette = paletas[temaAtivo];
    estilosPorTema[temaAtivo] = StyleSheet.create({
      app: { flex: 1, backgroundColor: palette.canvas },
      shell: { flex: 1, width: '100%', maxWidth: 1180, alignSelf: 'center' },
      loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.canvas },
      loadingText: { marginTop: 14, color: palette.muted, fontSize: 14 },
      pageScroll: { flex: 1 },
      pageContent: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 34 },
      footer: { color: palette.muted, fontSize: 11, textAlign: 'center', marginTop: 28 },
      heading: { color: palette.ink, fontSize: 25, fontWeight: '800' },
      subheading: { color: palette.muted, fontSize: 13, marginTop: 5, marginBottom: 18 },
      sectionTitle: { color: palette.ink, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 20 },
      row: { flexDirection: 'row', alignItems: 'center' },
      wrap: { flexDirection: 'row', flexWrap: 'wrap' },
      card: { backgroundColor: palette.white, borderRadius: 12, borderWidth: 1, borderColor: palette.line, padding: 16, marginBottom: 12 },
      button: { minHeight: 42, borderRadius: 9, paddingHorizontal: 15, paddingVertical: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.primary },
      buttonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
      buttonSecondary: { backgroundColor: palette.blueLight },
      buttonSecondaryText: { color: palette.blue },
      buttonDanger: { backgroundColor: palette.redLight },
      buttonDangerText: { color: palette.red },
      fieldLabel: { color: palette.ink, fontWeight: '700', fontSize: 12, marginBottom: 6, marginTop: 10 },
      input: { backgroundColor: palette.white, borderColor: palette.line, borderWidth: 1, borderRadius: 8, minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, color: palette.ink, fontSize: 14 },
      chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: palette.canvas, marginRight: 7, marginBottom: 7, borderWidth: 1, borderColor: palette.line },
      chipText: { color: palette.muted, fontSize: 12, fontWeight: '600' },
      empty: { padding: 22, alignItems: 'center', backgroundColor: palette.white, borderRadius: 12, borderWidth: 1, borderColor: palette.line },
      emptyText: { color: palette.muted, fontSize: 13, textAlign: 'center' },
    });
  }
  return estilosPorTema[temaAtivo];
}

export const styles = new Proxy({}, {
  get: (_, nome) => obterEstilos()[nome],
});