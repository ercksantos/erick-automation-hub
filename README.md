# erickai.com.br

Site da Erick.AI, a marca de Erick Santos: agentes de IA no WhatsApp, CRM e sistemas sob medida para pequenas e médias empresas.

## Stack

- React 18 + TypeScript + Vite
- GSAP (ScrollTrigger, SplitText, Flip) e Lenis para a rolagem e as animações
- CSS próprio em `src/styles/site.css` (paleta grafite-âmbar, fontes Mona Sans e JetBrains Mono em `public/fonts`)
- Tailwind + shadcn só no teste grátis e nos diálogos
- Deploy na Vercel: push na `main` publica em https://erickai.com.br

## Onde mexer

| O quê | Onde |
|---|---|
| Todo o texto do site, serviços, projetos, links e WhatsApp | `src/content/site.ts` |
| Seções da home | `src/components/site/` |
| Visual (cores, tipografia, responsivo) | `src/styles/site.css` |
| Rolagem suave e GSAP | `src/lib/scroll.ts`, `src/lib/motion.ts` |
| Vídeos e capas dos projetos | `public/media/` |
| Dados da empresa (rodapé, políticas) | `src/lib/empresa.ts` |

## Rotas

- `/`: home
- `/privacidade` (com `#exclusao-de-dados`) e `/termos`: cadastradas no app da Meta, não mudar o endereço
- `/teste-gratis`: chat com agente real. Está no ar, mas sem link no site e fora do Google (`testeGratisVisivel` em `src/content/site.ts`) enquanto não houver crédito de LLM

## Formulário de contato

Envia para o n8n próprio (`https://n8n.erickai.com.br/webhook/contato-site`, fluxo "Site Erick.AI · Contato"), que grava na tabela `site_contatos`.

## Rodar

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # gera dist/
npm run preview  # confere o build
```

## Vídeos

Os vídeos de `public/media/` são comprimidos com ffmpeg (H.264, CRF 30, até 1280 px, 30 fps, `+faststart`):

```bash
ffmpeg -i entrada.mp4 -vf "scale='min(1280,iw)':-2,fps=30" -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart -an public/media/saida.mp4
```
