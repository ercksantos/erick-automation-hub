// Todo o texto do site mora aqui. As regras de copy vêm do repo erickai-conteudo
// (marca/03-tom-de-voz, 04-provas e 06-nunca-dizer): sem número que não foi liberado,
// sem promessa de resultado, sem travessão, sem nome de cliente.

import { EMPRESA } from "@/lib/empresa";

export const SITE = {
  marca: "Erick.AI",
  pessoa: "Erick Santos",
  whatsapp: { numero: "555391631843", exibicao: "(53) 99163-1843" },
  email: EMPRESA.email,
  instagram: { url: "https://instagram.com/ericksantos.ai", handle: "@ericksantos.ai" },
  linkedin: "https://linkedin.com/in/erickps-dev/",
  github: "https://github.com/ercksantos",
  // fluxo "Site Erick.AI · Contato" no n8n próprio
  webhookContato: "https://n8n.erickai.com.br/webhook/contato-site",
  // /teste-gratis continua no ar, mas sem link no site enquanto não houver crédito de LLM
  testeGratisVisivel: false,
};

export const waLink = (msg = "Olá, Erick! Vi seu site e quero conversar sobre um projeto.") =>
  `https://wa.me/${SITE.whatsapp.numero}?text=${encodeURIComponent(msg)}`;

export const NAV = [
  { id: "servicos", label: "Serviços" },
  { id: "por-dentro", label: "Por dentro" },
  { id: "projetos", label: "Projetos" },
  { id: "como-trabalho", label: "Como trabalho" },
  { id: "contato", label: "Contato" },
];

/* ---------- hero: as conversas da noite ---------- */
export const HERO_CONVERSAS = [
  { texto: "Vocês atendem sábado?", hora: "22:47" },
  { texto: "Qual o valor da avaliação?", hora: "23:05" },
  { texto: "Ainda tem horário essa semana?", hora: "07:12" },
  { texto: "Oi? Alguém aí?", hora: "08:30" },
];

/* ---------- serviços: a corrente ---------- */
export type Servico = {
  id: string;
  verbo: string;
  nome: string;
  faz: string;
  resolve: string;
  naoFaz: string;
};

export const SERVICOS: Servico[] = [
  {
    id: "site",
    verbo: "Capta",
    nome: "Site e landing page",
    faz: "Página rápida que leva a pessoa direto para a conversa no WhatsApp e já registra de onde ela veio.",
    resolve: "Site bonito que não gera conversa e lead que chega sem origem.",
    naoFaz: "Não traz visita sozinho: alguém precisa chegar até ele, por anúncio, Instagram ou indicação.",
  },
  {
    id: "agente",
    verbo: "Atende",
    nome: "Agente de IA no WhatsApp",
    faz: "Responde, tira dúvida, qualifica e agenda no WhatsApp oficial da empresa. Um roteador decide o caminho e cada agente cuida de um assunto.",
    resolve: "Cliente sem resposta fora do horário e equipe repetindo as mesmas respostas o dia inteiro.",
    naoFaz: "Não negocia como um vendedor e não inventa informação: responde só com o que a empresa definiu e chama uma pessoa quando precisa.",
  },
  {
    id: "crm",
    verbo: "Organiza",
    nome: "CRM sob medida",
    faz: "Funil, etapas, histórico e lembrete de follow-up, construídos do zero em cima do jeito que a sua equipe vende.",
    resolve: "Lead perdido entre planilha e conversa de WhatsApp, sem ninguém saber em que etapa cada cliente está.",
    naoFaz: "Não é um sistema pronto cheio de função que a sua equipe nunca vai usar.",
  },
  {
    id: "sistema",
    verbo: "Resolve",
    nome: "Sistema sob medida",
    faz: "Sistema interno para o processo que é só do seu negócio: cobrança, conferência, aprovação, estoque.",
    resolve: "Processo que hoje vive em planilha, e-mail e cobrança manual.",
    naoFaz: "Não é planilha com outro nome: tem regra, histórico e quem pode mexer em quê.",
  },
];

/* ---------- por dentro: demonstração ---------- */
export type Fala = { de: "cliente" | "agente" | "dia" | "sistema"; texto: string; hora?: string };

export const CONVERSA_DEMO: Fala[] = [
  { de: "dia", texto: "Hoje" },
  { de: "cliente", texto: "Boa noite! Vocês fazem limpeza de pele?", hora: "22:47" },
  { de: "agente", texto: "Boa noite! Fazemos sim. A sessão leva cerca de uma hora e começa com uma avaliação da pele.", hora: "22:47" },
  { de: "agente", texto: "Quer que eu veja um horário para você? Tenho sábado de manhã ou terça à tarde.", hora: "22:47" },
  { de: "cliente", texto: "Sábado de manhã!", hora: "22:48" },
  { de: "agente", texto: "Reservado: sábado, 9h. Na sexta eu te mando um lembrete por aqui.", hora: "22:48" },
  { de: "cliente", texto: "Perfeito, obrigada!", hora: "22:49" },
  { de: "sistema", texto: "Lead registrado no CRM: limpeza de pele, sábado de manhã." },
];

