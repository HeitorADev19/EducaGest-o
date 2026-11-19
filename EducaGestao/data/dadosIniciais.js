import { decomporTurma } from '../utils/turmas';

const hoje = new Date();
export const VERSAO_DADOS_INICIAIS = 11;
const dataRelativa = (dias) => {
  const data = new Date(hoje);
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
};

const professoresIniciais = [
  { id: 'p1', nome: 'Letícia Almeida', disciplina: 'Matemática' },
  { id: 'p2', nome: 'Marcos Vinícius', disciplina: 'Ciências' },
  { id: 'p3', nome: 'Renata Carvalho', disciplina: 'Língua Portuguesa' },
  { id: 'p4', nome: 'Juliana Nascimento', disciplina: 'História' },
  { id: 'p5', nome: 'Pedro Henrique', disciplina: 'Geografia' },
  { id: 'p6', nome: 'Camila Torres', disciplina: 'Arte' },
  { id: 'p7', nome: 'André Martins', disciplina: 'Educação Física' },
  { id: 'p8', nome: 'Sofia Oliveira', disciplina: 'Inglês' },
  { id: 'p9', nome: 'Gustavo Ferreira', disciplina: 'Tecnologia' },
  { id: 'p10', nome: 'Patrícia Costa', disciplina: 'Música' },
  { id: 'p11', nome: 'Rafael Mendes', disciplina: 'Educação Financeira' },
  { id: 'p12', nome: 'Beatriz Santos', disciplina: 'Projeto de Vida' },
  { id: 'p13', nome: 'Clara Souza', disciplina: 'Filosofia' },
  { id: 'p14', nome: 'Diego Carvalho', disciplina: 'Literatura' },
  { id: 'p15', nome: 'Fernanda Rocha', disciplina: 'Robótica' },
  { id: 'p16', nome: 'Lucas Barros', disciplina: 'Espanhol' },
  { id: 'p17', nome: 'Mariana Freitas', disciplina: 'Educação Socioemocional' },
  { id: 'p18', nome: 'Thiago Nascimento', disciplina: 'Ciências Ambientais' },
];

const turmasBase = [
  { id: 't1', nome: '5º Ano A', turno: 'Manhã' },
  { id: 't2', nome: '4º Ano B', turno: 'Tarde' },
  { id: 't3', nome: '1º Ano A', turno: 'Manhã' },
  { id: 't4', nome: '1º Ano B', turno: 'Tarde' },
  { id: 't5', nome: '2º Ano A', turno: 'Manhã' },
  { id: 't6', nome: '2º Ano B', turno: 'Tarde' },
  { id: 't7', nome: '3º Ano A', turno: 'Manhã' },
  { id: 't8', nome: '3º Ano B', turno: 'Tarde' },
  { id: 't9', nome: '4º Ano A', turno: 'Manhã' },
  { id: 't10', nome: '5º Ano B', turno: 'Tarde' },
  { id: 't11', nome: '6º Ano A', turno: 'Manhã' },
  { id: 't12', nome: '6º Ano B', turno: 'Tarde' },
  { id: 't13', nome: '7º Ano A', turno: 'Manhã' },
  { id: 't14', nome: '7º Ano B', turno: 'Tarde' },
  { id: 't15', nome: '8º Ano A', turno: 'Manhã' },
  { id: 't16', nome: '8º Ano B', turno: 'Tarde' },
  { id: 't17', nome: '9º Ano A', turno: 'Manhã' },
  { id: 't18', nome: '9º Ano B', turno: 'Tarde' },
];

const turmasIniciais = turmasBase.flatMap((turma) => {
  const outroTurno = turma.turno === 'Manhã' ? 'Tarde' : 'Manhã';
  return [
    { ...turma },
    { id: `${turma.id}-${outroTurno.toLowerCase()}`, nome: `${turma.nome} · ${outroTurno}`, turno: outroTurno },
  ];
});

const horariosPorTurno = {
  Manhã: ['08:00', '09:00', '10:00', '11:00'],
  Tarde: ['13:00', '14:00', '15:00', '16:00'],
};

