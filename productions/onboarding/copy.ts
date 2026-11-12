// On-screen text + voiceover for the onboarding explainer (EN / PT-BR / LatAm ES).
// Plain data, no imports: scripts/gen-vo.mjs reads it directly.
//
// Macro story: what / why / timeline — user POV + Nautt POV.
// Do not list form fields; keep the four beats: info, documents, liveness, wait for approval.
type Lang = 'en' | 'pt' | 'es';

export const SPEAK_AS: Record<string, string> = {
  Nautt: 'Nawt',
};
export const VO_CHECKS: {term: string; heard: string}[] = [];

const en = {
  vo: [
    'Before your company can operate on Nautt, we complete a short verification. It protects you, your partners, and the platform. Here is how it works — from your side, and from ours.',
    'Onboarding has four main parts. You share basic information about your company and the people behind it. You send a few documents. You complete a quick liveness check. Then you wait while Nautt reviews everything.',
    'First, your information and documents. You tell us who the company is and who represents it, and you upload the papers that prove it — company registration and an identity document. We need this so we can confirm that the business and the people are real before any money moves.',
    'Next, the liveness check. A short selfie confirms that the person verifying is present and is who they say they are. It is required so an account cannot be opened with stolen documents alone.',
    'When you finish, everything is submitted for review. Nautt checks the file on our side. If you added partners, each of them also verifies their own identity. We email you when you are approved — then your dashboard unlocks and you can operate. Your wallet is ready in the background; there is nothing extra to set up.',
    'Clear steps. A secure platform. Welcome to Nautt.',
  ],
  cue: {
    mapInfo: 'You share basic',
    mapDocs: 'You send a few',
    mapLive: 'You complete a quick',
    mapWait: 'Then you wait',
    infoWhy: 'We need this so',
    liveWhy: 'It is required so',
    submit: 'submitted for review',
    nauttChecks: 'Nautt checks the file',
    partners: 'If you added partners',
    email: 'We email you',
    unlock: 'your dashboard unlocks',
    wallet: 'Your wallet is ready',
  },
  hook: {
    eyebrow: 'Onboarding',
    l1: 'A short verification before you operate.',
    l2: 'Your side. Our side.',
    youSide: 'Your side',
    ourSide: 'Our side',
  },
  map: {
    eyebrow: '1. The big picture',
    title: 'Four main parts.',
    parts: [
      {label: 'Your information', sub: 'Company and people'},
      {label: 'Documents', sub: 'Proof on file'},
      {label: 'Liveness check', sub: 'Confirm presence'},
      {label: 'Wait for approval', sub: 'Nautt reviews'},
    ],
  },
  info: {
    eyebrow: '2. Information & documents',
    title: 'Who you are — and proof.',
    you: 'You share company and people details, then upload registration and ID documents.',
    why: 'So Nautt can confirm the business and the people are real before money moves.',
    youChip: 'You provide',
    whyChip: 'Why Nautt needs it',
  },
  live: {
    eyebrow: '3. Liveness check',
    title: 'A short selfie.',
    you: 'Confirms the person verifying is present and matches the ID.',
    why: 'So an account cannot be opened with stolen documents alone.',
    youChip: 'You do',
    whyChip: 'Why Nautt needs it',
  },
  timeline: {
    eyebrow: '4. Timeline',
    title: 'Submit. Review. Unlock.',
    steps: [
      {label: 'You submit', sub: 'Info, documents, liveness'},
      {label: 'Nautt reviews', sub: 'We check the file'},
      {label: 'Partners verify', sub: 'Each completes their own check'},
      {label: 'You are approved', sub: 'Email, then dashboard unlocks'},
    ],
    wallet: 'Wallet ready in the background — nothing extra to set up.',
  },
  close: {
    l1: 'Clear steps. A secure platform.',
    l2: 'Welcome to Nautt.',
  },
};

export type Strings = typeof en;