export type Rota = { id: string; nome: string; faz: string };
export const ROTAS: Rota[] = [
  { id: "agenda", nome: "Agenda", faz: "marca, remarca e confirma horários" },
  { id: "servicos", nome: "Serviços e valores", faz: "responde com o que a clínica definiu" },
  { id: "financeiro", nome: "Financeiro", faz: "envia recibo, link de pagamento e segunda via" },
  { id: "equipe", nome: "Pessoa da equipe", faz: "assume o que o agente não deve resolver" },
];

export const MENSAGENS_ROTEADOR = [
  { texto: "Tem horário no sábado?", rota: "agenda", porque: "Pediu horário: vai para o agente que cuida da agenda." },
  { texto: "Quanto custa a limpeza de pele?", rota: "servicos", porque: "Pergunta sobre serviço: responde só com a tabela que a clínica cadastrou." },
  { texto: "Preciso remarcar para terça", rota: "agenda", porque: "Remarcação também é agenda. O roteador não conversa, só escolhe o caminho." },
  { texto: "Já paguei, pode mandar o recibo?", rota: "financeiro", porque: "Assunto de pagamento: vai para o agente do financeiro." },
  { texto: "Fiquei com a pele vermelha depois da sessão", rota: "equipe", porque: "Assunto sensível: o agente não arrisca e chama alguém da equipe na hora." },
];

export type Etapa = "novo" | "conversa" | "agendado";
export type CardCrm = { id: string; titulo: string; origem: string; nota: string; etapa: Etapa; destaque?: boolean };

export const ETAPAS: { id: Etapa; nome: string }[] = [
  { id: "novo", nome: "Novo" },
  { id: "conversa", nome: "Em conversa" },
  { id: "agendado", nome: "Agendado" },
];

export const CARDS_CRM: CardCrm[] = [
  { id: "c1", titulo: "Limpeza de pele", origem: "WhatsApp, 22:47", nota: "Sábado de manhã, agendado pelo agente", etapa: "agendado", destaque: true },
  { id: "c2", titulo: "Avaliação facial", origem: "Instagram", nota: "Pediu valores, sem resposta desde segunda", etapa: "conversa" },
  { id: "c3", titulo: "Pacote de drenagem", origem: "Site", nota: "Chegou pelo formulário hoje cedo", etapa: "novo" },
  { id: "c4", titulo: "Peeling", origem: "Indicação", nota: "Quer horário depois das 18h", etapa: "conversa" },
  { id: "c5", titulo: "Retorno pós-sessão", origem: "WhatsApp", nota: "Lembrete enviado na véspera", etapa: "agendado" },
];

/* ---------- frase ---------- */
export const FRASE = "A IA não sabe o preço da sua consulta. Alguém precisa contar pra ela.";

export const DIFERENCIAIS = [
  { titulo: "Eu construo", texto: "Não revendo plataforma pronta. Monto o agente, o CRM ou o sistema do zero, em cima do processo da sua empresa." },
  { titulo: "Processo antes da ferramenta", texto: "IA e CRM só funcionam se o atendimento e o funil fazem sentido antes. É por aí que eu começo." },
  { titulo: "Você entende o que comprou", texto: "Mostro o que o sistema faz e o que ele não faz, por dentro. Sem mágica e sem caixa-preta." },
];

/* ---------- projetos ---------- */
export type Projeto = {
  slug: string;
  titulo: string;
  tipo: string;
  status?: string;
  resumo: string;
  itens: string[];
  ferramentas?: string[];
  thumb?: string;
  videos?: { rotulo: string; src: string }[];
  link?: { url: string; rotulo: string };
};

