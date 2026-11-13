/* All product copy lives here. It is carried over from the original Lily AI website,
   which is the source of truth. Do not add claims that are not in that source. */

export const routes = {
  home: '/',
  product: '/product',
  modeA: '/mode-a',
  modeB: '/mode-b',
  how: '/how-it-works',
  solutions: '/solutions',
  technology: '/technology',
  security: '/security',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
} as const;

/* Old single-file hash routes -> new paths */
export const legacyHashes: Record<string, string> = {
  home: routes.home,
  product: routes.product,
  modea: routes.modeA,
  modeb: routes.modeB,
  how: routes.how,
  solutions: routes.solutions,
  technology: routes.technology,
  security: routes.security,
  about: routes.about,
  contact: routes.contact,
  faq: routes.faq,
  privacy: routes.privacy,
  terms: routes.terms,
};

export const betaNote =
  "Mode A's in-app voice agent is in Beta — it is built, but it has not yet been verified live with a real caller.";

export const honestStatus = [
  {
    title: 'Mode A is in Beta',
    body: "Mode A's in-app voice agent is built, but it has not yet been verified live with a real caller.",
  },
  {
    title: 'In-app calls only',
    body: 'Calling regular phone numbers requires a separate telephone carrier arrangement, and is not live.',
  },
  {
    title: 'No cellular call capture',
    body: 'Lily does not capture ordinary mobile call audio — no phone app can.',
  },
  {
    title: 'Hindi voice not yet verified',
    body: 'Conversations are designed for English and Hindi/Hinglish. Hindi voice quality has not been verified live.',
  },
];

export const ticker = [
  'Live transcription',
  'Private suggestions',
  'Autonomous calling',
  'Sentiment & tone cues',
  'Playbook-led replies',
  'Automatic summaries',
  'Action items',
  'Follow-up drafts',
  'English + Hindi / Hinglish',
  'Consent first, always',
];

export const problems = [
  {
    n: '01',
    title: 'No memory under pressure',
    body: "Names, numbers and commitments blur together when you're thinking about what to say next.",
  },
  {
    n: '02',
    title: 'No real-time support',
    body: 'Today, help arrives after the call — in notes and summaries — when the moment to use it has already passed.',
  },
  {
    n: '03',
    title: 'Inconsistent execution',
    body: "Your best phrasing and positioning don't show up on every call, especially on the hard ones.",
  },
  {
    n: '04',
    title: 'Manual follow-up',
    body: 'Summaries, action items and follow-up messages get written by hand, late — or not at all.',
  },
];

export const steps = [
  {
    n: '01',
    title: 'Connect',
    short: "Connect through supported conversation experiences — in-app calling or your phone's microphone in person.",
    long: "Open a copilot session, or start an in-app Mode A call. Guests join Mode A by room code or browser guest link after a consent notice. Regular cellular calls are not captured — Lily works through the app and your phone's microphone.",
  },
  {
    n: '02',
    title: 'Listen',
    short: 'Conversation audio is captured and understood securely, the moment it is spoken.',
    long: "Your voice travels over an encrypted connection to Lily's private platform, where speech is transcribed as you talk (English and Hindi/Hinglish).",
  },
  {
    n: '03',
    title: 'Understand',
    short: 'Context, your playbook and relevant knowledge shape what Lily understands.',
    long: 'Lily follows the flow of the conversation while your profile, playbook, client notes and knowledge are brought together as context for every reply.',
  },
  {
    n: '04',
    title: 'Assist',
    short: 'Spoken responses in Mode A, or private suggestions in Mode B.',
    long: 'Mode A: the reply is spoken aloud in the call. Mode B: the assistance stays on your screen as private text. An interruption stops the reply in progress, in both modes.',
  },
  {
    n: '05',
    title: 'Capture',
    short: 'Summaries, action items and follow-up drafts — ready when you hang up.',
    long: 'The conversation is stored in your history with a summary, action items and a follow-up draft — exportable, and deletable by you.',
  },
];

