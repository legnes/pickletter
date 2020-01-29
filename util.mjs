const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const temp = arr[i];
    const idx = Math.floor(Math.random() * (i + 1));
    arr[i] = arr[idx];
    arr[idx] = temp;
  }
  return arr;
};

const firstLetterOf = (letters, key) => {
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    if (letter.matches(key)) return letter;
  }
  return null;
}

const renderLetters = (letters) => letters.reduce((word, letter) => (word + letter.key), '');

export { shuffle, firstLetterOf, renderLetters };