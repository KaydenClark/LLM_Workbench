#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function runTeamCoordinationDemo() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'team-coordination-demo-'));
  try {
    const acceptedLanes = [
      { task: 'A', role: 'Engineer', touches: ['lanes/alpha.txt'] },
      { task: 'B', role: 'Engineer', touches: ['lanes/bravo.txt'] }
    ];
    assertDisjoint(acceptedLanes);

    const handoffs = acceptedLanes.map((lane) => {
      const target = path.join(fixture, lane.touches[0]);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, `${lane.task} completed in ${lane.touches[0]}\n`);
      return { task: lane.task, role: lane.role, proof: `${lane.touches[0]} exists` };
    });

    let overlap;
    try {
      assertDisjoint([...acceptedLanes, { task: 'C', role: 'Engineer', touches: ['lanes/alpha.txt'] }]);
      overlap = { status: 'accepted' };
    } catch (error) {
      overlap = { status: 'rejected', reason: error.message };
    }

    const checkpoint = path.join(fixture, 'captain-checkpoint.json');
    fs.writeFileSync(checkpoint, JSON.stringify({ handoffs, overlap }, null, 2));
    return {
      fixture,
      acceptedLanes,
      handoffs,
      overlap,
      primaryWriter: { role: 'Captain', consolidations: 1, checkpoint: 'captain-checkpoint.json' }
    };
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

export function assertDisjoint(lanes) {
  const owners = new Map();
  for (const lane of lanes) {
    if (!Array.isArray(lane.touches)) throw new Error(`${lane.task} must declare Touches`);
    for (const touched of lane.touches) {
      if (owners.has(touched)) throw new Error(`${lane.task} overlaps ${owners.get(touched)} on ${touched}; sequence it instead`);
      owners.set(touched, lane.task);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(runTeamCoordinationDemo(), null, 2));
}
