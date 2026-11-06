const hoje = new Date();
const dataRelativa = (dias) => {
  const data = new Date(hoje);
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
};

export const criarDadosIniciais = () => ({
  alunos: [
    { id: 'a1', nome: 'Ana Beatriz Lima', matricula: 'EG-25001', turma: '5º Ano A' },
    { id: 'a2', nome: 'Bruno Henrique Alves', matricula: 'EG-25002', turma: '5º Ano A' },
    { id: 'a3', nome: 'Camila Souza Rocha', matricula: 'EG-25003', turma: '5º Ano A' },
    { id: 'a4', nome: 'Daniel Miguel Santos', matricula: 'EG-25004', turma: '5º Ano A' },
    { id: 'a5', nome: 'Elisa Martins Costa', matricula: 'EG-25005', turma: '5º Ano A' },
    { id: 'a6', nome: 'Felipe Oliveira Nunes', matricula: 'EG-25006', turma: '5º Ano A' },
    { id: 'a7', nome: 'Gabriela Ferreira Dias', matricula: 'EG-25007', turma: '4º Ano B' },
    { id: 'a8', nome: 'Heitor Ribeiro Melo', matricula: 'EG-25008', turma: '4º Ano B' },
  ],
  professores: [
    { id: 'p1', nome: 'Letícia Almeida', disciplina: 'Matemática' },
    { id: 'p2', nome: 'Marcos Vinícius', disciplina: 'Ciências' },
    { id: 'p3', nome: 'Renata Carvalho', disciplina: 'Língua Portuguesa' },
  ],
  turmas: [{ id: 't1', nome: '5º Ano A' }, { id: 't2', nome: '4º Ano B' }],
  disciplinas: ['Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia', 'Arte'],
  salas: ['Sala 5A', 'Sala 4B', 'Laboratório de informática'],
  equipamentos: ['Projetor', 'Caixa de som'],
  recursos: ['Projetor', 'Laboratório de informática', 'Sala multimídia', 'Caixa de som', 'Biblioteca', 'Materiais pedagógicos'],
  planejamentos: [
    { id: 'pl1', professor: 'Letícia Almeida', turma: '5º Ano A', disciplina: 'Matemática', data: dataRelativa(2), horario: '09:00', conteudo: 'Frações no cotidiano', objetivos: 'Comparar frações e resolver situações-problema.', metodologia: 'Resolução colaborativa com representação visual.', recursosDidaticos: 'Cartazes, caderno e projetor', sala: 'Sala 5A', observacoes: 'Plano demonstrativo para a apresentação.', status: 'Pendente' },
    { id: 'pl2', professor: 'Marcos Vinícius', turma: '4º Ano B', disciplina: 'Ciências', data: dataRelativa(1), horario: '10:00', conteudo: 'Ciclo da água', objetivos: 'Reconhecer etapas do ciclo da água.', metodologia: 'Experimento guiado e conversa coletiva.', recursosDidaticos: 'Imagens e recipiente transparente', sala: 'Sala 4B', observacoes: '', status: 'Aprovado' },
    { id: 'pl3', professor: 'Renata Carvalho', turma: '5º Ano A', disciplina: 'Língua Portuguesa', data: dataRelativa(-2), horario: '08:00', conteudo: 'Leitura e compreensão', objetivos: 'Identificar informações explícitas em um texto.', metodologia: 'Leitura compartilhada.', recursosDidaticos: 'Livro de leitura', sala: 'Sala 5A', observacoes: '', status: 'Enviado' },
  ],
  frequencias: [], diario: [],
  eventos: [
    { id: 'e1', titulo: 'Reunião pedagógica', data: dataRelativa(4), tipo: 'Reunião', descricao: 'Encontro mensal da equipe escolar.' },
    { id: 'e2', titulo: 'Feira de leitura', data: dataRelativa(9), tipo: 'Evento', descricao: 'Atividade de integração das turmas.' },
  ],
  reservas: [{ id: 'r1', recurso: 'Projetor', data: dataRelativa(2), horario: '09:00', turma: '5º Ano A', finalidade: 'Aula de Matemática: frações no cotidiano', solicitante: 'Letícia Almeida', status: 'Pendente', justificativa: '' }],
});