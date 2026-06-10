// 風嶺百貌 — Firebase 即時留言牆
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn34RDPD_oTRimMSTbDYdQYPbVsMdNWko",
  authDomain: "fenglin-60th.firebaseapp.com",
  databaseURL: "https://fenglin-60th-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fenglin-60th",
  storageBucket: "fenglin-60th.firebasestorage.app",
  messagingSenderId: "966839469804",
  appId: "1:966839469804:web:ee7f6c67558015cbca87c9"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);
let cachedItems = [];
let lastCount = -1;

function renderWall(highlightFirst) {
  const wall = document.getElementById('blessingWall');
  if (!wall) return;
  const tot = document.getElementById('blessTotal');
  if (tot) tot.textContent = cachedItems.length ? '已有 ' + cachedItems.length + ' 則祝福' : '';
  while (wall.firstChild) wall.removeChild(wall.firstChild);

  if (!cachedItems.length) {
    const emptyMsg = document.createElement('p');
    emptyMsg.style.cssText = 'text-align:center;color:rgba(250,247,242,0.3);font-family:sans-serif;font-size:0.85rem;letter-spacing:0.1em;grid-column:1/-1;';
    emptyMsg.textContent = '還沒有留言，來第一個祝福吧！';
    wall.appendChild(emptyMsg);
    return;
  }

  cachedItems.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'bless-card';
    card.style.animationDelay = Math.min(i * 0.06, 0.5) + 's';
    if (highlightFirst && i === 0) card.classList.add('bless-new');

    const bp = document.createElement('p');
    bp.className = 'bless-text';
    bp.textContent = item.text;

    const ba = document.createElement('div');
    ba.className = 'bless-author';

    const bn = document.createElement('span');
    bn.className = 'bless-name';
    bn.textContent = item.name;
    ba.appendChild(bn);

    if (item.role) {
      const br2 = document.createElement('span');
      br2.className = 'bless-role';
      br2.textContent = item.role;
      ba.appendChild(br2);
    }

    card.appendChild(bp);
    card.appendChild(ba);
    wall.appendChild(card);
  });
}

onValue(ref(db, 'blessings'), snap => {
  cachedItems = [];
  if (snap.exists()) {
    snap.forEach(child => {
      const val = child.val();
      if (val) cachedItems.push(val);
    });
    cachedItems.reverse();
  }
  const grew = lastCount >= 0 && cachedItems.length > lastCount;
  lastCount = cachedItems.length;
  renderWall(grew);
});

window.addEventListener('blessingTabShown', renderWall);

window.submitBlessing = function() {
  const nameEl = document.getElementById('blessingName');
  const textEl = document.getElementById('blessingText');
  const roleEl = document.getElementById('blessingRole');
  const name = nameEl.value.trim();
  const text = textEl.value.trim();
  const role = roleEl.value.trim();
  if (!name || !text) {
    alert('請填寫姓名與祝福語！');
    return;
  }
  const btn = document.querySelector('.bless-submit');
  push(ref(db, 'blessings'), {
    name, text, role,
    ts: serverTimestamp()
  }).then(() => {
    nameEl.value = '';
    textEl.value = '';
    roleEl.value = '';
    const cnt = document.getElementById('blessCount');
    if (cnt) cnt.textContent = '0 / 150';
    if (btn) {
      btn.classList.add('sent');
      btn.textContent = '✓ 感謝您的祝福';
      setTimeout(() => { btn.classList.remove('sent'); btn.textContent = '送出祝福 ✦'; }, 2200);
    }
  });
};

// ── 祝福字數計數 ──
const blTextEl = document.getElementById('blessingText');
const blCountEl = document.getElementById('blessCount');
if (blTextEl && blCountEl) {
  blTextEl.addEventListener('input', () => {
    blCountEl.textContent = blTextEl.value.length + ' / 150';
  });
}