const pt: Strings = {
  vo: [
    'Antes que a sua empresa opere na Nautt, fazemos uma verificação rápida. Ela protege você, os seus sócios e a plataforma. Veja como funciona — do seu lado e do nosso.',
    'O onboarding tem quatro partes principais. Você compartilha informações básicas da empresa e das pessoas por trás dela. Envia alguns documentos. Faz uma verificação rápida de presença. Depois, aguarda enquanto a Nautt analisa tudo.',
    'Primeiro, suas informações e documentos. Você nos diz quem é a empresa e quem a representa, e envia os papéis que comprovam isso — o registro da empresa e um documento de identidade. Precisamos disso para confirmar que o negócio e as pessoas são reais antes de qualquer dinheiro circular.',
    'Em seguida, a verificação de presença. Uma selfie rápida confirma que a pessoa está presente e é quem diz ser. É necessária para que uma conta não seja aberta só com documentos roubados.',
    'Quando você termina, tudo é enviado para análise. A Nautt revisa o dossiê do nosso lado. Se você cadastrou sócios, cada um também verifica a própria identidade. Avisamos por e-mail quando estiver aprovado — aí o painel é liberado e você pode operar. A carteira fica pronta em segundo plano; não há nada extra para configurar.',
    'Passos claros. Uma plataforma segura. Bem-vindo à Nautt.',
  ],
  cue: {
    mapInfo: 'Você compartilha informações',
    mapDocs: 'Envia alguns documentos',
    mapLive: 'Faz uma verificação',
    mapWait: 'Depois, aguarda',
    infoWhy: 'Precisamos disso para',
    liveWhy: 'É necessária para',
    submit: 'enviado para análise',
    nauttChecks: 'A Nautt revisa',
    partners: 'Se você cadastrou sócios',
    email: 'Avisamos por e-mail',
    unlock: 'o painel é liberado',
    wallet: 'A carteira fica pronta',
  },
  hook: {
    eyebrow: 'Onboarding',
    l1: 'Uma verificação rápida antes de operar.',
    l2: 'Do seu lado. Do nosso lado.',
    youSide: 'Seu lado',
    ourSide: 'Nosso lado',
  },
  map: {
    eyebrow: '1. Visão geral',
    title: 'Quatro partes principais.',
    parts: [
      {label: 'Suas informações', sub: 'Empresa e pessoas'},
      {label: 'Documentos', sub: 'Comprovação'},
      {label: 'Presença (liveness)', sub: 'Confirmar presença'},
      {label: 'Aguardar aprovação', sub: 'A Nautt analisa'},
    ],
  },
  info: {
    eyebrow: '2. Informações e documentos',
    title: 'Quem você é — e a prova.',
    you: 'Você informa empresa e pessoas, e envia registro e documento de identidade.',
    why: 'Para a Nautt confirmar que o negócio e as pessoas são reais antes do dinheiro circular.',
    youChip: 'Você envia',
    whyChip: 'Por que a Nautt precisa',
  },
  live: {
    eyebrow: '3. Verificação de presença',
    title: 'Uma selfie rápida.',
    you: 'Confirma que a pessoa está presente e corresponde ao documento.',
    why: 'Para que uma conta não seja aberta só com documentos roubados.',
    youChip: 'Você faz',
    whyChip: 'Por que a Nautt precisa',
  },
  timeline: {
    eyebrow: '4. Linha do tempo',
    title: 'Enviar. Analisar. Liberar.',
    steps: [
      {label: 'Você envia', sub: 'Info, documentos, presença'},
      {label: 'A Nautt analisa', sub: 'Revisamos o dossiê'},
      {label: 'Sócios verificam', sub: 'Cada um faz a própria checagem'},
      {label: 'Você é aprovado', sub: 'E-mail, e o painel libera'},
    ],
    wallet: 'Carteira pronta em segundo plano — nada extra para configurar.',
  },
  close: {
    l1: 'Passos claros. Plataforma segura.',
    l2: 'Bem-vindo à Nautt.',
  },
};