export const capabilities = [
  {
    key: 'transcription',
    title: 'Real-Time Transcription',
    body: 'Speech is transcribed as the conversation happens — in English or Hindi/Hinglish — so Lily responds to what was just said, not a recording reviewed later.',
  },
  {
    key: 'coaching',
    title: 'Live Coaching Prompts',
    body: 'In Mode B, suggestions appear privately on your screen while there is still time to use them: phrasing, answers and next questions shaped by context.',
  },
  {
    key: 'retrieval',
    title: 'Contextual Knowledge Retrieval',
    body: 'Your knowledge base, client notes and history are recalled at every turn, so assistance is always grounded in your material.',
  },
  {
    key: 'playbooks',
    title: 'Personalized Tone & Playbooks',
    body: 'Your profile — tone preferences, approved phrases, positioning and instructions — shapes both modes, so Lily works the way you work.',
  },
  {
    key: 'history',
    title: 'Conversation History',
    body: 'Past conversations are stored and searchable, and relevant history becomes context for the next call with the same client.',
  },
  {
    key: 'sentiment',
    title: 'Sentiment & Tone Monitoring',
    body: 'Live sentiment and tone indicators in Mode B help you read the room — engaged, cautious, tense — while the call is still live.',
  },
  {
    key: 'summaries',
    title: 'Automatic Summaries',
    body: 'Every conversation closes with a structured summary: what was discussed, decided and left open.',
  },
  {
    key: 'actions',
    title: 'Action Items & Follow-Ups',
    body: 'Action items are extracted and a follow-up draft is prepared, ready for you to review and send.',
  },
  {
    key: 'languages',
    title: 'Multilingual Support',
    body: 'Designed for English and Hindi/Hinglish conversations. Hindi voice quality has not yet been verified live — stated plainly, as the product itself does.',
  },
];

export const pillars = [
  {
    key: 'voice',
    n: '01',
    title: 'Learns your voice',
    toggle: 'Adapts phrasing and tone to the communication preferences in your profile.',
    body: 'Not voice cloning: Lily adapts phrasing and tone to the communication preferences in your profile, so suggestions and spoken replies sound like your way of saying it.',
  },
  {
    key: 'playbook',
    n: '02',
    title: 'Learns your playbook',
    toggle: 'Uses your approved phrases, positioning and instructions.',
    body: 'Your approved phrases, positioning, instructions and client notes are loaded into every session — your best execution, present on every call.',
  },
  {
    key: 'history',
    n: '03',
    title: 'Learns your history',
    toggle: 'Brings in relevant context from your previous conversations.',
    body: 'Previous conversations and your knowledge base become live context, retrieved per turn, so Lily remembers what was agreed last time.',
  },
];

/* Index = voice(1) + playbook(2) + history(4) */
export const playgroundReplies: Record<number, string> = {
  0: 'We can review the pricing and come back to you with some options.',
  1: 'Appreciate you asking straight — let me show you what that price actually covers before we move any numbers.',
  2: 'Our quoted price holds for signings this month, and it includes the full onboarding package — that is the position set in your playbook.',
  3: 'Appreciate you asking straight. Our quoted price holds for signings this month, and it includes the full onboarding package — let me walk you through what is covered before we talk numbers.',
  4: 'We can review the pricing — and since your budget sign-off lands at month-end, a phased start keeps this inside this quarter, like we discussed last time.',
  5: 'Appreciate you asking straight. Since your budget sign-off lands at month-end, the phased start we discussed last time keeps this inside this quarter — want me to map it out?',
  6: 'Our quoted price holds for signings this month with onboarding included — and with your budget sign-off at month-end, the phased start from our last conversation keeps it inside this quarter.',
  7: 'Appreciate you asking straight. Our quoted price holds for signings this month and includes the full onboarding package — and since your budget sign-off lands at month-end, the phased start we discussed last time keeps it inside this quarter. Want me to walk through it?',
};

