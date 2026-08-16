export type Verdict =
  | 'true'
  | 'false'
  | 'not-enough';

export type CausalCourtCase = {
  id: number;
  title: string;

  evidence: {
    label: string;
    description: string;
    source: string;
    period: string;
  };

  observation: string;

  claim: string;

  correctVerdict: Verdict;

  concept: string;

  explanation: string;

  keyQuestion: string;

  difficulty: 1 | 2 | 3;

  xp: number;
};

export const causalCourtCases: CausalCourtCase[] = [
  {
    id: 1,
    title: 'The Chocolate Effect',

    evidence: {
      label: 'Chocolate consumption vs. Nobel prizes',
      description:
        'An analysis compared chocolate consumption per person with Nobel laureates per person across 23 countries and found a strong positive correlation. The comparison used national averages rather than individual-level data.',
      source: 'Cross-country comparison',
      period: '2000–2010',
    },

    observation:
      'The two measures rise together, but the comparison does not show that chocolate caused Nobel prizes.',

    claim:
      'Eating more chocolate makes a country produce more Nobel Prize winners.',

    correctVerdict: 'false',

    concept: 'Confounding variable',

    explanation:
      'Wealthier countries tend to consume more chocolate and also invest more in research and education. Wealth could help explain both patterns, so the correlation does not establish that chocolate causes Nobel prizes.',

    keyQuestion:
      'What third factor could explain why both trends are higher in the same places?',

    difficulty: 1,

    xp: 10,
  },

  {
    id: 2,
    title: 'The Summer Connection',

    evidence: {
      label: 'Ice cream sales vs. drowning incidents',
      description:
        'A city analyzed five years of monthly retail and public-safety data. Ice cream sales and drowning incidents rose and fell together across the summer months.',
      source: 'City records',
      period: 'Five years',
    },

    observation:
      'The two measures move together, especially during hot months, but that does not mean one causes the other.',

    claim:
      'Ice cream sales cause drownings.',

    correctVerdict: 'false',

    concept: 'Confounding variable',

    explanation:
      'Hot weather increases both ice cream sales and swimming activity. The shared cause—summer heat and conditions—can explain why the two numbers rise together.',

    keyQuestion:
      'What other factor could cause both things to increase at the same time?',

    difficulty: 1,

    xp: 10,
  },

  {
    id: 3,
    title: 'The Coffee Question',

    evidence: {
      label: 'Coffee consumption vs. reported stress',
      description:
        'A one-time survey asked 1,200 adults about their daily coffee consumption and current stress levels. People reporting higher stress also tended to report drinking more coffee.',
      source: 'Self-reported survey',
      period: 'One-time survey',
    },

    observation:
      'Coffee use and stress appear together, but the survey does not establish which came first.',

    claim:
      'Drinking more coffee makes people stressed.',

    correctVerdict: 'not-enough',

    concept: 'Reverse causation',

    explanation:
      'The direction could run the other way: stressful work or life circumstances might cause people to drink more coffee. The survey also cannot rule out other factors affecting both.',

    keyQuestion:
      'Could the effect actually be running in the opposite direction?',

    difficulty: 1,

    xp: 10,
  },

  {
    id: 4,
    title: 'The Sleep Advantage',

    evidence: {
      label: 'Sleep duration vs. student GPA',
      description:
        'A survey of 200 high school students found that students reporting at least eight hours of sleep also had higher average GPAs. The students were surveyed once and were not randomly assigned to different sleep schedules.',
      source: 'Observational survey',
      period: 'One school year',
    },

    observation:
      'Students who sleep more have higher grades in this sample, but many other differences between students were not controlled.',

    claim:
      'Sleeping more causes better grades.',

    correctVerdict: 'not-enough',

    concept: 'Missing controls',

    explanation:
      'Time management, stress, study habits, health, and other factors could affect both sleep and grades. The association is interesting, but this survey alone cannot establish causation.',

    keyQuestion:
      'What other differences between the students could explain the result?',

    difficulty: 1,

    xp: 10,
  },

  {
    id: 5,
    title: 'The Exercise Effect',

    evidence: {
      label: 'Exercise program vs. depression symptoms',
      description:
        'Several randomized controlled trials assigned participants to structured exercise programs or comparison groups. Across the trials, participants assigned to exercise generally showed lower depression scores afterward.',
      source: 'Randomized controlled trials',
      period: 'Multiple trials',
    },

    observation:
      'Participants were assigned to groups rather than simply choosing whether to exercise.',

    claim:
      'Regular exercise reduces symptoms of depression.',

    correctVerdict: 'true',

    concept: 'Randomized controlled trial',

    explanation:
      'Random assignment helps make the groups comparable, reducing many alternative explanations. Consistent results across multiple trials provide strong evidence for a causal effect.',

    keyQuestion:
      'What does random assignment help us rule out?',

    difficulty: 2,

    xp: 15,
  },

  {
    id: 6,
    title: 'The Miracle Teaching Method',

    evidence: {
      label: 'New teaching method vs. previous class',
      description:
        'A teacher used a new teaching method with her 18 students for one semester. Their average test score was six points higher than the average score of the previous year’s class.',
      source: 'Before-and-after classroom comparison',
      period: 'One semester',
    },

    observation:
      'Scores were higher, but the new class was not randomly compared with a control group taking the same course at the same time.',

    claim:
      'The new teaching method improves test scores.',

    correctVerdict: 'not-enough',

    concept: 'Small sample + no control group',

    explanation:
      'Only 18 students were studied, and the comparison was with a different group from a different year. Differences between the classes, the test, or other circumstances could explain the improvement.',

    keyQuestion:
      'What would we want to compare against the new teaching method?',

    difficulty: 2,

    xp: 15,
  },

  {
    id: 7,
    title: 'The Firefighter Puzzle',

    evidence: {
      label: 'Fire crew size vs. property damage',
      description:
        'Insurance records show that fires attended by larger firefighting crews tend to have higher total property damage than fires attended by smaller crews. The records cover thousands of fire incidents.',
      source: 'Insurance and emergency records',
      period: 'Five years',
    },

    observation:
      'More firefighters and more damage occur together, but the relationship does not show that firefighters caused the damage.',

    claim:
      'Firefighters at a scene cause more property damage.',

    correctVerdict: 'false',

    concept: 'Reverse causation',

    explanation:
      'Larger, more dangerous fires require larger firefighting crews and are also more likely to cause serious damage. The severity of the fire helps explain both variables.',

    keyQuestion:
      'Could the supposed cause actually be a response to the underlying problem?',

    difficulty: 2,

    xp: 15,
  },

  {
    id: 8,
    title: 'The Drug Trial',

    evidence: {
      label: 'New drug vs. placebo',
      description:
        'In a randomized trial of 3,000 patients with influenza, participants were assigned to receive either the new drug or a placebo. The drug group recovered an average of two days faster, and similar results were reported in three follow-up trials.',
      source: 'Randomized controlled trials',
      period: 'Four clinical trials',
    },

    observation:
      'Participants were randomly assigned, a placebo group was included, and the result was replicated in additional trials.',

    claim:
      'The new drug shortens flu recovery time.',

    correctVerdict: 'true',

    concept: 'RCT + replication',

    explanation:
      'Randomization and a placebo comparison provide strong protection against alternative explanations. Replication across separate trials makes it less likely that the result was a coincidence or one unusual study.',

    keyQuestion:
      'What makes this evidence stronger than a simple correlation?',

    difficulty: 3,

    xp: 20,
  },

  {
    id: 9,
    title: 'The Violent Game Debate',

    evidence: {
      label: 'Violent gameplay vs. aggressive behavior',
      description:
        'Some laboratory studies report small short-term associations between violent gameplay and measures of aggression, while larger long-term studies have found weaker or no meaningful relationships after accounting for other factors. Researchers continue to debate the size and direction of any causal effect.',
      source: 'Mixed research evidence',
      period: 'Multiple studies',
    },

    observation:
      'Different types of studies have produced different results, and the overall causal picture remains unsettled.',

    claim:
      'Playing violent video games causes aggressive behavior.',

    correctVerdict: 'not-enough',

    concept: 'Contested / mixed evidence',

    explanation:
      'The evidence is not strong enough to confidently settle the causal question. Some studies suggest a relationship, while others find little or no meaningful effect after accounting for other factors.',

    keyQuestion:
      'What should you conclude when credible studies point in different directions?',

    difficulty: 3,

    xp: 20,
  },
];