// A rotação distribui as aulas nos cinco dias e evita choques de docente ou turma.
const criarHorariosAula = () => Object.entries(horariosPorTurno).flatMap(([turno, horarios]) => {
  const turmasDoTurno = turmasIniciais
    .filter((turma) => turma.turno === turno)
    .sort((a, b) => {
      const partesA = decomporTurma(a);
      const partesB = decomporTurma(b);
      return Number(partesA.ano) - Number(partesB.ano)
        || partesA.secao.localeCompare(partesB.secao, 'pt-BR');
    });
  return turmasDoTurno.flatMap((turma, indiceTurma) => professoresIniciais.map((professor, indiceProfessor) => {
    const indiceHorarioSemanal = (indiceTurma + indiceProfessor) % (5 * horarios.length);
    const diaSemana = Math.floor(indiceHorarioSemanal / horarios.length) + 1;
    const indicePeriodo = indiceHorarioSemanal % horarios.length;
    return {
      id: `ha-${turma.id}-${professor.id}`,
      diaSemana,
      horario: horarios[indicePeriodo],
      professor: professor.nome,
      turma: turma.nome,
      turno,
      disciplina: professor.disciplina,
    };
  }));
});

const criarPlanejamentosCompletos = () => turmasIniciais.map((turma, indiceTurma) => {
  const professor = professoresIniciais[indiceTurma % professoresIniciais.length];
  const partes = decomporTurma(turma);
  const status = indiceTurma % 3 === 0 ? 'Pendente' : indiceTurma % 3 === 1 ? 'Enviado' : 'Aprovado';
  return {
    id: `pl-completo-${turma.id}`,
    professor: professor.nome,
    turma: turma.nome,
    disciplina: professor.disciplina,
    data: dataRelativa(indiceTurma % 10 - 2),
    horario: horariosPorTurno[turma.turno][indiceTurma % horariosPorTurno[turma.turno].length],
    conteudo: `Conteúdos essenciais de ${professor.disciplina}`,
    objetivos: `Desenvolver habilidades previstas para o ${partes.ano}º Ano em ${professor.disciplina}.`,
    metodologia: 'Aula expositiva dialogada, atividade prática e acompanhamento coletivo.',
    recursosDidaticos: turma.turno === 'Manhã' ? 'Quadro, caderno e projetor' : 'Quadro, caderno e materiais impressos',
    sala: turma.turno === 'Manhã' ? 'Sala 5A' : 'Sala 4B',
    observacoes: '',
    status,
  };
});

const alunosExistentes = [
  { id: 'a1', nome: 'Ana Beatriz Lima', matricula: 'EG-25001', turma: '5º Ano A' },
  { id: 'a2', nome: 'Bruno Henrique Alves', matricula: 'EG-25002', turma: '5º Ano A' },
  { id: 'a3', nome: 'Camila Souza Rocha', matricula: 'EG-25003', turma: '5º Ano A' },
  { id: 'a4', nome: 'Daniel Miguel Santos', matricula: 'EG-25004', turma: '5º Ano A' },
  { id: 'a5', nome: 'Elisa Martins Costa', matricula: 'EG-25005', turma: '5º Ano A' },
  { id: 'a6', nome: 'Felipe Oliveira Nunes', matricula: 'EG-25006', turma: '5º Ano A' },
  { id: 'a7', nome: 'Gabriela Ferreira Dias', matricula: 'EG-25007', turma: '4º Ano B' },
  { id: 'a8', nome: 'Heitor Ribeiro Melo', matricula: 'EG-25008', turma: '4º Ano B' },
];
const primeirosNomesAlunos = [
  'Alice', 'Arthur', 'Bianca', 'Caio', 'Davi', 'Eduarda', 'Felipe', 'Giovana',
  'Heitor', 'Isabela', 'João', 'Laura', 'Miguel', 'Nina', 'Otávio', 'Paula',
  'Rafael', 'Sofia',
];
const sobrenomesAlunos = [
  'Almeida', 'Barbosa', 'Cardoso', 'Dias', 'Esteves', 'Ferreira', 'Gomes',
  'Henrique', 'Jardim', 'Lima', 'Mendes', 'Nogueira', 'Oliveira', 'Pereira',
  'Queiroz', 'Ramos', 'Santos', 'Teixeira', 'Vieira',
];
const criarAlunosIniciais = () => [
  ...alunosExistentes,
  ...turmasIniciais.flatMap((turma, indiceTurma) => {
    const quantidadeExistente = alunosExistentes.filter((aluno) => aluno.turma === turma.nome).length;
    return Array.from({ length: Math.max(0, 6 - quantidadeExistente) }, (_, indice) => {
      const numero = quantidadeExistente + indice + 1;
      const indiceNome = indiceTurma * 6 + numero - 1;
      return {
        id: `al-${turma.id}-${numero}`,
        nome: `${primeirosNomesAlunos[indiceNome % primeirosNomesAlunos.length]} ${sobrenomesAlunos[Math.floor(indiceNome / primeirosNomesAlunos.length) % sobrenomesAlunos.length]}`,
        matricula: `EG-${String(30001 + indiceNome).padStart(5, '0')}`,
        turma: turma.nome,
      };
    });
  }),
];

