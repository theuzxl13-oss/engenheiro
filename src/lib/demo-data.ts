import { BASE_PATH } from "@/lib/env";
import type { SiteContent } from "@/lib/types";

/**
 * CONTEÚDO DEMONSTRATIVO
 * Exibido apenas enquanto o Supabase não está configurado. Nenhum dado aqui
 * representa um profissional, cliente ou obra real: os campos entre colchetes
 * devem ser substituídos pelas informações verdadeiras no painel administrativo.
 * Depoimentos e indicadores numéricos NÃO são simulados.
 */
export const demoContent: SiteContent = {
  demo: true,
  profile: {
    full_name: "[Nome do Engenheiro]",
    headline: "[Especialidade] — ex.: Engenharia Civil",
    crea: "[CREA-UF 000000000]",
    degree: "[Bacharelado em Engenharia]",
    institution: "[Instituição de Ensino]",
    graduation_year: null,
    years_experience: null,
    bio:
      "[Texto demonstrativo] Apresente aqui sua trajetória profissional, a forma como conduz cada projeto e os valores que orientam seu trabalho. Este parágrafo deve ser substituído pela sua biografia real no painel administrativo.\n\n[Texto demonstrativo] Descreva o tipo de cliente que atende, os setores em que possui experiência e os diferenciais técnicos que oferece.",
    areas: ["[Área de atuação 1]", "[Área de atuação 2]", "[Área de atuação 3]"],
    courses: ["[Curso ou especialização]", "[Pós-graduação]"],
    photo_url: null,
    hero_image_url: null,
    cv_url: `${BASE_PATH}/demo/curriculo-demonstrativo.pdf`,
    stat_projects: null,
    stat_clients: null,
    stat_certifications: null,
    email: null,
    phone: null,
    whatsapp: null,
    whatsapp_message: "Olá! Vim pelo seu site e gostaria de solicitar um orçamento.",
    linkedin_url: null,
    instagram_url: null,
    service_area: "[Cidade/UF e região de atendimento]",
  },
  services: [
    {
      id: "demo-s1",
      title: "Consultoria técnica",
      description:
        "Análise de viabilidade, diagnóstico de problemas e orientação técnica para decisões seguras em cada etapa do empreendimento.",
      icon: "Compass",
      image_url: null,
      sort_order: 1,
      published: true,
    },
    {
      id: "demo-s2",
      title: "Elaboração de projetos",
      description:
        "Desenvolvimento de projetos executivos com memorial descritivo, compatibilização entre disciplinas e atendimento às normas vigentes.",
      icon: "PencilRuler",
      image_url: null,
      sort_order: 2,
      published: true,
    },
    {
      id: "demo-s3",
      title: "Gestão de projetos",
      description:
        "Planejamento de cronogramas, controle de custos e coordenação de equipes para entregas no prazo e dentro do orçamento.",
      icon: "FolderKanban",
      image_url: null,
      sort_order: 3,
      published: true,
    },
    {
      id: "demo-s4",
      title: "Acompanhamento de obras",
      description:
        "Fiscalização e acompanhamento técnico da execução, garantindo conformidade com o projeto, qualidade e segurança.",
      icon: "HardHat",
      image_url: null,
      sort_order: 4,
      published: true,
    },
    {
      id: "demo-s5",
      title: "Vistorias e inspeções",
      description:
        "Inspeções prediais e técnicas com registro fotográfico, identificação de patologias e recomendações de intervenção.",
      icon: "ClipboardCheck",
      image_url: null,
      sort_order: 5,
      published: true,
    },
    {
      id: "demo-s6",
      title: "Laudos e pareceres técnicos",
      description:
        "Documentos técnicos fundamentados, com Anotação de Responsabilidade Técnica (ART), para fins legais, periciais ou de seguro.",
      icon: "FileText",
      image_url: null,
      sort_order: 6,
      published: true,
    },
    {
      id: "demo-s7",
      title: "Soluções sustentáveis",
      description:
        "Estudos de eficiência energética, reaproveitamento de recursos e soluções de menor impacto ambiental.",
      icon: "Leaf",
      image_url: null,
      sort_order: 7,
      published: true,
    },
  ],
  projects: [
    {
      id: "demo-p1",
      slug: "edificio-residencial-demonstrativo",
      title: "Edifício residencial (projeto demonstrativo)",
      category: "Edificações",
      location: "[Cidade/UF]",
      year: null,
      summary:
        "Exemplo de apresentação de projeto. Substitua por um trabalho real com fotografias autorizadas.",
      description:
        "[Conteúdo demonstrativo] Descreva o escopo do projeto, o cliente (quando autorizado), as disciplinas envolvidas e o papel desempenhado.",
      challenges:
        "[Conteúdo demonstrativo] Relate as restrições técnicas, de prazo, orçamento ou terreno que exigiram atenção especial.",
      solutions:
        "[Conteúdo demonstrativo] Explique as decisões de engenharia adotadas e por que foram as mais adequadas.",
      results:
        "[Conteúdo demonstrativo] Apresente resultados verificáveis: prazos cumpridos, economia obtida, certificações alcançadas.",
      cover_url: `${BASE_PATH}/demo/projeto-edificacao.svg`,
      gallery: [`${BASE_PATH}/demo/projeto-edificacao.svg`, `${BASE_PATH}/demo/projeto-infraestrutura.svg`],
      featured: true,
      published: true,
      sort_order: 1,
    },
    {
      id: "demo-p2",
      slug: "passarela-metalica-demonstrativa",
      title: "Passarela metálica (projeto demonstrativo)",
      category: "Infraestrutura",
      location: "[Cidade/UF]",
      year: null,
      summary:
        "Exemplo de estudo de caso de infraestrutura. Conteúdo ilustrativo, sem relação com obra real.",
      description:
        "[Conteúdo demonstrativo] Utilize este espaço para contextualizar o projeto e sua relevância para o cliente.",
      challenges: "[Conteúdo demonstrativo] Principais desafios encontrados.",
      solutions: "[Conteúdo demonstrativo] Soluções técnicas desenvolvidas.",
      results: "[Conteúdo demonstrativo] Resultados alcançados.",
      cover_url: `${BASE_PATH}/demo/projeto-infraestrutura.svg`,
      gallery: [`${BASE_PATH}/demo/projeto-infraestrutura.svg`],
      featured: false,
      published: true,
      sort_order: 2,
    },
    {
      id: "demo-p3",
      slug: "usina-solar-demonstrativa",
      title: "Sistema fotovoltaico (projeto demonstrativo)",
      category: "Sustentabilidade",
      location: "[Cidade/UF]",
      year: null,
      summary:
        "Exemplo de projeto de energia renovável. Substitua por dados e imagens de um trabalho executado.",
      description: "[Conteúdo demonstrativo] Descrição do projeto.",
      challenges: "[Conteúdo demonstrativo] Principais desafios encontrados.",
      solutions: "[Conteúdo demonstrativo] Soluções técnicas desenvolvidas.",
      results: "[Conteúdo demonstrativo] Resultados alcançados.",
      cover_url: `${BASE_PATH}/demo/projeto-sustentabilidade.svg`,
      gallery: [`${BASE_PATH}/demo/projeto-sustentabilidade.svg`],
      featured: false,
      published: true,
      sort_order: 3,
    },
    {
      id: "demo-p4",
      slug: "instalacoes-industriais-demonstrativas",
      title: "Instalações industriais (projeto demonstrativo)",
      category: "Instalações",
      location: "[Cidade/UF]",
      year: null,
      summary:
        "Exemplo de projeto de instalações. Conteúdo ilustrativo para visualização do layout.",
      description: "[Conteúdo demonstrativo] Descrição do projeto.",
      challenges: "[Conteúdo demonstrativo] Principais desafios encontrados.",
      solutions: "[Conteúdo demonstrativo] Soluções técnicas desenvolvidas.",
      results: "[Conteúdo demonstrativo] Resultados alcançados.",
      cover_url: `${BASE_PATH}/demo/projeto-instalacoes.svg`,
      gallery: [`${BASE_PATH}/demo/projeto-instalacoes.svg`],
      featured: false,
      published: true,
      sort_order: 4,
    },
  ],
  certifications: [
    {
      id: "demo-c1",
      title: "[Graduação em Engenharia]",
      issuer: "[Instituição de Ensino]",
      kind: "diploma",
      year: null,
      description: "Exemplo de item de formação acadêmica.",
      file_url: null,
      sort_order: 1,
      published: true,
    },
    {
      id: "demo-c2",
      title: "[Registro no CREA]",
      issuer: "[CREA-UF]",
      kind: "registro",
      year: null,
      description: "Exemplo de registro profissional.",
      file_url: null,
      sort_order: 2,
      published: true,
    },
    {
      id: "demo-c3",
      title: "[Especialização / Pós-graduação]",
      issuer: "[Instituição]",
      kind: "especializacao",
      year: null,
      description: "Exemplo com certificado em PDF para visualização.",
      file_url: `${BASE_PATH}/demo/certificado-demonstrativo.pdf`,
      sort_order: 3,
      published: true,
    },
    {
      id: "demo-c4",
      title: "[Curso técnico ou NR]",
      issuer: "[Entidade certificadora]",
      kind: "curso",
      year: null,
      description: "Exemplo de curso complementar.",
      file_url: null,
      sort_order: 4,
      published: true,
    },
  ],
  testimonials: [],
};
