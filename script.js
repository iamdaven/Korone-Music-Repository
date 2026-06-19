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
            const lines = text.split(/\r?\n/);
            const get = (key) => {
                const line = lines.find(l => l.toLowerCase().startsWith(key + ":"));
                return line ? line.slice(key.length + 1).trim() : "";
            };
            return {
                file: file.name,
                name: get("name") || "Unknown",
                id: get("id"),
                url: get("url")
            };
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
    if (!song || !song.url) return;
    location.href = song.url;
}

document.getElementById("search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    render(songs.filter(s => s.name.toLowerCase().includes(q)));
});

loadSongs();
