const owner = "iamdaven";
const repo = "Korone-Music-Repository";
let songs = [];

async function loadSongs() {
    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/entries`
    );
    const files = await res.json();
    const iniFiles = files.filter(f => f.name.endsWith(".ini"));
    songs = await Promise.all(
        iniFiles.map(async (file) => {
            const text = await fetch(file.download_url).then(r => r.text());
            const name = text.match(/name:\s*(.+)/i)?.[1] || "Unknown";
            const id = text.match(/id:\s*(.+)/i)?.[1] || "";
            const url = text.match(/url:\s*(.+)/i)?.[1] || "";
            return { file: file.name, name, id, url };
        })
    );
    render(songs);
}

function render(list) {
    const box = document.getElementById("results");
    box.innerHTML = list.map(s => `
        <div class="entry" onclick="openSong('${s.file}')">
            ${s.name}
        </div>
    `).join("");
}

function openSong(file) {
    const song = songs.find(s => s.file === file);
    if (!song || !song.id) return;
    location.href = `https://www.pekora.zip/library/${song.id}`;
}

document.getElementById("search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    render(
        songs.filter(s => s.name.toLowerCase().includes(q))
    );
});

loadSongs();
