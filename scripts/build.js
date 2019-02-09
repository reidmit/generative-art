const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const rimraf = require('rimraf');

const config = {
  indexTemplate: './index-template.html',
  sketchTemplate: './sketch-template.html',
  sketchDirectory: '../sketches/',
  outputDirectory: '../build/'
};

const buildDirectory = path.resolve(__dirname, config.outputDirectory);

rimraf.sync(buildDirectory);

fs.mkdirSync(buildDirectory);

const indexTemplate = fs.readFileSync(
  path.resolve(__dirname, config.indexTemplate),
  'utf8'
);

const sketchTemplate = fs.readFileSync(
  path.resolve(__dirname, config.sketchTemplate),
  'utf8'
);

const sketches = fs.readdirSync(
  path.resolve(__dirname, config.sketchDirectory)
);

const wrapScript = script => {
  return `<script>\n\n${script.trim()}\n\n</script>`;
};

sketches.forEach(fileName => {
  const sketchJs = fs.readFileSync(
    path.resolve(__dirname, config.sketchDirectory, fileName)
  );

  const title = fileName.replace(/\.js$/, '');
  const sketchScript = wrapScript(sketchJs.toString());

  const sketchHtml = mustache.render(sketchTemplate, { title, sketchScript });

  fs.writeFileSync(path.resolve(buildDirectory, `${title}.html`), sketchHtml);
});

const indexHtml = mustache.render(indexTemplate, {
  sketches: sketches.map(fileName => ({
    name: fileName.replace(/\.js$/, '')
  }))
});

fs.writeFileSync(path.resolve(buildDirectory, `index.html`), indexHtml);
