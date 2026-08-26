import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/creators-authority-polish-v1.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

// Remove the extra purple trust block above the actual Idealizadores section.
html = html.replace(/<div class="sm-behind-trust-v3">.*?<\/div>(?=<div class="sm-creators-shell">)/s, '');

// Strengthen creator authority copy without inventing credentials.
html = html.replace(
  '<h3>Edson Diniz</h3><p>Professor, criador e fundador dos SuperMapas.</p>',
  '<h3>Edson Diniz</h3><p>Empreendedor e criador dos Supermapas, há quase 10 anos transforma conteúdos de Língua Portuguesa em materiais visuais para estudo, revisão e sala de aula.</p>'
);

html = html.replace(
  '<h3>Odair Diniz</h3><p>Incentivador, colaborador e parte da história dos SuperMapas.</p>',
  '<h3>Odair Diniz</h3><p>Criador do Superdicas de Português e colaborador dos Supermapas, participa da pesquisa, troca de ideias e construção do projeto desde a sua trajetória inicial.</p>'
);

// Slightly refine the section intro to support authority instead of sentimentality alone.
html = html.replace(
  '<p>Um projeto que nasceu de uma ideia, cresceu com incentivo e continua sendo construído em família.</p>',
  '<p>Experiência prática, produção constante de conteúdo e uma trajetória construída em família por trás de cada material.</p>'
);

fs.writeFileSync(target, html);
console.log('Creators trust block removed and authority copy refined.');
