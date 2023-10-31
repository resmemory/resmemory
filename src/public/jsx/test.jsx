import _ from 'lodash';
function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['웹팩', '빌드', '성공'], ' ');

  return element;
}

document.body.appendChild(component());
