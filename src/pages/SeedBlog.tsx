import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const blogPosts = [
  {
    title: "PPCI no Rio Grande do Sul em 2026: O que mudou e como regularizar seu estabelecimento em Carazinho",
    slug: "ppci-rio-grande-do-sul-2026-carazinho",
    category: "Prevenção contra Incêndio",
    excerpt: "O prazo para protocolar o PPCI junto ao Corpo de Bombeiros do RS terminou em dezembro de 2025. Saiba o que mudou com as novas Resoluções Técnicas do CBMRS e como regularizar seu estabelecimento em Carazinho e no norte gaúcho.",
    cover_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200",
    published_at: "2026-01-15",
    published: true,
    content: `<h2>O que é o PPCI e por que ele é obrigatório no RS?</h2>
<p>O Plano de Prevenção e Proteção Contra Incêndio (PPCI) é um documento técnico obrigatório para edificações comerciais, industriais e de serviços no Rio Grande do Sul, regulamentado pela Lei Complementar nº 14.376/2013 — criada após a tragédia da Boate Kiss em Santa Maria. Em Carazinho e em toda a região norte do RS, o Corpo de Bombeiros Militar (CBMRS) é o órgão responsável pela análise e aprovação dos projetos.</p>
<h2>O que mudou em 2025 e 2026?</h2>
<p>O Governo do RS prorrogou os prazos de adequação, e em 2025 o CBMRS publicou diversas novas Resoluções Técnicas que atualizaram as exigências. Entre as principais novidades: a Resolução Técnica CBMRS nº 09/2025 sobre controle de materiais de acabamento e revestimento, em vigor para PPCIs protocolados a partir de novembro de 2025; e a Resolução Técnica nº 18/2025, que define novas condições para sistemas de detecção e alarme de incêndio. Além disso, novos normativos para sistemas fotovoltaicos e hidrantes entram em vigor a partir de 1º de julho de 2026.</p>
<p>O prazo para protocolar o PPCI junto ao CBMRS era 27 de dezembro de 2025. As medidas de segurança aprovadas no PPCI devem estar instaladas até 27 de dezembro de 2027, após a emissão do Certificado de Aprovação.</p>
<h2>Quais estabelecimentos precisam de PPCI em Carazinho?</h2>
<p>Toda edificação comercial, industrial, de serviços, templos, clubes e condomínios que excedam os limites do Plano Simplificado (PSPCI) precisam do PPCI completo. Para casas noturnas e estabelecimentos de entretenimento, não há prorrogação: a regularização é imediata e obrigatória.</p>
<h2>Como funciona o processo em Carazinho/RS?</h2>
<p>O processo passa pela elaboração do projeto por um engenheiro habilitado com ART registrada no CREA-RS, protocolo no sistema do CBMRS (SOL-CBMRS), análise técnica, aprovação e obtenção do Alvará de Prevenção e Proteção Contra Incêndio (APPCI). Somente com o APPCI é possível obter alvarás municipais definitivos de funcionamento em Carazinho.</p>
<h2>Precisa regularizar seu estabelecimento?</h2>
<p>Como engenheiro civil registrado no CREA-RS sob o número 243302, atuando em Carazinho e na região do Alto Uruguai e Missões, elaboro projetos PPCI completos e simplificados (PSPCI), com toda a documentação exigida pelo CBMRS. Entre em contato para uma análise do seu estabelecimento.</p>
<p><em>Fontes: Corpo de Bombeiros Militar do RS (bombeiros.rs.gov.br), Lei Complementar nº 14.376/2013, Decreto Estadual 57.393/2023, Fecomércio RS.</em></p>`
  },
  {
    title: "INSS de Obra em 2025: Como reduzir legalmente o valor a pagar usando CNO e SERO no RS",
    slug: "inss-obra-cno-sero-reducao-rio-grande-do-sul-2025",
    category: "INSS de Obras",
    excerpt: "Com a implantação do CNO e do SERO, o cálculo do INSS de obra mudou completamente. Entenda como o planejamento estratégico ainda na fase de projeto pode gerar economias de dezenas de milhares de reais para quem constrói no Rio Grande do Sul.",
    cover_image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200",
    published_at: "2026-02-03",
    published: true,
    content: `<h2>O que é o INSS de Obra e quem precisa pagar?</h2>
<p>O INSS de obra é a contribuição previdenciária incidente sobre a mão de obra utilizada na construção civil, obrigatória para toda obra que envolva contratação de trabalhadores — sejam empregados, autônomos ou empreiteiros. A responsabilidade é do proprietário da obra, e sem a regularização junto à Receita Federal não é possível emitir a Certidão Negativa de Débitos (CND), necessária para averbar a construção no cartório de imóveis.</p>
<h2>CNO e SERO: as ferramentas digitais que mudaram tudo</h2>
<p>Em 2025, a Receita Federal consolidou dois sistemas fundamentais: o Cadastro Nacional de Obras (CNO), que substituiu o antigo CEI e funciona como o "CPF da obra" — deve ser aberto em até 30 dias do início da construção, sob pena de multa —, e o Serviço Eletrônico para Aferição de Obras (SERO), que digitalizou o processo de cálculo do INSS, substituindo o antigo DISO. Todo o processo agora ocorre pelo portal e-CAC da Receita Federal.</p>
<h2>Como é possível reduzir legalmente o valor?</h2>
<p>A legislação prevê mecanismos legítimos de redução: o Fator Social (tabela que varia conforme a área construída, onde um único centímetro de diferença pode representar diferenças de R$ 2.905 a R$ 6.534 a mais), a utilização de concreto usinado, argamassa usinada, materiais pré-moldados e pré-fabricados, e a dedução da mão de obra de empreiteiras pessoa jurídica que já recolheu os encargos via eSocial. Com planejamento, obras no RS têm obtido economias superiores a R$ 30.000.</p>
<h2>Atenção: a integração digital aumentou os riscos em 2025</h2>
<p>O cruzamento automático de dados entre prefeituras, Receita Federal e cartórios tornou a obra irregular muito mais difícil de manter. Multas, embargo de obra, impossibilidade de venda e bloqueio de financiamentos são consequências diretas da falta de regularização.</p>
<h2>Como posso ajudar em Carazinho e na região?</h2>
<p>Analiso sua obra, elaboro o planejamento estratégico desde a fase de projeto, faço os cadastros e vinculações corretas no CNO, SERO e eSocial, e busco todas as reduções legalmente aplicáveis ao seu caso. Atendo proprietários, construtores e empresas em Carazinho, Passo Fundo, Sarandi, Palmeira das Missões e toda a região norte do RS.</p>
<p><em>Fontes: Receita Federal do Brasil, IN RFB 2.021/2021, IN RFB 2.061/2021, IN RFB 2.212/2024, Alpha GT Gestão Tributária.</em></p>`
  },
  {
    title: "Como regularizar seu imóvel em Carazinho/RS: passo a passo atualizado para 2026",
    slug: "regularizacao-imovel-carazinho-rs-passo-a-passo-2026",
    category: "Regularização de Imóveis",
    excerpt: "Imóvel sem habite-se, planta não averbada ou construção sem aprovação? Saiba exatamente quais documentos são exigidos pela Prefeitura de Carazinho e como um engenheiro civil pode resolver toda a burocracia para você.",
    cover_image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
    published_at: "2026-01-28",
    published: true,
    content: `<h2>Por que regularizar seu imóvel é urgente em 2026?</h2>
<p>A partir de 2025, o cruzamento digital de dados entre prefeitura, Receita Federal e cartórios tornou praticamente impossível esconder construções irregulares. Imóveis sem regularização não conseguem financiamento bancário, valem até 50% menos e não podem ser vendidos por escritura definitiva. Em Carazinho, a Prefeitura Municipal exige toda a documentação técnica para aprovação e licenciamento de obras.</p>
<h2>Documentos exigidos pela Prefeitura de Carazinho</h2>
<p>Para aprovação ou regularização de obra em Carazinho, a Secretaria Municipal exige: requerimento padrão, projeto arquitetônico assinado por profissional habilitado, ART (Anotação de Responsabilidade Técnica) registrada no CREA-RS, memorial descritivo ou laudo técnico, e — para usos comerciais e multifamiliares — o certificado de aprovação do PPCI emitido pelo Corpo de Bombeiros e eventuais licenciamentos ambientais. Para desmembramento e unificação de terrenos, é necessária ainda a certidão de infraestrutura básica e outros documentos específicos.</p>
<h2>As três esferas da regularização</h2>
<p>A regularização completa passa pela prefeitura (alvará e habite-se), pela Receita Federal (CNO e CND do INSS de obra) e pelo cartório de registro de imóveis (averbação da construção na matrícula). Sem completar as três etapas, o imóvel permanece irregular para todos os fins jurídicos.</p>
<h2>Novidades do Registro de Imóveis no RS em 2025</h2>
<p>A Corregedoria-Geral da Justiça do RS publicou em setembro de 2025 o Provimento nº 44/2025, que ampliou o rol de profissionais habilitados para subscrever documentos de responsabilidade técnica no registro de imóveis gaúcho, incluindo ART, TRT e RRT.</p>
<p><em>Fontes: Prefeitura Municipal de Carazinho (carazinho.rs.gov.br), Corregedoria-Geral da Justiça do RS, Receita Federal do Brasil.</em></p>`
  },
  {
    title: "O que é BIM e por que 90% dos projetos em Carazinho já usam Revit: vantagens reais para sua obra",
    slug: "bim-revit-projetos-carazinho-rs-vantagens",
    category: "BIM e Tecnologia",
    excerpt: "A metodologia BIM reduziu em até 92,8% as interferências entre projetos em estudos recentes. Entenda como essa tecnologia funciona, quais economias ela gera e por que escolher um engenheiro que domina o Revit faz diferença na sua obra em Carazinho/RS.",
    cover_image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200",
    published_at: "2026-02-10",
    published: true,
    content: `<h2>O que é BIM na prática?</h2>
<p>BIM (Building Information Modeling, ou Modelagem da Informação da Construção) é uma metodologia que vai muito além do desenho 3D. No BIM, cada elemento do projeto — uma parede, uma viga, uma tubulação — carrega consigo informações como material, dimensões, custo e especificações técnicas. O principal software utilizado é o Autodesk Revit, e ferramentas como o Navisworks permitem detectar automaticamente conflitos entre diferentes disciplinas do projeto.</p>
<h2>Por que isso importa para quem está construindo?</h2>
<p>Pesquisas recentes demonstraram que a compatibilização de projetos via BIM reduziu em 92,8% as interferências detectadas no modelo digital antes de chegar ao canteiro de obras. Cada interferência corrigida na fase de projeto custa muito menos do que resolver o mesmo problema durante a execução — estimativas indicam economia de 5% a 8% no custo total da edificação.</p>
<h2>O Decreto Federal e a obrigatoriedade crescente do BIM</h2>
<p>O Decreto Federal nº 10.306/2020 já tornou obrigatório o uso de BIM em obras e serviços de engenharia da administração pública federal. Isso significa que projetos para órgãos públicos em Carazinho, Passo Fundo e toda a região norte do RS já exigem essa metodologia, e a tendência é que o setor privado siga o mesmo caminho.</p>
<h2>Minha abordagem: 90% dos projetos entregues em BIM</h2>
<p>Como engenheiro civil atuando em Carazinho desde 2011, já transitei do AutoCAD para o Revit e hoje entrego mais de 90% dos projetos em BIM. Isso significa mais precisão, menos surpresas na obra, compatibilização de projetos arquitetônico, estrutural, elétrico e hidrossanitário em um único modelo, e orçamentos mais confiáveis para você.</p>
<p><em>Fontes: RECIEC – Revista Científica de Engenharia Civil (2025), CONFEA, Decreto Federal nº 10.306/2020, Cadbim.com.br.</em></p>`
  },
  {
    title: "Desmembramento e unificação de terrenos em Carazinho: o que é, quando fazer e como funciona o processo",
    slug: "desmembramento-unificacao-terrenos-carazinho-rs",
    category: "Regularização de Imóveis",
    excerpt: "Quer dividir um terreno entre herdeiros, vender parte do lote ou unificar duas matrículas? Saiba como funciona o processo de desmembramento e unificação de terrenos em Carazinho/RS e quais documentos a Prefeitura exige.",
    cover_image: "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=1200",
    published_at: "2025-12-10",
    published: true,
    content: `<h2>Quando é preciso desmembrar ou unificar um terreno?</h2>
<p>O desmembramento (ou desdobro) é necessário quando você deseja dividir um único lote em dois ou mais lotes menores — seja para venda, partilha entre herdeiros ou construção de novas edificações independentes. A unificação, ao contrário, reúne duas ou mais matrículas em uma só — útil quando você adquiriu lotes vizinhos e deseja construir um empreendimento único.</p>
<h2>Como funciona o processo em Carazinho?</h2>
<p>A Prefeitura de Carazinho exige, para desmembramento, documentação específica incluindo comprovante de pagamento de taxa para diretrizes, planta da gleba em escala 1:2.500, certidão de infraestrutura básica dos logradouros lindeiros emitida pelo órgão municipal, declarações de disponibilidade de água, esgoto, iluminação e energia, além de declaração sobre coleta de resíduos sólidos emitida pela Secretaria de Obras. Para pessoas jurídicas, são necessárias cópias do contrato social.</p>
<h2>Qual é o papel do engenheiro nesse processo?</h2>
<p>O engenheiro civil é o profissional habilitado para elaborar as plantas técnicas, o memorial descritivo, registrar a ART no CREA-RS e dar entrada na Prefeitura e no Cartório de Registro de Imóveis. Um erro na planta ou na documentação pode atrasar meses o processo.</p>
<h2>Atendimento em toda a região norte do RS</h2>
<p>Atendo clientes em Carazinho, Sarandi, Palmeira das Missões, Passo Fundo, Tupanciretã, Cruz Alta e municípios vizinhos para serviços de desmembramento, unificação, averbação de construção e demolição. Entre em contato para verificar sua situação.</p>
<p><em>Fontes: Prefeitura Municipal de Carazinho — Documentação para Aprovação (carazinho.rs.gov.br/secretarias), Registro de Imóveis do Brasil.</em></p>`
  },
  {
    title: "Reconstrução do RS pós-enchentes: o que muda para proprietários que precisam de engenharia e regularização",
    slug: "reconstrucao-rs-enchentes-engenharia-regularizacao-2025",
    category: "Engenharia Civil",
    excerpt: "Com R$ 82 bilhões investidos na reconstrução do Rio Grande do Sul após a enchente de 2024, proprietários de imóveis afetados precisam de atenção redobrada à regularização, laudos e projetos técnicos para acessar recursos e reconstruir com segurança.",
    cover_image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200",
    published_at: "2025-11-20",
    published: true,
    content: `<h2>A maior tragédia climática do RS e seus impactos na engenharia</h2>
<p>As enchentes de 2024 no Rio Grande do Sul movimentaram um investimento de R$ 82 bilhões para a reconstrução do estado — considerado o maior apoio federal a um desastre climático na história do Brasil. Com isso, veio também a necessidade urgente de laudos técnicos, perícias e projetos de reconstrução para centenas de propriedades afetadas em todo o norte gaúcho.</p>
<h2>Por que o laudo técnico é fundamental?</h2>
<p>Para acessar linhas de crédito, programas habitacionais e indenizações após desastres naturais, o proprietário precisa de documentação técnica que ateste os danos sofridos pela edificação. O laudo técnico elaborado por engenheiro civil com ART registrada no CREA-RS é o documento aceito por bancos, seguradoras e órgãos públicos.</p>
<h2>PPCI danificado pela enchente: atenção especial</h2>
<p>O CBMRS publicou as Instruções Normativas nº 060/2025 e nº 063/2025 especificamente para tratar dos PPCIs danificados pelas enchentes de 2024, estabelecendo procedimentos simplificados para reapresentação. Estabelecimentos comerciais e industriais em cidades afetadas na região precisam verificar a situação do seu PPCI junto ao Corpo de Bombeiros.</p>
<h2>Reconstruir com engenharia: evite problemas futuros</h2>
<p>Reconstruções feitas sem projeto aprovado e sem ART ficam irregulares junto à Prefeitura e à Receita Federal, gerando dificuldades na venda futura e impossibilidade de averbação. Oriente-se com um profissional antes de iniciar a obra.</p>
<p><em>Fontes: Agência Gov — Ministério da Casa Civil (gov.br), CBMRS Instruções Normativas 060 e 063/2025.</em></p>`
  },
  {
    title: "Incorporação imobiliária no norte gaúcho: o que é, quando é obrigatória e como funciona em Carazinho",
    slug: "incorporacao-imobiliaria-carazinho-rs-norte-gaucho",
    category: "Incorporação de Imóveis",
    excerpt: "Quer construir e vender apartamentos ou unidades comerciais antes da conclusão da obra? Entenda o que é incorporação imobiliária, quando ela é obrigatória pela Lei 4.591/64 e como funciona o processo em Carazinho e na região de Passo Fundo.",
    cover_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
    published_at: "2025-10-14",
    published: true,
    content: `<h2>O que é incorporação imobiliária?</h2>
<p>Incorporação imobiliária é o conjunto de atividades exercidas com o objetivo de construir e alienar unidades autônomas de um edifício — apartamentos, salas comerciais, lojas — antes ou durante a execução da obra. É regulada pela Lei Federal nº 4.591/1964 e é obrigatória para qualquer empreendimento que pretenda vender unidades "na planta" em Carazinho e em todo o Brasil.</p>
<h2>Quando a incorporação é necessária?</h2>
<p>Sempre que houver venda de fração ideal de terreno vinculada a unidade autônoma em construção. Sem o registro de incorporação no cartório de imóveis, a venda das unidades é irregular e pode ser anulada judicialmente, com graves consequências para o incorporador.</p>
<h2>O CUB RS como base de cálculo</h2>
<p>O Custo Unitário Básico (CUB) do Rio Grande do Sul, calculado mensalmente pelo Sinduscon-RS, é a referência para contratos de incorporação e reajustes. A categoria principal no RS é a R8-N (residencial multifamiliar, padrão normal). Contratos de incorporação em Carazinho e na região normalmente utilizam o CUB-RS como indexador.</p>
<h2>Documentação e responsabilidade técnica</h2>
<p>O processo de incorporação requer projetos completos aprovados pela prefeitura, orçamento da construção baseado no CUB, memorial de incorporação, convenção de condomínio e registro em cartório. O engenheiro civil é responsável técnico pelo projeto e pela ART correspondente.</p>
<p><em>Fontes: Lei Federal nº 4.591/1964, Sinduscon-RS — Tabela de Preços e Custos (Janeiro/2025), ABNT NBR 12721.</em></p>`
  },
  {
    title: "Cálculos estruturais: por que economizar no projeto pode custar muito caro na sua obra em Carazinho",
    slug: "calculos-estruturais-projeto-obra-carazinho-rs",
    category: "Cálculos Estruturais",
    excerpt: "Estruturas subdimensionadas, vigas e pilares mal calculados e interfaces mal resolvidas entre projetos são as principais causas de patologias em construções no norte gaúcho. Entenda como um cálculo estrutural bem feito protege sua obra e seu patrimônio.",
    cover_image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200",
    published_at: "2025-09-05",
    published: true,
    content: `<h2>O que são os cálculos estruturais e por que eles importam?</h2>
<p>Os cálculos estruturais determinam o dimensionamento de todos os elementos que sustentam uma edificação: fundações, pilares, vigas, lajes e escadas. No Rio Grande do Sul, a NBR 6118 (Projeto de Estruturas de Concreto Armado) é a norma de referência, e o seu descumprimento pode resultar em patologias graves, interdicções pelo Corpo de Bombeiros e até colapso estrutural.</p>
<h2>Compatibilização BIM: quando estrutura e instalações "conversam"</h2>
<p>Um erro clássico em obras no norte gaúcho é a falta de compatibilização entre o projeto estrutural e os projetos de instalações. Tubulações que passam onde deveria estar uma viga, conduítes embutidos em pilares (o que viola a NBR 6118) e forros que colidem com estruturas são problemas frequentes quando cada disciplina é projetada de forma isolada. Com o BIM e o Navisworks, detectamos e resolvemos esses conflitos na fase de projeto — antes que eles se tornem problemas no canteiro.</p>
<h2>Pré-moldados e silos graneleiros: especialidade na região</h2>
<p>A região de Carazinho e do norte gaúcho tem forte atividade agroindustrial, com grande demanda por silos, armazéns graneleiros e estruturas pré-moldadas. Tenho formação específica em projetos de cálculo e estruturas em silos e pré-moldados, atendendo produtores rurais e cooperativas da região com projetos tecnicamente seguros e economicamente eficientes.</p>
<h2>Pós-Graduação em Estruturas de Concreto Armado</h2>
<p>Além da formação em Engenharia Civil pela Ulbra (2019), conclui Pós-Graduação em Estruturas de Concreto Armado (2022), o que me permite assinar projetos estruturais com profundidade técnica e responsabilidade perante o CREA-RS. Atendo desde residências unifamiliares em Carazinho até galpões industriais e estruturas de múltiplos pavimentos.</p>
<p><em>Fontes: ABNT NBR 6118:2014 — Projeto de Estruturas de Concreto, RECIEC – Revista Científica de Engenharia Civil (2025).</em></p>`
  }
];

export default function SeedBlog() {
  const [status, setStatus] = useState<string>('Pronto para inserir');
  const [done, setDone] = useState(false);

  const seed = async () => {
    setStatus('Inserindo...');
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(blogPosts)
      .select();

    if (error) {
      setStatus(`Erro: ${error.message}`);
    } else {
      setStatus(`✅ ${data.length} posts inseridos com sucesso!`);
      setDone(true);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', background: '#0A0C0F', color: '#F1F5F9', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 20 }}>Seed Blog Posts</h1>
      <p style={{ marginBottom: 20 }}>{status}</p>
      {!done && (
        <button
          onClick={seed}
          style={{ background: '#F59E0B', color: '#000', padding: '12px 24px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}
        >
          Inserir 8 Posts
        </button>
      )}
    </div>
  );
}
