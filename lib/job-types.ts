export type JobStep = 'analyze' | 'copy' | 'sections' | 'publish';
export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export const STEP_LABELS: Record<JobStep, string> = {
  analyze: 'Analyzing business',
  copy: 'Drafting copy',
  sections: 'Composing sections',
  publish: 'Publishing preview',
};
