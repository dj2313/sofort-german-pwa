// CEFR levels and skill parts

export enum CefrLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export type Skill = 'speaking' | 'listening' | 'reading' | 'writing';

export const CEFR_METADATA: Record<CefrLevel, { vocabSize: string, focus: string, description: string }> = {
  [CefrLevel.A1]: {
    vocabSize: "500-700 words",
    focus: "Basic needs & Concrete situations",
    description: "Can understand and use familiar everyday expressions and very basic phrases."
  },
  [CefrLevel.A2]: {
    vocabSize: "1,000-1,200 words",
    focus: "Routine tasks & Personal info",
    description: "Can understand sentences and frequently used expressions related to areas of most immediate relevance."
  },
  [CefrLevel.B1]: {
    vocabSize: "2,000-2,500 words",
    focus: "Independent use & Work/School",
    description: "Can understand the main points of clear standard input on familiar matters regularly encountered."
  },
  [CefrLevel.B2]: {
    vocabSize: "4,000-5,000 words",
    focus: "Complex texts & Spontaneous talk",
    description: "Can understand the main ideas of complex text on both concrete and abstract topics."
  },
  [CefrLevel.C1]: {
    vocabSize: "8,000-10,000 words",
    focus: "Professional life & Social nuance",
    description: "Can understand a wide range of demanding, longer texts, and recognize implicit meaning."
  },
  [CefrLevel.C2]: {
    vocabSize: "15,000+ words",
    focus: "Academic precision & Mastery",
    description: "Can understand with ease virtually everything heard or read."
  },
};

// Placeholder map for future exercises per level/skill
export const CEFR_SKILLS: Record<CefrLevel, Record<Skill, any>> = {
  [CefrLevel.A1]: { speaking: null, listening: null, reading: null, writing: null },
  [CefrLevel.A2]: { speaking: null, listening: null, reading: null, writing: null },
  [CefrLevel.B1]: { speaking: null, listening: null, reading: null, writing: null },
  [CefrLevel.B2]: { speaking: null, listening: null, reading: null, writing: null },
  [CefrLevel.C1]: { speaking: null, listening: null, reading: null, writing: null },
  [CefrLevel.C2]: { speaking: null, listening: null, reading: null, writing: null },
};

type SpeakingTopic = { id: string; title: string; points: string[] };
type SpeakingTask = {
  title: string;
  description: string;
  prompts: string[];
  topics?: SpeakingTopic[];
};

export const SPEAKING_TASKS: Record<string, SpeakingTask[]> = {
  'A1': [
    { title: 'Teil 1: Sich vorstellen', description: 'Introduce yourself using provided keywords.', prompts: ['Name?', 'Alter?', 'Land?', 'Wohnort?', 'Sprachen?', 'Beruf?', 'Hobby?'] },
    { title: 'Teil 2: Informationen bitten', description: 'Ask for information and respond to your partner.', prompts: ['Thema: Essen und Trinken', 'Thema: Einkaufen', 'Thema: Wochenende'] },
    { title: 'Teil 3: Bitten formulieren', description: 'Formulate a request based on a picture and respond.', prompts: ['Apfel geben?', 'Bleistift leihen?', 'Tuer schliessen?'] },
  ],
  'A2': [
    { title: 'Teil 1: Fragen zur Person', description: 'Answer questions about your daily life.', prompts: ['Was machen Sie morgens?', 'Was ist Ihr Lieblingsessen?', 'Wo kaufen Sie ein?'] },
    { title: 'Teil 2: Von sich erzählen', description: 'Talk about a specific topic from your life.', prompts: ['Mein letzter Urlaub', 'Meine Schulzeit', 'Mein Wochenende'] },
    {
      title: 'Teil 3: Etwas planen',
      description: 'Plan an event or activity with your partner. Choose a topic below.',
      prompts: [],
      topics: [
        { id: 'birthday', title: 'Geburtstagsparty organisieren', points: ['Wann?', 'Wo?', 'Wen einladen?', 'Was kaufen? (Essen/Getraenke)'] },
        { id: 'gift', title: 'Geschenk fuer Lehrerin kaufen', points: ['Was kaufen?', 'Wann treffen?', 'Wie viel Geld?', 'Wo kaufen?'] },
        { id: 'weekend', title: 'Wochenendausflug machen', points: ['Wohin?', 'Wie fahren? (Zug/Auto)', 'Was mitnehmen?', 'Uebernachtung?'] },
      ],
    },
  ],
  'B1': [
    { title: 'Teil 1: Gemeinsam planen', description: 'Discuss and organize something with your partner.', prompts: ['Besuch im Krankenhaus', 'Ausflug am Wochenende', 'Zusammen umziehen'] },
    { title: 'Teil 2: Ein Thema präsentieren', description: 'Give a short presentation on a controversial topic.', prompts: ['Brauchen wir Handys in der Schule?', 'Wohnen: Allein oder in einer WG?', 'Fast Food vs. Gesundes Essen'] },
    { title: 'Teil 3: Ueber Praesentationen sprechen', description: "Respond to your partner's presentation and ask questions.", prompts: ['Feedback geben', 'Frage stellen', 'Eigene Meinung'] },
  ],
  'B2': [
    { title: 'Teil 1: Kurzer Vortrag', description: 'Presentation on a complex topic.', prompts: ['Nachhaltigkeit im Alltag', 'Die Rolle der sozialen Medien', 'Lebenslanges Lernen'] },
    { title: 'Teil 2: Diskussion', description: 'Argue and discuss a topic with your partner.', prompts: ['Sollte das Rentenalter erhoeht werden?', 'Home-Office: Fluch oder Segen?'] },
  ],
  'C1': [
    { title: 'Teil 1: Vortrag', description: 'Extensive presentation on an academic or social topic.', prompts: ['Demografischer Wandel', 'Digitalisierung der Arbeitswelt'] },
    { title: 'Teil 2: Diskussion', description: 'A nuanced debate on a complex issue.', prompts: ['Ethik in der KI-Entwicklung', 'Bedeutung der Privatsphaere'] },
  ],
  'C2': [
    { title: 'Teil 1: Freies Sprechen', description: 'Speak freely on any topic of your choosing at a native level.', prompts: ['Philosophie', 'Kunst & Gesellschaft', 'Aktuelle Politik'] },
  ],
};