export const criarDadosIniciais = () => ({
  versaoDadosIniciais: VERSAO_DADOS_INICIAIS,
  alunos: criarAlunosIniciais(),
  professores: professoresIniciais.map((professor) => ({ ...professor })),
  turmas: turmasIniciais.map((turma) => ({ ...turma })),
  disciplinas: [
    'Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia', 'Arte',
    'Educação Física', 'Inglês', 'Tecnologia', 'Música', 'Educação Financeira', 'Projeto de Vida',
    'Filosofia', 'Literatura', 'Robótica', 'Espanhol', 'Educação Socioemocional', 'Ciências Ambientais',
  ],
  salas: ['Sala 5A', 'Sala 4B', 'Laboratório de informática'],
  equipamentos: ['Projetor', 'Caixa de som'],
  recursos: ['Projetor', 'Laboratório de informática', 'Sala multimídia', 'Caixa de som', 'Biblioteca', 'Materiais pedagógicos'],
  planejamentos: [
    { id: 'pl1', professor: 'Letícia Almeida', turma: '5º Ano A', disciplina: 'Matemática', data: dataRelativa(2), horario: '09:00', conteudo: 'Frações no cotidiano', objetivos: 'Comparar frações e resolver situações-problema.', metodologia: 'Resolução colaborativa com representação visual.', recursosDidaticos: 'Cartazes, caderno e projetor', sala: 'Sala 5A', observacoes: 'Plano demonstrativo para a apresentação.', status: 'Pendente' },
    { id: 'pl2', professor: 'Marcos Vinícius', turma: '4º Ano B', disciplina: 'Ciências', data: dataRelativa(1), horario: '10:00', conteudo: 'Ciclo da água', objetivos: 'Reconhecer etapas do ciclo da água.', metodologia: 'Experimento guiado e conversa coletiva.', recursosDidaticos: 'Imagens e recipiente transparente', sala: 'Sala 4B', observacoes: '', status: 'Aprovado' },
    { id: 'pl3', professor: 'Renata Carvalho', turma: '5º Ano A', disciplina: 'Língua Portuguesa', data: dataRelativa(-2), horario: '08:00', conteudo: 'Leitura e compreensão', objetivos: 'Identificar informações explícitas em um texto.', metodologia: 'Leitura compartilhada.', recursosDidaticos: 'Livro de leitura', sala: 'Sala 5A', observacoes: '', status: 'Enviado' },
    { id: 'pl4', professor: 'Juliana Nascimento', turma: '4º Ano B', disciplina: 'História', data: dataRelativa(3), horario: '11:00', conteudo: 'Memórias da comunidade', objetivos: 'Reconhecer diferentes fontes de memória local.', metodologia: 'Roda de conversa e análise de fotografias.', recursosDidaticos: 'Fotografias e caderno', sala: 'Sala 4B', observacoes: '', status: 'Aprovado' },
    { id: 'pl5', professor: 'Pedro Henrique', turma: '5º Ano A', disciplina: 'Geografia', data: dataRelativa(5), horario: '13:30', conteudo: 'Paisagens e transformações', objetivos: 'Identificar mudanças nas paisagens ao longo do tempo.', metodologia: 'Observação de imagens e atividade em grupo.', recursosDidaticos: 'Mapas e imagens', sala: 'Sala 5A', observacoes: '', status: 'Aprovado' },
    { id: 'pl6', professor: 'Camila Torres', turma: '4º Ano B', disciplina: 'Arte', data: dataRelativa(7), horario: '14:00', conteudo: 'Cores e formas', objetivos: 'Experimentar composições com cores e formas geométricas.', metodologia: 'Criação artística individual e apreciação coletiva.', recursosDidaticos: 'Papel, lápis de cor e formas recortadas', sala: 'Sala 4B', observacoes: '', status: 'Aprovado' },
    ...criarPlanejamentosCompletos(),
  ],
  horariosAula: criarHorariosAula(),
  frequencias: [], diario: [],
  eventos: [
    { id: 'e1', titulo: 'Reunião pedagógica', data: dataRelativa(4), tipo: 'Reunião', descricao: 'Encontro mensal da equipe escolar.' },
    { id: 'e2', titulo: 'Feira de leitura', data: dataRelativa(9), tipo: 'Evento', descricao: 'Atividade de integração das turmas.' },
  ],
  reservas: [{ id: 'r1', recurso: 'Projetor', data: dataRelativa(2), horario: '09:00', turma: '5º Ano A', finalidade: 'Aula de Matemática: frações no cotidiano', solicitante: 'Letícia Almeida', status: 'Pendente', justificativa: '' }],
});