export type RoleMode = 'both' | 'b';
export const roles: {
  key: string;
  tab: string;
  title: string;
  image: string;
  alt: string;
  mode: RoleMode;
  body: string;
}[] = [
  {
    key: 'sales',
    tab: 'Sales',
    title: 'Sales & Negotiation',
    image: '/assets/role-sales.webp',
    alt: 'A professional woman on a video call at her desk, laptop in front of her',
    mode: 'both',
    body: 'Hold your pricing line and your positioning with your playbook live beside you — or let Lily run a routine in-app call while you listen in and step in whenever you choose.',
  },
  {
    key: 'support',
    tab: 'Customer Support',
    title: 'Customer Support',
    image: '/assets/role-support.webp',
    alt: 'A support professional in a suit wearing a headset, notebook in hand',
    mode: 'b',
    body: 'Calmer, more consistent support calls: context and tone cues in the moment, and a complete, searchable record when the call ends.',
  },
  {
    key: 'executive',
    tab: 'Executive',
    title: 'Executive & Board Conversations',
    image: '/assets/role-executive.webp',
    alt: 'Executives seated around a large boardroom table',
    mode: 'b',
    body: 'Walk into board-level conversations briefed on the history, and walk out with decisions captured and actions assigned.',
  },
  {
    key: 'recruiting',
    tab: 'Recruiting',
    title: 'Recruiting & Interviews',
    image: '/assets/role-recruiting.webp',
    alt: 'A candidate with glasses being interviewed, a clipboard on the table',
    mode: 'both',
    body: 'Consistent interview structure and complete capture on your calls — and routine in-app screening conversations handled by Lily under your playbook.',
  },
  {
    key: 'client',
    tab: 'Client Relationships',
    title: 'Client Relationship Management',
    image: '/assets/role-client.webp',
    alt: 'A small team meeting around a table beside bright windows',
    mode: 'b',
    body: "Every promise remembered: per-client notes and history become live context, so no relationship lives in one person's memory.",
  },
  {
    key: 'jobseeker',
    tab: 'Job Seekers',
    title: 'Job Seekers & Interviews',
    image: '/assets/role-jobseeker.webp',
    alt: 'Two men at a table in an interview setting, one holding papers',
    mode: 'b',
    body: 'Private prompts and structure during the interview itself, so you can stay fully present while Lily keeps track of the details.',
  },
];

export const solutionsIndividuals = [
  ['Freelancers & Consultants', 'Discovery, scoping and delivery calls handled with a prepared twin beside you.'],
  ['Job Seekers', 'Interview practice and live private support for the conversations that decide offers.'],
  ['Independent Professionals', 'One person, fully covered: briefing, capture and follow-up on every call.'],
  ['Solo Sales Professionals', 'Your playbook and pricing discipline, live on every pitch.'],
];

export const solutionsTeams = [
  ['Sales & Negotiation Teams', 'Shared playbooks keep execution consistent across every rep and region.'],
  ['Customer Support', 'Shared knowledge and tone awareness for steadier, better-documented support calls.'],
  ['Executive Teams', 'Decision capture and action tracking across leadership conversations.'],
  ['Recruiting', 'Consistent interview structure and complete candidate conversation records.'],
  [
    'Client Relationship Management',
    "Per-client notes and history injected as context — no relationship lives in one person's memory.",
  ],
];

export const agentStates = {
  Listening:
    'Lily is listening. When the participant speaks over a reply, the current speech is cut, that reply is discarded, and its audio is never played.',
  Thinking:
    'Your context, playbook and relevant knowledge are brought together while Lily thinks — then the reply begins.',
  Speaking:
    'Lily voices the reply into the in-app call. The owner can whisper a correction, take over, or end the session at any point.',
  Interrupted:
    'The participant started speaking, so the reply in progress stops instantly. Lily returns to listening — it never talks over the caller.',
} as const;
export type AgentState = keyof typeof agentStates;

