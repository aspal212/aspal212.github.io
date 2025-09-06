function startGame() {
    const name = prompt("Hai! Siapa namamu?");
    if(name){
        alert(`Selamat datang, ${name}! Yuk mulai bermain dan belajar!`);
    } else {
        alert("Yuk mulai bermain dan belajar!");
    }
}
// Nonaktifkan klik kanan di seluruh halaman
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
    alert("Maaf, konten ini dilindungi!");
});
