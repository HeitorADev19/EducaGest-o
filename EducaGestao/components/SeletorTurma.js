import { useEffect, useState } from 'react';
import { SeletorCompacto } from './SeletorCompacto';
import { decomporTurma } from '../utils/turmas';

export function SeletorTurma({ turmas, value, onChange }) {
  const selecionada = turmas.find((turma) => turma.nome === value);
  const [selecao, setSelecao] = useState(() => selecionada ? decomporTurma(selecionada) : null);

  useEffect(() => {
    setSelecao(selecionada ? decomporTurma(selecionada) : null);
  }, [value, turmas]);

  const anos = [...new Set(turmas.map((turma) => decomporTurma(turma).ano))]
    .sort((a, b) => a === 'outras' ? 1 : b === 'outras' ? -1 : Number(a) - Number(b));
  const opcoesAno = anos.map((ano) => ({ label: ano === 'outras' ? 'Outras' : `${ano}º Ano`, value: ano }));
  const opcoesSecao = [...new Set(turmas
    .filter((turma) => !selecao || decomporTurma(turma).ano === selecao.ano)
    .map((turma) => decomporTurma(turma).secao))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map((secao) => ({ label: secao, value: secao }));
  const opcoesTurno = [...new Set(turmas
    .filter((turma) => !selecao || decomporTurma(turma).ano === selecao.ano)
    .map((turma) => decomporTurma(turma).turno))]
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((turno) => ({ label: turno, value: turno }));

  const selecionar = (campo, valor) => {
    const atual = selecao || { ano: '', secao: '', turno: '' };
    const candidata = turmas
      .filter((turma) => decomporTurma(turma)[campo] === valor)
      .sort((a, b) => {
        const dadosA = decomporTurma(a);
        const dadosB = decomporTurma(b);
        const pontuacaoA = ['ano', 'secao', 'turno'].filter((item) => item !== campo && dadosA[item] === atual[item]).length;
        const pontuacaoB = ['ano', 'secao', 'turno'].filter((item) => item !== campo && dadosB[item] === atual[item]).length;
        return pontuacaoB - pontuacaoA || a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true });
      })[0];
    if (!candidata) return;
    setSelecao(decomporTurma(candidata));
    onChange(candidata.nome);
  };

  return (
    <>
      <SeletorCompacto label="Ano" value={selecao?.ano || ''} opcoes={opcoesAno} placeholder="Selecionar ano" onChange={(valor) => selecionar('ano', valor)} />
      <SeletorCompacto label="Turma" value={selecao?.secao || ''} opcoes={opcoesSecao} placeholder="Selecionar turma" onChange={(valor) => selecionar('secao', valor)} />
      <SeletorCompacto label="Turno" value={selecao?.turno || ''} opcoes={opcoesTurno} placeholder="Selecionar turno" onChange={(valor) => selecionar('turno', valor)} />
    </>
  );
}
