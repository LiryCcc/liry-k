#!/usr/bin/env node --experimental-strip-types

const REPO = 'liryccc/liry-k';
const PER_PAGE = 10;

interface WorkflowRun {
  id: number;
  run_number: number;
  status: string;
  conclusion: string | null;
  event: string;
  display_title: string;
  head_branch: string;
  html_url: string;
  created_at: string;
}

const fetchRuns = async (limit: number): Promise<WorkflowRun[]> => {
  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/runs?per_page=${limit}&branch=main`);
  const data = (await res.json()) as { workflow_runs: WorkflowRun[] };
  return data.workflow_runs;
};

const runs = await fetchRuns(PER_PAGE);

if (runs.length === 0) {
  console.log('No CI runs found.');
  process.exit(0);
}

const PAD_ID = 10;
const PAD_RUN = 6;
const PAD_CONCLUSION = 12;
const PAD_EVENT = 6;

console.log(
  `${'RUN ID'.padEnd(PAD_ID)} ${'#'.padEnd(PAD_RUN)} ${'CONCLUSION'.padEnd(PAD_CONCLUSION)} ${'EVENT'.padEnd(PAD_EVENT)} TITLE`
);
console.log('─'.repeat(90));

for (const r of runs) {
  const conclusion = (r.conclusion ?? r.status).toUpperCase();
  const icon = conclusion === 'SUCCESS' ? '✅' : conclusion === 'FAILURE' ? '❌' : '⏳';
  console.log(
    `${String(r.id).padEnd(PAD_ID)} ${String(r.run_number).padEnd(PAD_RUN)} ${icon} ${conclusion.padEnd(PAD_CONCLUSION - 2)} ${r.event.padEnd(PAD_EVENT)} ${r.display_title}`
  );
}

console.log();
console.log(`Use "node ci-log.ts <run-id>" to fetch logs for a specific run.`);