export const pipelineHome = [
  'Conversation Audio',
  'Speech Recognition',
  'Conversation Engine',
  'Context & Reasoning',
  'Spoken Reply — or Private Assistance',
  'Conversation Output',
];

export const pipelineTech = [
  { title: 'Your Voice', sub: 'In-app call or microphone' },
  { title: 'Listening', sub: 'Speech understood as you talk' },
  { title: 'Conversation Engine', sub: 'Follows every turn, precisely' },
  { title: 'Understanding', sub: 'Reasoning with your context' },
  { title: 'The Reply', sub: 'Spoken aloud — or private text' },
];

export const callStates = ['idle', 'ringing', 'listening', 'thinking', 'speaking', 'interrupted', 'ended'];

export const reliability =
  'Step-by-step conversation control (idle → ringing → listening → thinking → speaking → interrupted → ended), every reply tracked individually, instant interruption handling, and outdated audio always discarded — so an interrupted reply never talks over the caller.';

export const techCards = [
  {
    title: 'Guided conversation flow',
    body: 'Every call moves through clear stages — idle → ringing → listening → thinking → speaking → interrupted → ended. Each reply is tracked individually, so an interrupted reply is discarded and its audio never plays late.',
  },
  {
    title: 'Knowledge, recalled in the moment',
    body: 'Your knowledge base, client notes and conversation history are kept together securely and searched live, turn by turn — so the most relevant detail is always within reach.',
  },
  {
    title: 'Interruptions, handled gracefully',
    body: 'The moment someone starts speaking, the reply in progress stops. No talking over anyone, no awkward overlap — the foundation of a natural conversation.',
  },
  {
    title: 'Nothing leaves the family',
    body: "Listening, understanding and voice all run on Lily's own private platform. Your audio and transcripts are never sent to an outside AI company.",
  },
];

export const techScope = {
  title: 'Honest scope',
  body: 'Processing on the phone itself is not available yet. Calling regular phone numbers needs a separate carrier arrangement. Hindi voice quality has not been verified live — we say so plainly rather than promise it.',
};

export const techApp = {
  title: 'Get the app',
  body: 'No app-store listing exists yet. Early access to the app is arranged directly with the Lily AI team.',
};

export const securityHome = [
  {
    title: 'Consent first',
    body: 'Explicit consent in every flow, per-region retention (30 days EU, 90 days elsewhere), and guests consent before joining.',
  },
  {
    title: 'Your data, your controls',
    body: 'Export your workspace data in a portable file, delete a workspace, or delete your account from inside the app.',
  },
  {
    title: 'Private by design',
    body: "Every conversation is processed on Lily's own private platform. No outside AI company receives your audio or transcripts.",
  },
];

export const securityCards = [
  {
    title: 'Consent everywhere',
    body: 'Explicit consent in the app, an AI announcement at the start of Mode A calls, and a consent notice guests must accept before joining.',
  },
  {
    title: 'Retention by region',
    body: "Conversation data is retained 30 days for EU workspaces and 90 days elsewhere, per the product's consent design.",
  },
  {
    title: 'Export & deletion',
    body: 'Export workspace data to a portable file on your phone. Workspace owners can delete a workspace; account deletion is available once you no longer own one.',
  },
  {
    title: 'Encrypted by default',
    body: 'Every connection is encrypted, and unencrypted connections are refused. Passwords and sign-in credentials are stored in protected, unreadable form.',
  },
  {
    title: 'Private keys stay private',
    body: "Sensitive access credentials live only on Lily's secure platform — never in the app, and never on this website.",
  },
];

