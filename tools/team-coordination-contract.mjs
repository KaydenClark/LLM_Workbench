const requirements = [
  ['manager', /Captain/i, 'manager must route work through Captain coordination'],
  ['manager', /exactly one approved role\s+contract/i, 'manager must require exactly one role contract per task'],
  ['manager', /No two open tasks may edit the same files/i, 'manager must require disjoint durable write lanes'],
  ['manager', /primary writer/i, 'manager must reserve one primary durable writer'],
  ['readme', /only ticket and proof store/i, 'README must make the stable spec the only ticket and proof store'],
  ['readme', /generated read-only projection/i, 'README must describe the project TASKBOARD.md as a generated read-only projection'],
  ['subagent', /Scout and Auditor tasks are read-only/i, 'SUBAGENT must keep Scout and Auditor read-only'],
  ['subagent', /Do not combine role authorities/i, 'SUBAGENT must prohibit combined role authority'],
  ['subagent', /Never write to the owning spec, the generated `TASKBOARD\.md` projection/i, 'SUBAGENT must prohibit writes to the owning spec and generated projection'],
  ['taskboard', /Disposable coordination notes/i, 'run notes must be disposable rather than a durable Taskboard']
];

export function inspectTeamCoordination(templates) {
  const errors = [];
  for (const [file, pattern, message] of requirements) {
    if (!pattern.test(templates[file] ?? '')) errors.push(message);
  }
  if (/^## Proof log\b/im.test(templates.taskboard ?? '')) errors.push('run notes must not contain a proof log');
  if (/root `TASKBOARD\.md` proof log|subagents append proof|\btranscribe(?:s|d)?\b/i.test(Object.values(templates).join('\n'))) {
    errors.push('retired duplicate-board/proof-log language returned');
  }
  return errors;
}
