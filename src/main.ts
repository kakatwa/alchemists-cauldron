import './styles/style.css';
import { renderWelcome } from './ui/welcome';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('The application root is missing.');
}

renderWelcome(app);
