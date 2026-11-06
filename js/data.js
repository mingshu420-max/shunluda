// ========== 顺路搭 · 演示数据 v3 ==========
// 说明：这些是演示数据，后续可替换为真实数据库

// 晴川学院（唯一校区）
const SCHOOL = '晴川学院';

// 主要目的地（地铁站/商圈），每个带"区域中心点"，用于就近匹配
const MAJOR_DESTINATIONS = [
  { name: '佛祖岭地铁站', zone: '佛祖岭', label: '2号线终点' },
  { name: '高新四路地铁站（大悦城）', zone: '高新四路', label: '大悦城/光谷东' },
  { name: '光谷广场', zone: '光谷', label: '商圈·2号线' },
  { name: '街道口', zone: '街道口', label: '商圈·群光/银泰' },
  { name: '江汉路', zone: '江汉路', label: '商圈·步行街' },
  { name: '武汉站', zone: '武汉站', label: '高铁站' },
  { name: '武昌站', zone: '武昌站', label: '火车站' },
  { name: '汉口站', zone: '汉口站', label: '火车站' },
  { name: '天河机场', zone: '天河机场', label: '机场' }
];

// 自定义目的地 → 自动匹配附近中心点/地铁站
const NEARBY_MAP = [
  { keyword: '晴川', center: '佛祖岭地铁站', zone: '佛祖岭' },
  { keyword: '华科', center: '光谷广场', zone: '光谷' },
  { keyword: '华中科技', center: '光谷广场', zone: '光谷' },
  { keyword: '武纺', center: '光谷广场', zone: '光谷' },
  { keyword: '纺织', center: '光谷广场', zone: '光谷' },
  { keyword: '武汉理工', center: '街道口', zone: '街道口' },
  { keyword: '武大', center: '街道口', zone: '街道口' },
  { keyword: '华师', center: '街道口', zone: '街道口' },
  { keyword: '湖经', center: '佛祖岭地铁站', zone: '佛祖岭' },
  { keyword: '经济学院', center: '佛祖岭地铁站', zone: '佛祖岭' },
  { keyword: '大悦城', center: '高新四路地铁站（大悦城）', zone: '高新四路' },
  { keyword: '武软', center: '高新四路地铁站（大悦城）', zone: '高新四路' },
  { keyword: '软件工程', center: '高新四路地铁站（大悦城）', zone: '高新四路' },
  { keyword: '地铁', center: null, zone: null } // 兜底提示
];

// 根据输入判断是否为"自定义目的地"，返回 {custom, zone, centerName}
function resolveDestination(name) {
  // 优先精确匹配主要目的地
  const exact = MAJOR_DESTINATIONS.find(d => d.name === name);
  if (exact) return { custom: false, zone: exact.zone, centerName: exact.name };

  // 自定义：模糊匹配附近中心点
  for (const item of NEARBY_MAP) {
    if (name.includes(item.keyword)) {
      if (item.center === null) return { custom: true, zone: null, centerName: null };
      return { custom: true, zone: item.zone, centerName: item.center };
    }
  }
  // 无法识别 → 不参与就近匹配
  return { custom: true, zone: null, centerName: null };
}

// ========== 演示行程 ==========
// type: 'taxi' = 打车拼车（找搭子一起打车，主流模式）；'car' = 车主顺路（有车人投稿）
const DEMO_TRIPS = [
  // ---- 出校方向（校门口 → 地铁站/商圈）----
  {
    id: 1,
    type: 'taxi',
    from: SCHOOL,
    to: '佛祖岭地铁站',
    time: '2026-11-07T08:30',
    seats: 2,
    seatsTotal: 4,
    fee: 'AA 打车费',
    note: '早八赶地铁，一起打车平摊',
    owner: '小陈',
    ownerMajor: '计算机',
    contact: '微信：chen_2026',
    verified: true
  },
  {
    id: 2,
    type: 'taxi',
    from: SCHOOL,
    to: '高新四路地铁站（大悦城）',
    time: '2026-11-07T09:30',
    seats: 1,
    seatsTotal: 3,
    fee: 'AA 打车费',
    note: '去大悦城看电影，打车拼车',
    owner: '阿岚',
    ownerMajor: '新闻学',
    contact: '微信：lanlan_wh',
    verified: true
  },
  {
    id: 3,
    type: 'car',
    from: SCHOOL,
    to: '佛祖岭地铁站',
    time: '2026-11-07T10:20',
    seats: 3,
    seatsTotal: 4,
    fee: '免费互助',
    note: '有车，顺路免费带同学',
    owner: '大熊',
    ownerMajor: '英语',
    contact: '电话：139****1122',
    verified: true
  },
  {
    id: 4,
    type: 'taxi',
    from: SCHOOL,
    to: '光谷广场',
    time: '2026-11-07T14:00',
    seats: 2,
    seatsTotal: 4,
    fee: 'AA 打车费',
    note: '去光谷逛街，下午出发',
    owner: '小满',
    ownerMajor: '设计',
    contact: '微信：xiaoman_design',
    verified: true
  },
  // ---- 回校方向（地铁站 → 校门口）----
  {
    id: 5,
    type: 'taxi',
    from: '佛祖岭地铁站',
    to: SCHOOL,
    time: '2026-11-07T17:00',
    seats: 2,
    seatsTotal: 4,
    fee: 'AA 打车费',
    note: '地铁站回学校，拼车回程',
    owner: '阿哲',
    ownerMajor: '法学',
    contact: '微信：azhe_2026',
    verified: true
  },
  {
    id: 6,
    type: 'taxi',
    from: '高新四路地铁站（大悦城）',
    to: SCHOOL,
    time: '2026-11-07T20:30',
    seats: 2,
    seatsTotal: 4,
    fee: 'AA 打车费',
    note: '晚上逛完大悦城回校，一起打车',
    owner: '小雨',
    ownerMajor: '会计',
    contact: '微信：xiaoyu_wh',
    verified: true
  }
];

