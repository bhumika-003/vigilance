export type WeakLink = 'source' | 'methodology' | 'sample' | 'motive' | 'timing' | 'context'

export type QuestionOption = {
  text: string
  targetsWeakLink: boolean
  rulingText: string
}

export type CaseData = {
  id: string
  caseNumber: number
  claimText: string
  weakLink: WeakLink
  questionOptions: QuestionOption[]
  startingConfidence: number
  resolvedConfidence: number
}

export const sampleCase: CaseData = {
  id: 'ai-coding-assistants-study',
  caseNumber: 1,
  claimText:
    'Students who use AI coding assistants learn less than students who code without them.',
  weakLink: 'methodology',
  questionOptions: [
    {
      text:
        'Did the study compare students using AI assistants against a similar group that did not use them?',
      targetsWeakLink: true,
      rulingText:
        'A sharp question: if the study did not compare against a similar non-AI group, the causal claim becomes fragile. The observed difference might reflect prior skill, access, or motivation instead of the tools themselves.',
    },
    {
      text:
        'How many students were in the survey, and did the sample include beginners as well as advanced coders?',
      targetsWeakLink: false,
      rulingText:
        'This does not isolate the critical flaw in the claim. The issue is not only the size of the sample; it is whether the study actually separated the effect of AI use from other differences in the students.',
    },
    {
      text:
        'Was the data collected from students only after they completed the course, not during it?',
      targetsWeakLink: false,
      rulingText:
        'That is a timing issue, but it is not the central question. The main gap is whether the study controls for confounding differences between the groups before drawing a causal conclusion.',
    },
  ],
  startingConfidence: 42,
  resolvedConfidence: 86,
}

export const cases: CaseData[] = [sampleCase]
