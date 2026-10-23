const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rato = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    raio: 20,
    speed: 5,
    vida: 100
};

const teclas = {};
const tiros = [];
const inimigos = [];
let pontos = 0;

// Controles
document.addEventListener("keydown", e => teclas[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => teclas[e.key.toLowerCase()] = false);

// Atirar
canvas.addEventListener("click", e => {

    const rect = canvas.getBoundingClientRect();

    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const angulo = Math.atan2(my - rato.y, mx - rato.x);

    tiros.push({
        x: rato.x,
        y: rato.y,
        dx: Math.cos(angulo) * 10,
        dy: Math.sin(angulo) * 10,
        raio: 5
    });

});

// Criar inimigos
function criarInimigo(){

    let x;
    let y;

    if(Math.random() < 0.5){
        x = Math.random()*canvas.width;
        y = Math.random()<0.5 ? -30 : canvas.height+30;
    }else{
        x = Math.random()<0.5 ? -30 : canvas.width+30;
        y = Math.random()*canvas.height;
    }

    inimigos.push({
        x,
        y,
        raio:20,
        speed:2
    });

}

setInterval(criarInimigo,1500);

// Movimento
function mover(){

    if(teclas["w"]) rato.y -= rato.speed;
    if(teclas["s"]) rato.y += rato.speed;
    if(teclas["a"]) rato.x -= rato.speed;
    if(teclas["d"]) rato.x += rato.speed;

    rato.x = Math.max(rato.raio, Math.min(canvas.width-rato.raio,rato.x));
    rato.y = Math.max(rato.raio, Math.min(canvas.height-rato.raio,rato.y));

}

// Atualizar tiros
function atualizarTiros(){

    for(let i=tiros.length-1;i>=0;i--){

        tiros[i].x += tiros[i].dx;
        tiros[i].y += tiros[i].dy;

        if(
            tiros[i].x<0||
            tiros[i].x>canvas.width||
            tiros[i].y<0||
            tiros[i].y>canvas.height
        ){
            tiros.splice(i,1);
        }

    }

}

// Atualizar inimigos
function atualizarInimigos(){

    for(let i=inimigos.length-1;i>=0;i--){

        const e = inimigos[i];

        const ang = Math.atan2(rato.y-e.y,rato.x-e.x);

        e.x += Math.cos(ang)*e.speed;
        e.y += Math.sin(ang)*e.speed;

        // Colisão jogador
        const dx = rato.x-e.x;
        const dy = rato.y-e.y;

        if(Math.hypot(dx,dy)<rato.raio+e.raio){

            rato.vida--;

            if(rato.vida<=0){

                alert("Game Over!\nPontos: "+pontos);
                location.reload();

            }

        }

        // Colisão tiro
        for(let j=tiros.length-1;j>=0;j--){

            const tx = tiros[j].x-e.x;
            const ty = tiros[j].y-e.y;

            if(Math.hypot(tx,ty)<e.raio+tiros[j].raio){

                tiros.splice(j,1);
                inimigos.splice(i,1);
                pontos+=10;
                break;

            }

        }

    }

}

// Desenhar
function desenhar(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Jogador
    ctx.fillStyle="gray";
    ctx.beginPath();
    ctx.arc(rato.x,rato.y,rato.raio,0,Math.PI*2);
    ctx.fill();

    // Orelhas
    ctx.fillStyle="pink";

    ctx.beginPath();
    ctx.arc(rato.x-12,rato.y-18,8,0,Math.PI*2);
    ctx.arc(rato.x+12,rato.y-18,8,0,Math.PI*2);
    ctx.fill();

    // Tiros
    ctx.fillStyle="yellow";

    tiros.forEach(t=>{

        ctx.beginPath();
        ctx.arc(t.x,t.y,t.raio,0,Math.PI*2);
        ctx.fill();

    });

    // Inimigos
    ctx.fillStyle="red";

    inimigos.forEach(i=>{

        ctx.beginPath();
        ctx.arc(i.x,i.y,i.raio,0,Math.PI*2);
        ctx.fill();

    });

    // HUD
    ctx.fillStyle="white";
    ctx.font="22px Arial";
    ctx.fillText("Vida: "+rato.vida,20,30);
    ctx.fillText("Pontos: "+pontos,20,60);
    ctx.fillText("Arma: Agulha Rifle",20,90);

}

// Loop
function loop(){

    mover();
    atualizarTiros();
    atualizarInimigos();
    desenhar();

    requestAnimationFrame(loop);

}

loop();