const es: Strings = {
  vo: [
    'Antes de que su empresa opere en Nautt, completamos una verificación breve. Protege a usted, a sus socios y a la plataforma. Así funciona: desde su lado y desde el nuestro.',
    'El onboarding tiene cuatro partes principales. Usted comparte información básica de su empresa y de las personas detrás de ella. Envía algunos documentos. Completa una verificación rápida de presencia. Luego espera mientras Nautt revisa todo.',
    'Primero, su información y documentos. Nos indica quién es la empresa y quién la representa, y sube los papeles que lo demuestran: el registro de la empresa y un documento de identidad. Lo necesitamos para confirmar que el negocio y las personas son reales antes de que circule dinero.',
    'Después, la verificación de presencia. Una selfie breve confirma que la persona está presente y es quien dice ser. Es necesaria para que una cuenta no se abra solo con documentos robados.',
    'Cuando termina, todo se envía a revisión. Nautt revisa el expediente de nuestro lado. Si agregó socios, cada uno también verifica su propia identidad. Le avisamos por correo cuando esté aprobado; entonces su panel se desbloquea y puede operar. Su billetera queda lista en segundo plano; no hay nada extra que configurar.',
    'Pasos claros. Una plataforma segura. Bienvenido a Nautt.',
  ],
  cue: {
    mapInfo: 'Usted comparte información',
    mapDocs: 'Envía algunos documentos',
    mapLive: 'Completa una verificación',
    mapWait: 'Luego espera',
    infoWhy: 'Lo necesitamos para',
    liveWhy: 'Es necesaria para',
    submit: 'se envía a revisión',
    nauttChecks: 'Nautt revisa el expediente',
    partners: 'Si agregó socios',
    email: 'Le avisamos por correo',
    unlock: 'su panel se desbloquea',
    wallet: 'Su billetera queda lista',
  },
  hook: {
    eyebrow: 'Onboarding',
    l1: 'Una verificación breve antes de operar.',
    l2: 'Su lado. Nuestro lado.',
    youSide: 'Su lado',
    ourSide: 'Nuestro lado',
  },
  map: {
    eyebrow: '1. Panorama',
    title: 'Cuatro partes principales.',
    parts: [
      {label: 'Su información', sub: 'Empresa y personas'},
      {label: 'Documentos', sub: 'Prueba en archivo'},
      {label: 'Presencia (liveness)', sub: 'Confirmar presencia'},
      {label: 'Esperar aprobación', sub: 'Nautt revisa'},
    ],
  },
  info: {
    eyebrow: '2. Información y documentos',
    title: 'Quién es usted — y la prueba.',
    you: 'Comparte datos de empresa y personas, y sube registro e identidad.',
    why: 'Para que Nautt confirme que el negocio y las personas son reales antes de que circule dinero.',
    youChip: 'Usted aporta',
    whyChip: 'Por qué Nautt lo necesita',
  },
  live: {
    eyebrow: '3. Verificación de presencia',
    title: 'Una selfie breve.',
    you: 'Confirma que la persona está presente y coincide con el documento.',
    why: 'Para que una cuenta no se abra solo con documentos robados.',
    youChip: 'Usted hace',
    whyChip: 'Por qué Nautt lo necesita',
  },
  timeline: {
    eyebrow: '4. Línea de tiempo',
    title: 'Enviar. Revisar. Desbloquear.',
    steps: [
      {label: 'Usted envía', sub: 'Info, documentos, presencia'},
      {label: 'Nautt revisa', sub: 'Revisamos el expediente'},
      {label: 'Socios verifican', sub: 'Cada uno completa su chequeo'},
      {label: 'Usted es aprobado', sub: 'Correo, y el panel se abre'},
    ],
    wallet: 'Billetera lista en segundo plano — nada extra que configurar.',
  },
  close: {
    l1: 'Pasos claros. Plataforma segura.',
    l2: 'Bienvenido a Nautt.',
  },
};

export const STR: Record<Lang, Strings> = {en, pt, es};
