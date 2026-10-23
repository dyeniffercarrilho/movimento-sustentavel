# Movimento Sustentável

Site estático (HTML + CSS + um pouco de JS) do projeto Movimento Sustentável da E.E. Profa. Floriana Lopes (Dourados/MS).

- `index.html`: conteúdo de todas as seções
- `style.css`: visual (cores no topo, em `:root`)
- `script.js`: menu do celular, filtros da galeria, "ver mais", lightbox e animações
- `img/full/`: fotos grandes (abrem ao tocar na galeria)
- `img/thumb/`: fotos pequenas (aparecem na página)
- `video/`: reportagem comprimida + imagem de capa

Para adicionar uma foto na galeria: salve a versão grande em `img/full/` e a pequena em `img/thumb/` com o mesmo nome,
depois copie um `<button class="gallery__item">` no `index.html` e troque `data-cat`, `src` e `alt`.
