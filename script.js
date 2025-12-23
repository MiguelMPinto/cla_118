export async function loadJSON() {

    const url = "https://docs.google.com/spreadsheets/d/1OA5qwCKT6HayWwdS2dRL5NzVydUvf0F5N_MidzQk468/gviz/tq?tqx=out:json";

    const res = await fetch(url);
    const text = await res.text();

    // Google devolve JSON embrulhado → cortar início e fim
    const json = JSON.parse(text.substring(47, text.length - 2));

    const cols = json.table.cols;   // Definição das colunas
    const rows = json.table.rows;   // Dados

    const lista = rows.map(r => {
        const obj = {};

        r.c.forEach((cell, i) => {
            const key =
                cols[i].label?.trim() ||        // Nome “bonito” da coluna
                cols[i].id ||                   // Id interno
                `col${i}`;                      // fallback

            obj[key] = cell ? cell.v : null;
        });

        return obj;
    });

    return { Caminheiros: lista };
}



const AREA_MAP = {
    F: ["F1", "F2", "F3", "F4", "F5", "F6"],
    A: ["A1", "A2", "A3", "A4", "A5", "A6"],
    C: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"],
    E: ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"],
    I: ["I1", "I2", "I3", "I4", "I5", "I6", "I7"],
    S: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"]
};

export function parseSheetDate(str) {
    if (!str) return "-";

    const m = str.match(/Date\((\d+),(\d+),(\d+)\)/);
    if (!m) return str;

    const year = m[1];
    const month = Number(m[2]) + 1; // meses vêm 0-based
    const day = m[3];

    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
}

function getAreaItems(obj, letraArea) {
    return Object.keys(obj)
        .filter(k => k.match(new RegExp(`${letraArea}[0-9]+$`, "i")))
        .map(k => ({
            codigo: k.match(/([A-Z]\d+)$/i)[1],
            estado: obj[k]
        }));
}


async function trilhosPageMain() {

  const nav = document.querySelector(".trilhos-nav");
  const content = document.getElementById("trilhos-content");

  if (!nav || !content) return;

  const data = await loadJSON();
  const pessoas = data.Caminheiros;

  document.querySelectorAll(".trilhos-nav button").forEach(btn => {

    btn.onclick = () => {

      document.querySelectorAll(".trilhos-nav button")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const area = btn.dataset.area;

      let html = `<div class="trilhos-area-card trilhos-area-${area.toLowerCase()}">`;

      // Para cada objetivo dessa área (F1..F6, A1..A6 etc)
      AREA_MAP[area].forEach(codigo => {

        html += `
        <div class="trilho">
          <div class="trilho-title">${codigo}</div>
          <ul class="trilho-list">
        `;

        // Percorrer todas as pessoas
        pessoas.forEach(p => {
          const nome = p["Nome"];
          if (!nome) return;

          // Apanhar os objetivos dessa área
          const objetivos = getAreaItems(p, area);

          const obj = objetivos.find(o => o.codigo === codigo);

          const estado = obj?.estado?.trim() || "-";

          html += `
            <li>
              ${estado === "Validado"
                ? `<span class="ok">✔</span>`
                : `<span class="no">✖</span>`}
              ${nome}
            </li>
          `;
        });

        html += `</ul></div>`;
      });

      html += `</div>`;
      content.innerHTML = html;
    };
  });

  // abrir F por defeito
  document.querySelector('.trilhos-nav button[data-area="F"]')?.click();
}


trilhosPageMain();