export const aboutCards = [
  {
    title: 'Vision',
    body: 'A world where no one walks into an important conversation alone — where preparation, memory and your best phrasing are present in the moment, not reconstructed afterwards.',
  },
  {
    title: 'Mission',
    body: 'Build real-time conversational intelligence that is personal (it works the way you work), private (private by design, consent-led), and honest about what it can and cannot do.',
  },
  {
    title: 'Philosophy',
    body: 'The AI announces itself. The copilot never speaks for you without you. Interruptions are respected, not talked over. And unfinished capabilities are labelled as such — Mode A carries its Beta label on this site because that is the truth of its verification status.',
  },
  {
    title: "Where it's heading",
    body: 'Live verification of the Mode A voice agent, telephony through a carrier trunk when credentials are in place, and deeper personalization — each shipped only when it has actually been tested.',
  },
];

export const faqs = [
  [
    'What is Lily AI?',
    "A real-time conversational intelligence platform: an app connected to Lily's own private platform that listens, understands context, assists during conversations, and captures summaries, action items and follow-up drafts.",
  ],
  [
    'What is the Autonomous Calling Agent (Mode A)?',
    'An AI agent that speaks in a live in-app call — announcing itself as AI first, following your playbook, handling interruptions, and accepting your whisper guidance, takeover or end command. It is currently in Beta.',
  ],
  [
    'What is Live Copilot (Mode B)?',
    'A silent assistant for your own calls. Only you see the live transcript, sentiment and tone cues, and private suggested replies. It never speaks to the other party.',
  ],
  [
    'What is the difference between Mode A and Mode B?',
    'In Mode A, Lily speaks to the other participant. In Mode B, Lily speaks only to you, on your screen. Same intelligence, two very different roles.',
  ],
  [
    'How does Lily AI understand conversations?',
    'Speech is turned into text the moment it is spoken, Lily follows the flow of the conversation stage by stage, and every reply is shaped by your profile, playbook, client notes and knowledge, brought together as context.',
  ],
  [
    'Can the AI be interrupted?',
    'Yes. The moment you or the other participant starts speaking, the reply in progress is cancelled, its audio is discarded, and Lily returns to listening — every reply is tracked individually, so an old reply never plays late.',
  ],
  [
    'Does Lily AI support Hindi and English?',
    'Conversations are designed for English and Hindi/Hinglish. Hindi voice quality has not been verified live yet, so we do not promise a quality level for Hindi speech.',
  ],
  [
    'How does personalization work?',
    'You set a tone and playbook profile and add knowledge and client notes. That material shapes every Mode A and Mode B reply — it adapts how Lily behaves; it does not rebuild Lily itself.',
  ],
  [
    'Does Lily AI support in-app calling?',
    'Yes — Mode A runs in in-app call rooms. Participants join in the app or via a browser guest link with a consent notice.',
  ],
  [
    'Does it support regular cellular calls?',
    'No. Phones do not give apps access to ordinary mobile call audio. Calling regular phone numbers would require a separate telephone carrier arrangement, which is not connected.',
  ],
  [
    'Where is conversation processing performed?',
    "On Lily's own private platform — not on the phone, and never by an outside AI company. Processing on the phone itself is not available yet.",
  ],
  [
    'How are privacy and consent handled?',
    'Explicit consent in every flow, per-region retention (30 days EU, 90 days elsewhere), guest consent before joining, and in-app export and deletion controls. See the Security & Privacy page.',
  ],
];

/* Legal wording is preserved exactly from the original site. */
export const privacyDoc = {
  intro:
    "The product's plain-language privacy policy, as it appears in the Lily AI app. A lawyer review is still needed before commercial launch.",
  sections: [
    {
      h: 'What Lily processes',
      p: 'Lily processes the conversation audio, transcripts, summaries and account information needed to provide live copilot and calling features, on the private Lily platform your workspace uses. No outside AI company receives your audio or transcripts.',
    },
    {
      h: 'Consent & retention',
      p: "Features run only with explicit consent. Conversation data is retained for 30 days (EU) or 90 days (other regions) under the product's per-region consent design, and guests joining a call see a consent notice first.",
    },
    {
      h: 'Your controls',
      list: [
        'Export your workspace data to a portable file on your phone.',
        'Delete a workspace you own, which removes its data.',
        'Delete your account (available when you no longer own a workspace).',
      ],
    },
    {
      h: 'Security',
      p: 'All communication uses encrypted connections. Passwords and sign-in credentials are stored in protected, unreadable form. Keep your device and account credentials secure.',
    },
  ],
};

