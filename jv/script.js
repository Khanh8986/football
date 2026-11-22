
const KEY = "8afd3c95d7f750057cd0fceebe22b4e7";
const leagues = {
    39: "Premier League",
    140: "La Liga",
    135: "Serie A",
    78: "Bundesliga",
    61: "Ligue 1"
};

const league = document.getElementById("league");
const season = document.getElementById("season");
const round = document.getElementById("round");
const matches = document.getElementById("matches");
const table = document.getElementById("table");
const topScorers = document.getElementById("top-scorers");
const topAssists = document.getElementById("top-assists");


const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");

const currentUser = localStorage.getItem("current_user");

if (league) {
    league.innerHTML = "";
        for (let id in leagues) {
            league.innerHTML += `
            <option value="${id}">
                ${leagues[id]}
            </option>`;
        }
}


function api(url) {
    return fetch(url, {
        headers: {
            "x-apisports-key": KEY
        }
    })
    .then(res => res.json());
}


function getRounds() {

    if (!league || !season || !round) return;

    if (!season.value) return;

    api(
        `https://v3.football.api-sports.io/fixtures?league=${league.value}&season=${season.value}`
    )
    .then(data => {

        let arr = [];

        data.response.forEach(x => {

            let r = x.league.round;

            if (r && !arr.includes(r)) {
                arr.push(r);
            }
        });

        round.innerHTML = "";

        arr.forEach(r => {
            round.innerHTML += `<option value="${r}">${r}</option>`;
        });
    });
}





if (league) league.onchange = getRounds;
if (season) season.onchange = getRounds;

getRounds();

const loadBtn = document.getElementById("load");


if (loadBtn) {

    loadBtn.onclick = () => {

        api(
            `https://v3.football.api-sports.io/fixtures?league=${league.value}&season=${season.value}&round=${round.value}`
        )
        .then(data => {
    
            matches.innerHTML = "";
    
            data.response.forEach(x => {
    
                matches.innerHTML += `
                <div class="match">
    
                    <img src="${x.teams.home.logo}">
                    ${x.teams.home.name}
    
                    <b>
                        ${x.goals.home ?? "-"} : ${x.goals.away ?? "-"}
                    </b>
    
                    ${x.teams.away.name}
                    <img src="${x.teams.away.logo}">
    
                </div>`;
            });
    
            getTable();
            getTopPlayers();
        });
    };
    
}


function getTable() {

    api(
        `https://v3.football.api-sports.io/standings?league=${league.value}&season=${season.value}`
    )
    .then(data => {

        if (!table) return;

        table.innerHTML = "";

        let teams = data.response?.[0]?.league?.standings?.[0] || [];

        teams.forEach((x, i) => {

            table.innerHTML += `
            <tr>

                <td>${i + 1}</td>

                <td class="club">
                    <img src="${x.team.logo}">
                    ${x.team.name}
                </td>

                <td>${x.all.played}</td>

                <td>${x.points}</td>

            </tr>`;
        });
    });
}


function getTopPlayers() {

    api(
        `https://v3.football.api-sports.io/players/topscorers?league=${league.value}&season=${season.value}`
    )
    .then(scorerData => {

        console.log("TOP SCORER:", scorerData);

        const scorer = scorerData.response?.[0];

        if (scorer) {
            topScorers.innerHTML = `
                <img src="${scorer.player.photo}" width="50">
                <b>${scorer.player.name}</b>
                - ${scorer.statistics[0].goals.total} bàn
            `;
        }
    });


    api(
        `https://v3.football.api-sports.io/players/topassists?league=${league.value}&season=${season.value}`
    )
    .then(assistData => {

        console.log("TOP ASSIST:", assistData);

        const assist = assistData.response?.[0];

        if (assist) {
            topAssists.innerHTML = `
                <img src="${assist.player.photo}" width="50">
                <b>${assist.player.name}</b>
                - ${assist.statistics[0].goals.assists || 0} kiến tạo
            `;
        } else {
            topAssists.innerHTML = "Không có dữ liệu";
        }
    });
}

if (loginBtn) {
    loginBtn.onclick = () => location.href = "login.html";
}


if (registerBtn) {
    registerBtn.onclick = () => location.href = "register.html";
}