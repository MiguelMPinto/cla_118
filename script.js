async function loadJSON() {
    const res = await fetch("data/progresso_caminheiros.json");
    return await res.json();
}


const AREA_MAP = {
    F: ["nan.1", "Unnamed: 22", "Unnamed: 23", "Unnamed: 24", "Unnamed: 25", "Unnamed: 26"],
    A: ["nan.2", "Unnamed: 28", "Unnamed: 29", "Unnamed: 30", "Unnamed: 31", "Unnamed: 32"],
    C: ["nan.3", "Unnamed: 34", "Unnamed: 35", "Unnamed: 36", "Unnamed: 37", "Unnamed: 38", "Unnamed: 39", "Unnamed: 40"],
    E: ["nan.4", "Unnamed: 42", "Unnamed: 43", "Unnamed: 44", "Unnamed: 45", "Unnamed: 46", "Unnamed: 47", "Unnamed: 48"],
    I: ["nan.5", "Unnamed: 50", "Unnamed: 51", "Unnamed: 52", "Unnamed: 53", "Unnamed: 54", "Unnamed: 55"],
    S: ["nan.6", "Unnamed: 57", "Unnamed: 58", "Unnamed: 59", "Unnamed: 60", "Unnamed: 61", "Unnamed: 62"]
};

async function trilhosPageMain() {

    const nav = document.querySelector(".trilhos-nav");
    const content = document.getElementById("trilhos-content");

    // Se não existir → não estamos na página trilhos.html
    if (!nav || !content) return;

    const data = await loadJSON();
    const pessoas = data.Caminheiros;

    document.querySelectorAll(".trilhos-nav button").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".trilhos-nav button")
                .forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const area = btn.dataset.area;
            const campos = AREA_MAP[area];
            let html = `<div class="trilhos-area-card trilhos-area-${area.toLowerCase()}">`;

            campos.forEach((campo, i) => {
                html += `
  <div class="trilho">
    <div class="trilho-title">${area}${i + 1}</div>
    <ul class="trilho-list">
`;


                pessoas.forEach(p => {
                    const nome = p["Unnamed: 10"];
                    if (!nome) return;

                    const estado = p[campo];
                    html += `<li>
              ${estado === "Validado"
                            ? `<span class="ok">✔</span>`
                            : `<span class="no">✖</span>`}
              ${nome}
          </li>`;
                });

                html += `</ul></div>`;
            });

            html += "</div>";
            content.innerHTML = html;
        };
    });
    // Abrir Físico por defeito
    document.querySelector('.trilhos-nav button[data-area="F"]')?.click();


}

trilhosPageMain();
