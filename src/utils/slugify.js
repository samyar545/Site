const slugify = require('slugify');

function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()\"'!:@]/g
  });
}

module.exports = createSlug;
