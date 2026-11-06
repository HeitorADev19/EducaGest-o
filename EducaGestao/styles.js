import { StyleSheet } from 'react-native';

export const colors = {
  ink: '#172B4D', blue: '#246BCE', blueLight: '#E8F1FF', canvas: '#F3F6FA',
  white: '#FFFFFF', muted: '#718096', line: '#E4EAF1', green: '#17865B',
  greenLight: '#E7F5EE', red: '#C34848', redLight: '#FCECEC', amber: '#A96912',
  amberLight: '#FFF3DE', teal: '#168A91',
};

export const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.canvas },
  shell: { flex: 1, width: '100%', maxWidth: 1180, alignSelf: 'center' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  loadingText: { marginTop: 14, color: colors.muted, fontSize: 14 },
  pageScroll: { flex: 1 },
  pageContent: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 34 },
  footer: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 28 },
  heading: { color: colors.ink, fontSize: 25, fontWeight: '800' },
  subheading: { color: colors.muted, fontSize: 13, marginTop: 5, marginBottom: 18 },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 16, marginBottom: 12 },
  button: { minHeight: 42, borderRadius: 9, paddingHorizontal: 15, paddingVertical: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  buttonText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  buttonSecondary: { backgroundColor: colors.blueLight },
  buttonSecondaryText: { color: colors.blue },
  buttonDanger: { backgroundColor: colors.redLight },
  buttonDangerText: { color: colors.red },
  fieldLabel: { color: colors.ink, fontWeight: '700', fontSize: 12, marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 8, minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, color: colors.ink, fontSize: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.canvas, marginRight: 7, marginBottom: 7, borderWidth: 1, borderColor: colors.line },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  empty: { padding: 22, alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.line },
  emptyText: { color: colors.muted, fontSize: 13, textAlign: 'center' },
});