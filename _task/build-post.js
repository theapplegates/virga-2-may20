const {resolve} = require('path');
const fs = require('fs');

const qoa = require('qoa');
const signale = require('signale');
const matter = require('gray-matter');
const slugify = require('slugify');

// Import data files
const {author} = require('../src/_data/site.json');

// Posts location
const POSTS_DIR = resolve(__dirname, '../src/posts');

// Helper Function to return unknown errors
const handleError = (err) => {
  signale.fatal(err);
  process.exit(1);
};

// Helper Function to format date into YYYY-MM-DD
const yyyymmddify = (date) => {
  return date.toISOString().split('T')[0];
};

const ps = [
  {
    type: 'input',
    query: `Enter new post title:`,
    handle: 'title',
  },
];

const main = async () => {
  const options = await qoa.prompt(ps);

  return matter.stringify('', {
    title: options.title,
    desc: '',
    date: new Date(),
    author: author.name,
  });
};

main().then((result) => {
  const {data} = matter(result);
  const filePath = `${POSTS_DIR}/${yyyymmddify(data.date)}-${slugify(data.title, {
    lower: true,
  })}.md`;
  try {
    signale.success(`Creating new post: ${filePath}`);
    fs.writeFileSync(filePath, result, 'utf-8');
  } catch (err) {
    handleError(err);
  }
});