export const PROJETOS: Projeto[] = [
  {
    slug: "concessionaria",
    titulo: "Atendimento de concessionária",
    tipo: "Agente de IA e CRM",
    resumo: "Atende quem chama no WhatsApp a qualquer hora, entende qual carro interessa e agenda a visita ou o test drive.",
    itens: [
      "Responde na hora, inclusive de madrugada",
      "Qualifica o interessado antes de passar ao vendedor",
      "Agenda o test drive",
      "Retoma o contato com quem esfriou",
      "Tudo registrado no CRM, com o carro de interesse",
    ],
    ferramentas: ["n8n", "OpenAI", "WhatsApp API", "PostgreSQL"],
    thumb: "/media/concessionaria.webp",
    videos: [
      { rotulo: "Painel", src: "/media/concessionaria-painel.mp4" },
      { rotulo: "Conversa", src: "/media/concessionaria-conversa.mp4" },
    ],
  },
  {
    slug: "clinica",
    titulo: "Agenda de clínica",
    tipo: "Agente de IA",
    resumo: "Confirma consultas, remarca sem ocupar a recepção e oferece os horários que vagam para quem está esperando.",
    itens: [
      "Confirmação pelo WhatsApp",
      "Remarcação sem atendente",
      "Lembretes antes da consulta",
      "Lista de espera para horário vago",
      "Agenda sincronizada com o Google Agenda",
    ],
    ferramentas: ["n8n", "Google Agenda", "Twilio", "Node.js"],
    thumb: "/media/clinica.webp",
    videos: [{ rotulo: "Demonstração", src: "/media/clinica.mp4" }],
  },
  {
    slug: "contabilidade",
    titulo: "Documentos de contabilidade",
    tipo: "Sistema e WhatsApp",
    resumo: "Lê os documentos que chegam, classifica com IA e avisa cada cliente do escritório sobre o que está pendente.",
    itens: [
      "Leitura automática de notas",
      "Classificação fiscal com IA",
      "Envio de guias pelo WhatsApp",
      "Cobrança de quem está em atraso",
      "Relatório de pendências",
    ],
    ferramentas: ["n8n", "Python", "OCR", "API Gov.br"],
    thumb: "/media/contabilidade.webp",
    videos: [{ rotulo: "Demonstração", src: "/media/contabilidade.mp4" }],
  },
  {
    slug: "central-de-comprovacao",
    titulo: "Central de Comprovação",
    tipo: "Produto próprio",
    status: "Em construção",
    resumo: "Um sistema que avisa pelo WhatsApp quem tem despesa sem comprovante, recolhe a escolha (devolver ou descontar) e guarda um histórico que ninguém consegue apagar.",
    itens: [
      "Cobrança do comprovante pelo WhatsApp",
      "A pessoa escolhe entre devolver ou descontar",
      "Histórico que não pode ser editado",
      "Painel para quem confere as despesas",
    ],
  },
  {
    slug: "conferencia",
    titulo: "Conferência de notas e boletos",
    tipo: "Produto próprio",
    status: "Piloto em uso",
    resumo: "Um programa que cruza a nota fiscal, o título lançado no sistema e o boleto cobrado, e aponta o que não bate.",
    itens: [
      "Cruza nota, título e boleto",
      "Aponta divergência de valor e de vencimento",
      "Feito para quem confere muitas lojas por mês",
    ],
  },
  {
    slug: "conteudo",
    titulo: "Sistema de conteúdo",
    tipo: "Produto próprio",
    status: "No ar",
    resumo: "Os posts do meu Instagram saem de um sistema que eu construí: pauta, texto, arte, aprovação e publicação agendada.",
    itens: [
      "Pauta e roteiro a partir das regras da marca",
      "Arte renderizada em HTML",
      "Nada sai sem a minha aprovação",
      "Publicação agendada pela API oficial",
    ],
    link: { url: SITE.instagram.url, rotulo: `Ver no ${SITE.instagram.handle}` },
  },
];

/* ---------- como trabalho ---------- */
export const PASSOS = [
  {
    titulo: "Diagnóstico",
    texto: "Entendo como a sua empresa atende e vende hoje: quem responde, onde o lead esfria, onde a planilha trava. Só depois falo de ferramenta.",
  },
  {
    titulo: "Protótipo",
    texto: "Você vê uma versão funcionando, com o seu caso e o seu jeito de falar, antes de investir no projeto inteiro.",
  },
  {
    titulo: "Construção",
    texto: "Construo, ligo ao WhatsApp, ao CRM e ao que você já usa, e testo com conversas de verdade antes de abrir para os clientes.",
  },
  {
    titulo: "Acompanhamento",
    texto: "Com tudo no ar, acompanho as conversas, corrijo o que escapou e ajusto conforme o negócio muda.",
  },
];

/* ---------- sobre ---------- */
export const SEGMENTOS = [
  "clínicas",
  "faculdades e escolas",
  "escritórios de advocacia",
  "restaurantes",
  "corretoras de seguro",
  "agronegócio",
];

export const FERRAMENTAS = ["n8n", "WhatsApp API", "Claude", "OpenAI", "PostgreSQL", "Supabase", "React", "TypeScript", "Node.js"];

/* ---------- prêmio ---------- */
// Liberado pelo Erick em 2026-11-04 (erickai-conteudo/marca/04-provas.md). Foi em parceria,
// mas os agentes e as automações são dele: a frase diz exatamente isso. Sem citar o negócio
// inscrito, sem nomes ou fotos do júri e sem o logo do DataCrazy.
export const PREMIO = {
  evento: "Crazy AI Talents",
  organizador: "DataCrazy",
  edicao: "1ª edição, agosto de 2026",
  colocacao: "1º lugar",
  placa: "AI Builder",
  url: "https://aitalent.datacrazy.io/",
  feito: [
    "Quatro agentes no WhatsApp: atendimento, venda, pós-venda e um auditor que relê as conversas todo dia",
    "Base de conhecimento curada e auditável, para o agente não inventar resposta",
    "Cobrança e confirmação do pagamento direto na conversa",
  ],
  media: 2.9,
  criterios: [
    { nome: "Complexidade", peso: 20, nota: 3.0 },
    { nome: "Prompt e base de conhecimento", peso: 15, nota: 2.83 },
    { nome: "Criatividade", peso: 10, nota: 3.0 },
    { nome: "Eficiência de tokens", peso: 10, nota: 2.5 },
  ],
};
