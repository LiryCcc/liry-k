#!/usr/bin/env node --experimental-strip-types

const REPO = 'liryccc/liry-k';

interface Step {
  name: string;
  number: number;
  status: 'completed' | 'in_progress' | 'queued';
  conclusion: string | null;
}

interface Job {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  html_url: string;
  steps: Step[];
}

const fetchJobs = async (runId: number): Promise<Job[]> => {
  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/runs/${runId}/jobs`);
  const data = (await res.json()) as { jobs: Job[] };
  return data.jobs;
};

interface LogLine {
  timestamp: number;
  lineNumber: number;
  text: string;
}

/**
 * 下载 job 日志需要 admin 权限。
 * 作为替代，通过 GitHub checks API 拉取步骤 annotations。
 */
const fetchAnnotations = async (job: Job): Promise<string> => {
  // checks API 的 annotations 对所有人公开
  const logsUrl = `https://api.github.com/repos/${REPO}/check-runs?status=completed`;
  // 此接口有限，无法精确匹配到失败步骤的详细输出
  return `Job ${job.id} - ${job.name} (${job.conclusion}):\n  See full log at ${job.html_url}`;
};

const runId = Number(process.argv[2]);
if (!runId) {
  console.log('Usage: node ci-log.ts <run-id>\n\nRun "node ci-info.ts" to list recent runs.');
  process.exit(1);
}

console.log(`Fetching jobs for run ${runId}...`);
const jobs = await fetchJobs(runId);

for (const job of jobs) {
  const failMarker = job.conclusion === 'failure' ? ' ❌' : job.conclusion === 'success' ? ' ✅' : ' ⏳';
  console.log(`\n=== ${job.name} (${job.conclusion})${failMarker} ===`);
  console.log(`URL: ${job.html_url}`);

  for (const step of job.steps ?? []) {
    const marker = step.conclusion === 'failure' ? ' ❌' : step.conclusion === 'success' ? ' ✅' : ' ⏳';
    console.log(`  [${String(step.number).padStart(2)}] ${step.name}: ${step.conclusion ?? 'running'}${marker}`);
  }
}

console.log(`\nFull logs: https://github.com/${REPO}/actions/runs/${runId}`);
