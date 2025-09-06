const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

// ----------------------
// Posisi dan state robot
// ----------------------
let x = 0;
let y = 0;
let arah = 0; // derajat, sekarang mendukung 45° increment
let sudahPilihTitikAwal = false;
let level = 1;
let skor = 0;

// Jalur robot
ctx.lineWidth = 3;
ctx.strokeStyle = "blue";
ctx.beginPath();
let jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);

// ----------------------
// Definisi misi per level
// ----------------------
const misiPerLevel = [
  { level: 1, nama: "Persegi", koordinat: [[100,100],[300,100],[300,300],[100,300],[100,100]] },
  { level: 2, nama: "Segitiga", koordinat: [[150,350],[350,350],[250,150],[150,350]] },
  { level: 3, nama: "Lingkaran", koordinat: [], radius: 100, centerX: 250, centerY: 250 }
];

// ----------------------
// Fungsi menggambar panduan bentuk
// ----------------------
function gambarBentukPanduan() {
  const m = misiPerLevel[level-1];
  if(!m) return;

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();

  if(m.nama === "Lingkaran") {
    ctx.arc(m.centerX, m.centerY, m.radius, 0, 2*Math.PI);
  } else {
    const coords = m.koordinat;
    ctx.moveTo(coords[0][0], coords[0][1]);
    for(let i=1;i<coords.length;i++){
      ctx.lineTo(coords[i][0], coords[i][1]);
    }
  }
  ctx.stroke();

  // titik awal sample
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  if(m.nama==="Lingkaran"){
    ctx.arc(m.centerX, m.centerY - m.radius, 5, 0, 2*Math.PI);
  } else {
    ctx.arc(m.koordinat[0][0], m.koordinat[0][1], 5, 0, 2*Math.PI);
  }
  ctx.fill();
}

// ----------------------
// Fungsi menggambar robot
// ----------------------
function gambarRobot() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  gambarBentukPanduan();
  ctx.putImageData(jalur,0,0);

  // gambar robot segitiga sesuai arah (mendukung 45°)
  ctx.fillStyle="red";
  ctx.beginPath();
  ctx.moveTo(
    x + 10*Math.cos((arah*Math.PI)/180),
    y + 10*Math.sin((arah*Math.PI)/180)
  );
  ctx.lineTo(
    x + 5*Math.cos(((arah+135)*Math.PI)/180),
    y + 5*Math.sin(((arah+135)*Math.PI)/180)
  );
  ctx.lineTo(
    x + 5*Math.cos(((arah+225)*Math.PI)/180),
    y + 5*Math.sin(((arah+225)*Math.PI)/180)
  );
  ctx.closePath();
  ctx.fill();

  tampilkanLevel();
  tampilkanSkor();
}

// ----------------------
// Tampilkan level & skor
// ----------------------
function tampilkanLevel(){
  ctx.font="18px Arial";
  ctx.fillStyle="#333";
  ctx.textAlign="left";
  ctx.fillText("Level: "+level+" - Misi: "+misiPerLevel[level-1].nama, 10, 20);
}

function tampilkanSkor(){
  ctx.font="18px Arial";
  ctx.fillStyle="#333";
  ctx.textAlign="right";
  ctx.fillText("Skor: "+skor, canvas.width-10, 20);
}

// ----------------------
// Klik canvas untuk titik awal
// ----------------------
canvas.addEventListener("click", function(e){
  if(!sudahPilihTitikAwal){
    x = e.offsetX;
    y = e.offsetY;

    let radius=0;
    let anim = setInterval(()=>{
      radius+=2;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.putImageData(jalur,0,0);
      gambarBentukPanduan();
      ctx.fillStyle="red";
      ctx.beginPath();
      ctx.arc(x,y,radius,0,2*Math.PI);
      ctx.fill();
      if(radius>=10){
        clearInterval(anim);
        sudahPilihTitikAwal=true;
        gambarRobot();
      }
    },15);

    ctx.beginPath();
    ctx.moveTo(x,y);
  }
});

// ----------------------
// Perintah robot
// ----------------------
function maju(){
  if(!sudahPilihTitikAwal) return;
  let panjang = 50;
  let rad = arah*Math.PI/180;
  let newX = x + panjang*Math.cos(rad);
  let newY = y + panjang*Math.sin(rad);

  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(newX,newY);
  ctx.stroke();

  x=newX; y=newY;
  jalur=ctx.getImageData(0,0,canvas.width,canvas.height);
  gambarRobot();
  cekMisi();
}

// Tambahkan belok kanan/kiri 45° atau 90° sesuai kebutuhan
function belokKanan(){
  if(!sudahPilihTitikAwal) return;
  arah += 45; if(arah>=360) arah-=360;
  gambarRobot();
}

function belokKiri(){
  if(!sudahPilihTitikAwal) return;
  arah -= 45; if(arah<0) arah+=360;
  gambarRobot();
}

// ----------------------
// Reset permainan
// ----------------------
function hapus(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  x=0; y=0; arah=0; sudahPilihTitikAwal=false;
  jalur = ctx.getImageData(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.font="18px Arial";
  ctx.fillStyle="#333";
  ctx.textAlign="center";
  ctx.fillText("Klik di canvas untuk memilih titik awal robot", canvas.width/2, canvas.height/2);
}

// ----------------------
// Cek misi selesai & naik level
// ----------------------
function cekMisi(){
  const m = misiPerLevel[level-1];
  if(!m) return;

  let targetX, targetY;
  if(m.nama==="Lingkaran"){
    targetX=m.centerX;
    targetY=m.centerY - m.radius;
  } else {
    const coords=m.koordinat;
    targetX=coords[coords.length-1][0];
    targetY=coords[coords.length-1][1];
  }

  const jarak = Math.hypot(x-targetX,y-targetY);
  if(jarak<20){
    skor+=10;
    if(level<misiPerLevel.length){
      level++;
      alert("🎉 Misi selesai! Naik ke level "+level);
      x=0;y=0;arah=0;sudahPilihTitikAwal=false;
      jalur=ctx.getImageData(0,0,canvas.width,canvas.height);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.font="18px Arial";
      ctx.fillStyle="#333";
      ctx.textAlign="center";
      ctx.fillText("Klik di canvas untuk memilih titik awal robot (Level "+level+")", canvas.width/2, canvas.height/2);
    } else {
      alert("🏆 Semua level selesai! Skor total: "+skor);
      level=1; skor=0;
      hapus();
    }
  }
}

// ----------------------
// Tampilan sample misi 5 detik
// ----------------------
function tampilkanSampleSebelumMulai(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  gambarBentukPanduan();
  ctx.font="18px Arial";
  ctx.fillStyle="#333";
  ctx.textAlign="center";
  ctx.fillText("Perhatikan bentuk misi selama 5 detik...", canvas.width/2, 30);

  setTimeout(()=>{ hapus(); }, 5000);
}

// ----------------------
// Mulai permainan
// ----------------------
tampilkanSampleSebelumMulai();
