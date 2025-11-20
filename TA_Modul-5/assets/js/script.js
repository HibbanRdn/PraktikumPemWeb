let inputSaatIni = '0';
let ekspresi = '';
let memori = 0;
let riwayat = [];
let hasilTerakhir = null;
let resetSaatInputBerikutnya = false;

function perbaruiTampilan() {
    document.getElementById('display').textContent = inputSaatIni;
    document.getElementById('expression').textContent = ekspresi || '0';
    document.getElementById('memoryDisplay').textContent = memori.toFixed(2);
}

function tambahAngka(num) {
    if (resetSaatInputBerikutnya) {
        inputSaatIni = num;
        ekspresi = '';
        resetSaatInputBerikutnya = false;
    } else {
        if (inputSaatIni === '0') {
            inputSaatIni = num;
        } else {
            inputSaatIni += num;
        }
    }
    perbaruiTampilan();
}

function tambahDesimal() {
    if (resetSaatInputBerikutnya) {
        inputSaatIni = '0.';
        ekspresi = '';
        resetSaatInputBerikutnya = false;
    } else if (!inputSaatIni.includes('.')) {
        inputSaatIni += '.';
    }
    perbaruiTampilan();
}

function pilihOperator(op) {
    const tampilanOp = op === '*' ? '×' : op === '/' ? '÷' : op === '-' ? '−' : op;
    
    if (resetSaatInputBerikutnya && hasilTerakhir !== null) {
        ekspresi = hasilTerakhir.toString();
        resetSaatInputBerikutnya = false;
    } else if (ekspresi === '') {
        ekspresi = inputSaatIni;
    } else if (inputSaatIni !== '0') {
        ekspresi += inputSaatIni;
    }
    
    const operator = ['+', '−', '×', '÷'];
    const lastChar = ekspresi.trim().slice(-1);
    if (operator.includes(lastChar)) {
        ekspresi = ekspresi.trim().slice(0, -1) + ' ' + tampilanOp + ' ';
    } else {
        ekspresi += ' ' + tampilanOp + ' ';
    }
    
    inputSaatIni = '0';
    perbaruiTampilan();
}

function hitungHasil() {
    try {
        let ekspresiPenuh = ekspresi.trim();
        if (inputSaatIni !== '0' && ekspresi !== '') {
            ekspresiPenuh += ' ' + inputSaatIni;
        } else if (ekspresi === '') {
            ekspresiPenuh = inputSaatIni;
        }
        
        const ekspresiTampil = ekspresiPenuh;
        
        if (/÷\s*0(?!\d)/.test(ekspresiPenuh)) {
            throw new Error('Cannot divide by zero');
        }
        
        const hasil = evaluasiEkspresi(ekspresiPenuh);
        
        tambahRiwayat(ekspresiTampil + ' = ' + hasil);
        
        hasilTerakhir = hasil;
        inputSaatIni = hasil.toString();
        ekspresi = '';
        resetSaatInputBerikutnya = true;
        perbaruiTampilan();
    } catch (error) {
        inputSaatIni = 'Error';
        ekspresi = error.message;
        perbaruiTampilan();
        setTimeout(() => {
            hapusSemua();
        }, 2000);
    }
}

function evaluasiEkspresi(expr) {
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    
    try {
        const hasil = Function('"use strict"; return (' + expr + ')')();
        if (!isFinite(hasil)) {
            throw new Error('Invalid result');
        }
        return Math.round(hasil * 100000000) / 100000000;
    } catch (e) {
        throw new Error('Invalid expression');
    }
}

function hapusSemua() {
    inputSaatIni = '0';
    ekspresi = '';
    resetSaatInputBerikutnya = false;
    perbaruiTampilan();
}

function hapusEntri() {
    inputSaatIni = '0';
    perbaruiTampilan();
}

function hapusKarakter() {
    if (inputSaatIni.length > 1) {
        inputSaatIni = inputSaatIni.slice(0, -1);
    } else {
        inputSaatIni = '0';
    }
    perbaruiTampilan();
}

function memoriTambah() {
    memori += parseFloat(inputSaatIni) || 0;
    perbaruiTampilan();
}

function memoriKurang() {
    memori -= parseFloat(inputSaatIni) || 0;
    perbaruiTampilan();
}

function panggilMemori() {
    inputSaatIni = memori.toString();
    resetSaatInputBerikutnya = true;
    perbaruiTampilan();
}

function memoriHapus() {
    memori = 0;
    perbaruiTampilan();
}

function tambahRiwayat(calc) {
    riwayat.unshift(calc);
    if (riwayat.length > 5) {
        riwayat.pop();
    }
    perbaruiRiwayat();
}

function perbaruiRiwayat() {
    const historyDiv = document.getElementById('history');
    if (riwayat.length === 0) {
        historyDiv.innerHTML = '<p class="text-gray-400 text-sm text-center py-12">No calculations yet</p>';
    } else {
        historyDiv.innerHTML = riwayat.map((item) => `
            <div class="history-item p-3.5 rounded-lg">
                <p class="text-gray-700 text-sm break-all leading-relaxed">${item}</p>
            </div>
        `).join('');
    }
}

function hapusRiwayat() {
    riwayat = [];
    perbaruiRiwayat();
}

document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') {
        tambahAngka(e.key);
    } else if (e.key === '.') {
        tambahDesimal();
    } else if (e.key === '+') {
        pilihOperator('+');
    } else if (e.key === '-') {
        pilihOperator('-');
    } else if (e.key === '*') {
        pilihOperator('*');
    } else if (e.key === '/') {
        e.preventDefault();
        pilihOperator('/');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        hitungHasil();
    } else if (e.key === 'Escape') {
        hapusSemua();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        hapusKarakter();
    }
});

// Inisialisasi
perbaruiTampilan();
