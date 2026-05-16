export const categoriaComponent = (data) => {
    data.title = data.title.toUpperCase()

    return `
            <a href="${data.url}" class="link-card">
            <div class="categoria-productos">
                <div class="cat-img">
                    <img src="${data.img}" alt="${data.title}">
                </div>
                <div class="cat-info">
                    <h1>${data.title}</h1>
                    <h2>${data.descripcion}</h2>
                    <a href="#">ver más</a>
                </div>
            </div>
            </a>
            `
}