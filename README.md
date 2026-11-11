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

### Como consultar e alterar os dados locais

O arquivo do banco se chama `educagestao.db`. No momento, o app tem uma tabela,
`estado_aplicacao`, e mantém o conjunto inteiro de dados da escola na coluna
`dados_json` da linha cujo `id` é `1`. Isso significa que os registros (alunos,
turmas, chamadas etc.) são campos de um documento JSON, não tabelas separadas.
O app salva esse documento novamente quando os dados mudam.

No terminal `sqlite3`, liste as tabelas com:

```sql
.tables
```

No terminal `sqlite3` ou no editor SQL do **DB Browser for SQLite**, consulte os
dados com:

```sql
SELECT id, atualizado_em, json_valid(dados_json) AS json_valido
FROM estado_aplicacao;
SELECT json_extract(dados_json, '$.alunos[0].nome') AS primeiro_aluno
FROM estado_aplicacao;
```

Uma alteração pequena em uma propriedade pode ser feita com a extensão JSON do
SQLite:

```sql
UPDATE estado_aplicacao
SET dados_json = json_set(dados_json, '$.alunos[0].turma', '4º Ano B'),
    atualizado_em = datetime('now')
WHERE id = 1 AND json_valid(dados_json);
```

Antes de editar:

1. Faça uma cópia do arquivo `educagestao.db`.
2. Feche o app para que uma versão antiga dos dados em memória não grave por
   cima da sua alteração.
3. Execute a alteração e confira o resultado com `SELECT` e `json_valid`.
4. Abra o app e confirme os dados. Faça as alterações em cópia de teste quando
   os dados forem importantes.

O caminho do arquivo depende da plataforma: Android e iOS guardam o banco no
armazenamento privado do app; no navegador, o `expo-sqlite` usa armazenamento
local do próprio navegador, não um arquivo `.db` visível na pasta do projeto.
Por isso, o comando SQL acima se aplica depois de abrir/exportar uma cópia
acessível do banco. Não edite o arquivo enquanto o app estiver aberto.

Para mudar os dados pelo próprio código, prefira a camada existente
`EducaGestao/services/armazenamento.js`: carregue os dados com `carregarDados`,
altere a propriedade necessária e salve com `salvarDados`. Por exemplo:

```js
const dados = await carregarDados();
dados.alunos[0].turma = '4º Ano B';
await salvarDados(dados);
```

Use esse caminho em vez de reescrever `dados_json` manualmente quando puder: o
app mantém fila de gravação e os parâmetros SQL protegem os dados contra erros
de formatação. Como os dados ainda estão todos dentro de um JSON, para consultas
e alterações frequentes por SQL é recomendável migrar cada entidade para tabelas
próprias (por exemplo, `alunos`, `turmas` e `frequencias`).

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