export const termsDoc = {
  intro:
    "The product's plain-language terms, as presented in the Lily AI app. A lawyer review is still needed before commercial launch.",
  sections: [
    {
      h: 'Using Lily AI',
      p: 'You are responsible for using Lily lawfully and for obtaining any consent your region requires before involving others in an AI-assisted conversation. In Mode A, Lily announces that it is an AI at the start of a call.',
    },
    {
      h: 'Current limitations',
      list: [
        'Mode A voice calling is in Beta and is provided for in-app conversations.',
        'Lily does not provide access to ordinary mobile call audio, and calling regular phone numbers requires a separate carrier arrangement.',
        'AI suggestions and summaries can be wrong — review them before acting.',
      ],
    },
    {
      h: 'Your content',
      p: 'Your playbooks, knowledge and conversation history remain yours. You can export or delete them using the in-app controls described in the Privacy Policy.',
    },
  ],
};

export const meta: Record<string, { title: string; description: string }> = {
  [routes.home]: {
    title: 'Lily AI — Your identical twin on every call',
    description:
      'Lily AI is real-time conversational intelligence that listens, understands context, and briefs you live. Mode A autonomous calling agent (Beta) and Mode B live copilot.',
  },
  [routes.product]: {
    title: 'Product — Lily AI',
    description:
      'One intelligence, two ways to work a conversation: an autonomous in-app calling agent and a private live copilot, before, during and after every call.',
  },
  [routes.modeA]: {
    title: 'Mode A: Autonomous Calling Agent (Beta) — Lily AI',
    description:
      'Lily speaks as an AI agent in a live in-app conversation, announces itself as AI, follows your playbook, and stays under your control. Currently in Beta.',
  },
  [routes.modeB]: {
    title: 'Mode B: Live Copilot — Lily AI',
    description:
      'The live copilot only you can see: live transcript, tone cues, private suggested replies and a post-call brief. It never speaks to the other participant.',
  },
  [routes.how]: {
    title: 'How It Works — Lily AI',
    description: 'Five stages connect your call to Lily and back in real time: connect, listen, understand, assist, capture.',
  },
  [routes.solutions]: {
    title: 'Solutions — Lily AI',
    description:
      'The conversations Lily is designed for: sales, support, recruiting, client relationships, executive conversations and interviews.',
  },
  [routes.technology]: {
    title: 'Platform & Technology — Lily AI',
    description:
      'One private platform designed end to end for live conversation: guided conversation flow, live knowledge recall and graceful interruption handling.',
  },
  [routes.security]: {
    title: 'Security & Privacy — Lily AI',
    description:
      'Consent everywhere, export and deletion controls, encrypted connections, and no certifications claimed that have not happened.',
  },
  [routes.about]: {
    title: 'About — Lily AI',
    description:
      'Lily AI exists because the most important moments in business happen live, spoken and unscripted. Vision, mission and philosophy.',
  },
  [routes.contact]: {
    title: 'Contact — Lily AI',
    description: 'Talk to the Lily AI team about the product, Mode A, Mode B, setup, or privacy and security.',
  },
  [routes.faq]: {
    title: 'FAQs — Lily AI',
    description:
      'Honest answers about Mode A and Mode B, in-app calling, cellular limitations, languages, personalization, privacy and Beta status.',
  },
  [routes.privacy]: {
    title: 'Privacy Policy — Lily AI',
    description: "The product's plain-language privacy policy, as it appears in the Lily AI app.",
  },
  [routes.terms]: {
    title: 'Terms & Conditions — Lily AI',
    description: "The product's plain-language terms, as presented in the Lily AI app.",
  },
};
