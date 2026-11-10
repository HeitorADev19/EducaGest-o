# EducaGestão

Sistema escolar multiplataforma para organizar a rotina pedagógica e acompanhar a
trajetória dos estudantes. O app usa Expo/React Native e pode rodar em Android,
iOS e web.

## Objetivo

Reduzir tarefas manuais e informações espalhadas, dando à equipe escolar uma
visão clara do que acontece em cada turma e do que precisa de acompanhamento.

## Principais necessidades

- **Acompanhamento pedagógico:** reunir notas parciais e bimestrais por aluno,
  turma e disciplina. O painel deve destacar dificuldades e aptidões com base
  em avaliações registradas, sem substituir a análise do professor.
- **Relatórios:** gerar relatórios por período, turma, disciplina e estudante,
  com dados de notas, frequência, aulas e ocorrências; permitir exportação e
  impressão.
- **Rotina de aulas:** organizar horários, planejamentos, diário de classe,
  projetos, eventos e confraternizações futuras; sinalizar conflitos de horário
  e de recursos.
- **Frequência e turmas:** fazer chamada por aula, manter histórico de presença
  e justificativas e consultar a relação atual de alunos por turma.
- **Acompanhamento de ocorrências:** registrar advertências com data, motivo,
  responsável e providências, preservando o histórico e o acesso restrito.
- **Recursos escolares:** reservar salas e equipamentos e acompanhar
  solicitações e aprovações.
- **Comunicação e acompanhamento:** organizar encaminhamentos e retornos à
  família, além de alertas sobre faltas frequentes, queda de desempenho e
  pendências.
- **Integração:** planejar a sincronização com o SYSEDU.BR mediante acesso à
  documentação e a uma API autorizada; não presumir acesso por automação de
  telas.

## Módulos previstos

1. Painel pedagógico com indicadores e alertas acionáveis.
2. Cadastros de estudantes, responsáveis, equipe, turmas, disciplinas e salas.
3. Horários, planejamentos, diário e calendário escolar.
4. Chamada, justificativas e histórico de frequência.
5. Avaliações, notas parciais e bimestrais e evolução por disciplina.
6. Advertências, encaminhamentos e histórico de acompanhamento.
7. Projetos, eventos, reservas e relatórios exportáveis.
8. Administração de usuários, permissões, cópias de segurança e integrações.

## Dados e banco de dados

O app usa **SQLite local** por meio do `expo-sqlite`, compatível com Android,
iOS e web. Os dados ficam no dispositivo ou navegador em que foram cadastrados;
essa configuração permite uso local, mas **não sincroniza automaticamente
aparelhos diferentes**. No navegador, os dados ficam vinculados à origem e ao
perfil do navegador.

Na primeira abertura após a atualização, os dados existentes no AsyncStorage
são migrados para o SQLite local. Não limpe os dados do aplicativo ou do
navegador antes de abrir a versão atualizada e confirmar a migração.

Para uso institucional compartilhado, acesso por vários usuários e sincronização
entre site e aplicativo, a evolução recomendada é uma API autenticada com banco
PostgreSQL central e sincronização controlada. Isso é uma etapa futura: o
projeto ainda não inclui servidor, contas reais, backup remoto nem integração
com o SYSEDU.BR. A hospedagem da versão web deve disponibilizar os cabeçalhos
`Cross-Origin-Embedder-Policy: credentialless` e
`Cross-Origin-Opener-Policy: same-origin` exigidos pelo SQLite no navegador.

## Privacidade e confiabilidade

Como o sistema pode conter dados de crianças e adolescentes, uma versão de
produção deve implementar controle de acesso por função, autenticação,
minimização de dados, trilha de auditoria, política de retenção e cópias de
segurança, em conformidade com a LGPD. Notas e alertas devem apoiar, e não
automatizar, decisões pedagógicas ou disciplinares.

## Estado atual

O protótipo já oferece painel, cadastros, planejamentos, frequência, diário,
calendário, reservas, coordenação e relatórios com dados demonstrativos locais.
Notas, advertências, relatórios exportáveis, integração com o SYSEDU.BR,
autenticação e sincronização entre dispositivos ainda precisam ser
implementados.

## Executar

```bash
cd EducaGestao
npm install
npm run start
```

Para executar no navegador:

```bash
npm run web
```
