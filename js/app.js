// ========== 顺路搭 · 逻辑 ==========

let currentTab = 'home';
let currentFilter = '全部';
let currentDetailTrip = null;

// ========== 页面切换 ==========
function switchTab(tab) {
  currentTab = tab;
  const tabs = ['home', 'publish', 'ai', 'mine'];
  tabs.forEach(t => {
    document.getElementById('page-' + t).style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.tab-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
  if (tab === 'home') renderList();
}

function showDetail(id) {
  const trip = [...DEMO_TRIPS, ...MY_TRIPS].find(t => t.id === id);
  if (!trip) return;
  currentDetailTrip = trip;
  renderDetail(trip);
  // 从任何 tab 跳转详情
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById('page-detail').style.display = 'block';
  document.getElementById('tabbar').style.display = 'none';
}

function goBack() {
  document.getElementById('tabbar').style.display = 'flex';
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById('page-' + currentTab).style.display = 'block';
  if (currentTab === 'home') renderList();
}

// ========== 列表渲染 ==========
function getFilteredTrips() {
  const kw = (document.getElementById('searchInput').value || '').trim();
  return DEMO_TRIPS.filter(t => {
    const tZone = resolveDestination(t.to).zone || t.to;
    const hitFilter = currentFilter === '全部' || tZone.includes(currentFilter) || t.to.includes(currentFilter);
    const hitKw = !kw || t.from.includes(kw) || t.to.includes(kw) || tZone.includes(kw);
    return hitFilter && hitKw;
  });
}

function renderList() {
  const list = getFilteredTrips();
  const el = document.getElementById('tripList');
  const empty = document.getElementById('emptyTip');
  if (list.length === 0) {
    el.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  el.innerHTML = list.map(tripCardHTML).join('');
}

function tripCardHTML(t) {
  const timeStr = formatTime(t.time);
  const seatsClass = t.seats > 0 ? 'ok' : '';
  const joined = t.seatsTotal - t.seats;
  const seatsText = t.seats > 0 ? `还缺 ${t.seats} 人` : '已满';
  const typeBadge = t.type === 'car'
    ? '<span class="match-badge" style="background:#fff3e6;color:#ff8c00">🚗 车主直发</span>'
    : '<span class="match-badge">🚕 打车拼车</span>';
  // 顺路度（演示：按出发地+目的地同中心点粗略计算）
  const score = Math.min(95, 68 + (t.from.includes('晴川') ? 12 : 0) + (joined > 0 ? 8 : 0));
  return `
  <div class="trip-card" onclick="showDetail(${t.id})">
    <div class="trip-route">
      <span>${t.from}</span>
      <span class="arrow">→</span>
      <span>${t.to}</span>
      ${typeBadge}
    </div>
    <div class="trip-meta">
      <span>🕐 ${timeStr}</span>
      <span>🚗 在拼 <b style="color:var(--primary)">${joined}</b>/${t.seatsTotal} 人</span>
      <span>💰 ${t.fee}</span>
    </div>
    <div class="match-bar"><div class="match-bar-fill" style="width:${score}%"></div></div>
    <div class="trip-bottom">
      <span class="match-score">AI顺路度 <b style="color:var(--primary)">${score}%</b></span>
      <span class="owner"><span class="avatar-sm">${t.owner[0]}</span>${t.owner} · ${t.ownerMajor}</span>
    </div>
  </div>`;
}

function setFilter(f, el) {
  currentFilter = f;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderList();
}

// ========== 发布行程 ==========
// 自定义目的地输入切换
function onCustomDestInput() {
  const val = document.getElementById('toSelect').value;
  const input = document.getElementById('customToInput');
  const hint = document.getElementById('centerHint');
  if (val !== '__custom__') {
    input.style.display = 'none';
    hint.style.display = 'none';
    return;
  }
  input.style.display = 'block';
  const name = input.value.trim();
  if (!name) { hint.style.display = 'none'; return; }
  const r = resolveDestination(name);
  if (r.zone) {
    hint.innerHTML = `📍 已自动匹配附近中心点：<b>${r.centerName}</b>（${r.zone} 区域）<br><span style="font-size:11px;color:#888">与该区域的行程可互相匹配</span>`;
    hint.style.display = 'block';
  } else {
    hint.innerHTML = '💡 输入学校/商圈名称（如"武纺""华科"）可自动匹配附近地铁站';
    hint.style.display = 'block';
  }
}

function publishTrip() {
  const tripType = document.querySelector('input[name="tripType"]:checked').value;
  const from = document.getElementById('fromSelect').value;
  let to = document.getElementById('toSelect').value;
  let toZone = null;
  if (to === '__custom__') {
    to = document.getElementById('customToInput').value.trim();
    if (!to) { showToast('请填写自定义目的地'); return; }
    const r = resolveDestination(to);
    toZone = r.zone;
    if (r.zone) {
      showToast(`📍 已匹配附近中心点：${r.centerName}`);
    }
  } else {
    const r = resolveDestination(to);
    toZone = r.zone;
  }
  const time = document.getElementById('timeInput').value;
  const seats = parseInt(document.getElementById('seatsSelect').value);
  const fee = document.getElementById('feeSelect').value;
  const note = document.getElementById('noteInput').value.trim() || '无';
  const contact = document.getElementById('contactInput').value.trim();

  if (!time) { showToast('请选择出发时间'); return; }
  if (!contact) { showToast('请填写联系方式'); return; }

  const trip = {
    id: Date.now(),
    type: tripType,
    from, to, time, seats, seatsTotal: seats, toZone,
    fee, note, contact,
    owner: '晴川同学', ownerMajor: '新闻学', verified: true
  };
  DEMO_TRIPS.unshift(trip);

  // 清空表单
  document.getElementById('noteInput').value = '';
  document.getElementById('contactInput').value = '';
  document.getElementById('customToInput').value = '';
  document.getElementById('centerHint').style.display = 'none';

  showToast('✅ 发布成功，AI 正在为你匹配顺路搭子');
  setTimeout(() => {
    switchTab('home');
    renderList();
    showDetail(trip.id);
  }, 600);
}

// ========== 详情页 ==========
function renderDetail(trip) {
  const timeStr = formatTime(trip.time);
  const matches = aiMatch(trip);

  document.getElementById('detailCard').innerHTML = `
    <div class="detail-route">
      <span>${trip.from}</span>
      <span class="arrow">→</span>
      <span>${trip.to}</span>
    </div>
    <div class="detail-row"><span class="k">拼车方式</span><span class="v">${trip.type === 'car' ? '🚗 车主直发' : '🚕 打车拼车（校门口集合）'}</span></div>
    <div class="detail-row"><span class="k">预约时间</span><span class="v">${timeStr}</span></div>
    <div class="detail-row"><span class="k">拼车状态</span><span class="v" style="color:var(--primary)">🚗 在拼 ${trip.seatsTotal - trip.seats}/${trip.seatsTotal} 人 · 还缺 ${trip.seats} 人</span></div>
    <div class="detail-row"><span class="k">费用说明</span><span class="v">${trip.fee}</span></div>
    <div class="detail-row"><span class="k">备注</span><span class="v">${trip.note}</span></div>
    <div class="detail-row"><span class="k">发布人</span><span class="v">${trip.owner} · ${trip.ownerMajor}</span></div>
    ${trip.verified ? '<div class="detail-row"><span class="k">实名认证</span><span class="v" style="color:var(--primary)">✅ 已认证</span></div>' : ''}
    ${zoneOf(trip) ? `<div class="detail-row"><span class="k">就近中心点</span><span class="v" style="color:var(--primary)">📍 ${zoneOf(trip)} 区域</span></div>` : ''}
    <div class="contact-box">
      <span class="txt">📞 联系：${trip.contact}</span>
      <span class="txt">安全提示：行程分享给室友</span>
    </div>
  `;

  if (matches.length > 0) {
    document.getElementById('aiPanel').innerHTML = `
      <div class="ai-title">🤖 AI 顺路推荐</div>
      ${matches.map(m => `
        <div class="ai-match">
          <div class="match-top">
            <span class="match-name">${m.name}</span>
            <span class="match-score">匹配度 ${m.score}%</span>
          </div>
          <div class="match-reason">🕐 ${formatTime(m.time)}</div>
          <div class="match-reason">${m.reason}</div>
        </div>`).join('')}
      <div class="ai-advice">💡 AI 建议：以上行程与你的出发地和时间高度顺路，联系对方时请先互相确认身份，并在出发前把行程分享给室友，安全第一～</div>
    `;
  } else {
    document.getElementById('aiPanel').innerHTML = `
      <div class="ai-title">🤖 AI 顺路推荐</div>
      <div class="ai-advice">💡 目前还没有完全同路的行程，建议你把这条行程分享到朋友圈/宿舍群，或者稍后再来看看～也可以问我 AI 出行助手，帮你规划其他出行方式。</div>
    `;
  }
}

// ========== AI 出行助手 ==========
function sendChat() {
  const input = document.getElementById('chatInput');
  const q = input.value.trim();
  if (!q) return;
  input.value = '';

  const box = document.getElementById('chatBox');
  box.insertAdjacentHTML('beforeend', `<div class="msg user"><div class="bubble">${escapeHtml(q)}</div></div>`);
  const loadingId = 'ai-loading';
  box.insertAdjacentHTML('beforeend', `<div class="msg ai" id="${loadingId}"><div class="bubble"><div class="ai-loading">AI 正在分析顺路方案<span class="dots"><span></span><span></span><span></span></span></div></div></div>`);
  box.scrollTop = box.scrollHeight;
  setTimeout(() => {
    const reply = aiChatReply(q);
    document.getElementById(loadingId).outerHTML = `<div class="msg ai"><div class="bubble">${escapeHtml(reply)}</div></div>`;
    box.scrollTop = box.scrollHeight;
  }, 900);
}

function quickAsk(q) {
  document.getElementById('chatInput').value = q;
  sendChat();
}

// ========== 我的 ==========
function showMyTrips() {
  const ids = MY_TRIPS.map(t => t.id);
  showDetail(ids[0]);
}

function showAbout() {
  showToast('顺路搭 · 让每位偏远校区学生都能顺路出发');
}

// ========== 工具函数 ==========
function formatTime(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getMonth()+1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

// 初始化
renderList();
