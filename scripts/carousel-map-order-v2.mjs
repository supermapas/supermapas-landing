import fs from 'node:fs';

const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/carousel-map-order-v2.mjs <html-file>');
let html = fs.readFileSync(target, 'utf8');

const concordanceOld = '1a67b8_c3225c09f1d342eb80d4ecad55949b12~mv2.png';
const seMap = '1a67b8_6992bb8be0254d2eb1365f645d700083~mv2.png';
html = html.replaceAll(concordanceOld, seMap).replaceAll('Concordância verbal', 'Funções da palavra SE');

const figure = "['1a67b8_4a00ecc7a0714bc4946bbc1cdafdd8e8~mv2.png','Figuras de pensamento'],\n";
const classification = "['1a67b8_ee950fcb35dd46d6aa3cac85c3018a1e~mv2.png','Classificação dos verbos'],\n";
if (html.includes(figure) && html.includes(classification)) {
  html = html.replace(figure, '');
  html = html.replace(classification, classification + ' ' + figure);
}

fs.writeFileSync(target, html);
console.log('Map sample replacement and ordering v2 applied.');
