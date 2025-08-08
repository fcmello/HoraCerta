# HoraCerta — Chrome Extension Kit (Manifest V3)

Este kit transforma seu projeto (Vite + React) em uma extensão do Chrome que abre o app no **popup**.

## Como usar (2 minutos)

1. **Copie** os arquivos deste kit para a **raiz do projeto HoraCerta** (onde está `package.json`).
   - Vai ficar assim: `manifest.json`, `icons/`, `README-EXTENSION.md` ao lado de `index.html` e `vite.config.ts`.
2. Abra `vite.config.ts` e garanta que tenha `base: './'` dentro de `defineConfig({ ... })`.
3. Gere o build:
   ```bash
   npm install
   npm run build
   ```
4. No Chrome, vá para `chrome://extensions`, ative **Developer mode** e clique em **Load unpacked**.
5. Selecione a pasta **dist/** do projeto. A extensão aparecerá como **HoraCerta** e o popup abrirá seu app **offline**.

## Dica
- Sem permissões especiais. Se quiser que abra em **aba** ao clicar no ícone, você pode criar uma página `page.html` e apontar o `default_popup` para ela, ou abrir `index.html` em uma nova aba via `chrome.action.onClicked` (exige background service worker).

Pronto! Agora o HoraCerta funciona como extensão do Chrome.
