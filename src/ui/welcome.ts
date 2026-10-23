export function renderWelcome(container: HTMLElement): void {
  const main = document.createElement('main');
  main.className = 'welcome';

  const label = document.createElement('p');
  label.className = 'welcome__label';
  label.textContent = 'RS School project';

  const title = document.createElement('h1');
  title.textContent = "Alchemist's Cauldron";

  const description = document.createElement('p');
  description.textContent =
    'A future potion game about mixing ingredients and matching recipes.';

  const status = document.createElement('p');
  status.className = 'welcome__status';
  status.textContent =
    'The project foundation is being prepared. Gameplay is not implemented yet.';

  main.append(label, title, description, status);
  container.replaceChildren(main);
}
