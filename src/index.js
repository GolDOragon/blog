import { addTwo } from './add.ts';

const h1 = document.createElement('h1');
h1.innerText = 'Hello javascript';
document.body.append(h1);

document.body.append(addTwo(1, 2));
