export function decomporTurma(turma) {
  const nome = typeof turma === 'string' ? turma : turma.nome;
  const match = nome.match(/^(\d+)\s*[º°]?\s*Ano\s+([A-Z])(?:\s*[·-]\s*(Manhã|Tarde))?$/i);
  return {
    ano: match ? match[1] : 'outras',
    secao: match ? match[2].trim().toUpperCase() : nome,
    turno: match?.[3] || (typeof turma === 'string' ? 'Manhã' : turma.turno || 'Manhã'),
  };
}