// 我发布的行程（演示）
const MY_TRIPS = [
  {
    id: 101,
    type: 'taxi',
    from: SCHOOL,
    to: '佛祖岭地铁站',
    time: '2026-11-08T09:00',
    seats: 2,
    seatsTotal: 4,
    fee: 'AA 打车费',
    note: '去地铁站拼车，求搭子',
    owner: '晴川同学',
    ownerMajor: '新闻学',
    contact: '微信：my_wechat',
    verified: true
  }
];

// 按"就近中心点"匹配：不同目的地但只要中心点相同/接近就算顺路
function zoneOf(trip) {
  const dest = resolveDestination(trip.to);
  return dest.zone;
}

function aiMatch(trip) {
  const myZone = zoneOf(trip);
  const candidates = DEMO_TRIPS.filter(t => t.id !== trip.id);
  const scored = candidates.map(t => {
    const tZone = zoneOf(t);
    let score = 40; // 基础分
    let reasons = [];

    // 就近中心点匹配（核心：不同目的地但接近也匹配）
    if (tZone && myZone && tZone === myZone) {
      score += 30;
      const sameName = t.to === trip.to;
      reasons.push(sameName ? '目的地相同，直接同路' : `目的地相近（${t.to}），中心点一致`);
    } else {
      return null; // 中心点不一致，不推荐
    }

    // 时间接近度
    const timeDiff = Math.abs(new Date(t.time) - new Date(trip.time)) / (1000 * 60 * 60);
    if (timeDiff < 2) { score += 20; reasons.push('出发时间接近（±2小时）'); }
    else if (timeDiff < 4) { score += 10; reasons.push('出发时间较接近'); }

    // 出发地相同加分
    if (t.from === trip.from) { score += 10; reasons.push('同一地点出发'); }

    // 有空位加分
    if (t.seats > 0) { score += 5; reasons.push(`还有${t.seats}个位置`); }

    // 车主直发更省事，加一点
    if (t.type === 'car') { score += 5; reasons.push('车主直发，免打车费'); }

    return {
      name: (t.type === 'car' ? '🚗 ' : '🚕 ') + t.owner + ' 的行程',
      score: Math.min(score, 98),
      time: t.time,
      to: t.to,
      type: t.type,
      reason: reasons.join('；')
    };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 3);

  return scored;
}

// AI 出行助手（演示：关键词匹配回答）
function aiChatReply(question) {
  const q = question;
  if (q.includes('佛祖岭')) {
    return '去佛祖岭地铁站：\n\n🚕 打车拼车：「小陈」8:30 出发，还缺 2 人，AA 约 3-5 元/人，顺路度 95%。\n\n🚗 车主直发：「大熊」10:20 出发，免费带，还缺 3 人。\n\n💡 建议：赶时间选打车拼车，省钱选车主直发～';
  }
  if (q.includes('大悦城') || q.includes('高新四路')) {
    return '去高新四路地铁站（大悦城）：\n\n🚕 打车拼车：「阿岚」9:30 出发，还缺 1 人，AA 约 6 元/人，顺路度 92%。\n\n🚇 地铁：2号线 → 11号线，约 40 分钟，6 元。\n\n🛍️ 大悦城是光谷东最大商圈，周末人多，建议上午出发～';
  }
  if (q.includes('回学校') || q.includes('回校') || q.includes('回来')) {
    return '从地铁站回学校：\n\n🚕 「阿哲」17:00 从佛祖岭地铁站回晴川学院，还缺 2 人，AA 打车费。\n\n🚕 「小雨」20:30 从大悦城（高新四路站）回学校，还缺 2 人。\n\n💡 晚上回校建议拼车更安全，人多平摊也便宜～';
  }
  if (q.includes('学校') || q.includes('大学') || q.includes('学院')) {
    return '去学校的话，可以搜目的地名字（如"武纺""华科"），我会自动匹配附近的中心点。\n\n例如「武汉纺织大学」→ 匹配到 光谷广场（中心点一致）的行程也可以拼。\n\n这样就算目的地不完全一样，只要离得近也能一起走～';
  }
  if (q.includes('地铁') || q.includes('划算') || q.includes('对比')) {
    return '拼车 vs 地铁 对比（晴川学院→佛祖岭地铁站）：\n\n🚕 打车拼车：15分钟，3-5元，直达\n🚇 地铁：20分钟，需先到地铁站\n\n💡 结论：短途拼车性价比最高，还能认识同学～';
  }
  if (q.includes('光谷')) {
    return '去光谷广场：\n\n🚕 打车拼车：「小满」14:00 出发，还缺 2 人，AA 约 8 元/人。\n\n🚇 地铁：2号线直达，约 50 分钟，5 元。\n\n光谷周末人流量大，建议错峰出行～';
  }
  return '你可以问我：\n· 去佛祖岭地铁站怎么拼车？\n· 有没有去大悦城的车？\n· 晚上怎么从地铁站回学校？';
}
