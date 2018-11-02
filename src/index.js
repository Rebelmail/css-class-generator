/* eslint-disable no-restricted-syntax */

const validFirstCharacters = 'abcdefghijklmnopqrstuvwxyz';
const validSecondCharacters = `${validFirstCharacters}0123456789`;

function* firstCharacters() {
  yield* validFirstCharacters;
}

function* secondCharacters() {
  yield* validSecondCharacters;
}

function* prepend(item, iter) {
  for (const iterItem of iter) {
    yield item + iterItem;
  }
}

function* append(item, iter) {
  for (const iterItem of iter) {
    yield iterItem + item;
  }
}

function* appendGenerator(generator, iter) {
  for (const iterItem of iter) {
    yield* append(iterItem, generator());
  }
}

function* nSecondCharacters(n) {
  if (n === 1) {
    yield* secondCharacters();
    return;
  }

  yield* appendGenerator(secondCharacters, nSecondCharacters(n - 1));
}

function* allSecondCharacters() {
  let n = 1;
  while (true) { // eslint-disable-line
    yield* nSecondCharacters(n);
    n += 1;
  }
}

const validIdent = /^-?[_a-z][_a-z0-9-]*$/i;

module.exports = function* cssNameGenerator(prefix) {
  if (prefix && prefix !== '-' && !validIdent.test(prefix)) {
    throw new Error(`Expected prefix (${prefix}) to be a valid css class name`);
  }

  if (!prefix) {
    yield* firstCharacters();
    yield* appendGenerator(firstCharacters, allSecondCharacters());
  } else if (prefix === '-') {
    const firstSecondChars = appendGenerator(firstCharacters, allSecondCharacters());
    yield* prepend(prefix, firstSecondChars);
  } else {
    yield* prepend(prefix, allSecondCharacters());
  }
};
