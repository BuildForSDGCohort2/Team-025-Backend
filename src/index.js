import app from './app_old';

const startApp = async () => {
  const header = document.querySelector('[data-app-name]');
  if (!header) return;

  const programName = await app();
  header.textContent = programName;
};

document.addEventListener('DOMContentLoaded', startApp);
