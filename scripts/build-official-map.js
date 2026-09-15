/**
 * 构建官方地图数据 js/official-map-data.js
 * 数据来源：米游社「观测枢」原神官方互动地图公开接口
 *   - 地图切片配置: /v3/map/info
 *   - 国家区域:     /v1/map/get_area_pageLabel
 *   - 地点标注:     /v1/map/point/list
 * 运行: node scripts/build-official-map.js
 */
const fs = require('fs');
const path = require('path');

const API = 'https://waf-api-takumi.mihoyo.com/common/map_user/ys_obc/v1/map';
const API_V3 = 'https://waf-api-takumi.mihoyo.com/common/map_user/ys_obc/v3/map';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36' };

// 主线七国（对应站点内容）
const COUNTRY_IDS = [1, 2, 3, 4, 8, 11, 16];
const COUNTRY_DESC = {
  1: '崇尚「自由」的城邦之国。由风神巴巴托斯建立，将治理权完全交予人类，是提瓦特大陆上最自由的国度。',
  2: '崇尚「契约」的港城之国。由岩王帝君建立，以契约立国，是提瓦特大陆最繁华的商贸中心。',
  3: '崇尚「永恒」的孤岛之国。由雷神巴尔泽布统治，曾因「眼狩令」与「锁国令」闭锁多年，如今重新拥抱世界。',
  4: '崇尚「智慧」的雨林沙漠之国。由草神纳西妲守护，一半是葱郁雨林，一半是无垠沙漠。',
  8: '崇尚「正义」的法庭之国。由水神芙卡洛斯建立，以审判为最高权力象征，枫丹人曾面临被海水淹没的预言。',
  11: '崇尚「战争」的部族之国。由火神玛薇卡统御，纳塔人以武力与荣耀为信，相信战争是证明存在的方式。',
  16: '崇尚「未知」的冰雪之国。由冰之女皇统治，是愚人众的故乡。冰之女皇收集七神之心的真正目的，至今仍是谜。'
};

// 地点分类（labelId 来自官方标签树）
const CATEGORIES = [
  { key: 'statue',   name: '七天神像',   color: '#FAB632', labelIds: [2] },
  { key: 'waypoint', name: '传送锚点',   color: '#74F2C0', labelIds: [3] },
  { key: 'domain',   name: '秘境',       color: '#BE78FF', labelIds: [154] },
  { key: 'boat',     name: '浪船锚点',   color: '#21D6FD', labelIds: [190] },
  { key: 'cave',     name: '洞口',       color: '#FE594D', labelIds: [410] },
  { key: 'special',  name: '特殊传送点', color: '#f0e6d2', labelIds: [693, 518, 761, 319, 338, 589, 340, 517, 658, 659, 661, 685, 686, 790, 821, 822, 831] }
];

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const d = await res.json();
  if (d.retcode !== 0) throw new Error(`retcode=${d.retcode} ${url}`);
  return d.data;
}

(async () => {
  console.log('1/4 拉取地图切片配置...');
  const info = (await getJson(`${API_V3}/info?map_id=2&app_sn=ys_obc&lang=zh-cn`)).info;

  // 优先使用 detail_v2：7.0 版本后的新画布（含至冬），webp 金字塔瓦片
  // 回退 detail：旧版单尺度 png 切片（22528×20480）
  let tiles, totalSize, origin;
  if (info.detail_v2 && info.detail_v2.map_version) {
    const v2 = info.detail_v2;
    totalSize = v2.total_size;
    origin = v2.origin;
    // N3 每片覆盖 2048 世界像素，N2=1024，N1=512；N0 官方暂未发布
    const levels = [];
    for (let z = 3; z >= 1; z--) {
      const world = 256 * (1 << z);
      levels.push({ z, cols: Math.ceil(totalSize[0] / world), rows: Math.ceil(totalSize[1] / world), world });
    }
    tiles = {
      type: 'pyramid',
      tileSize: 256,
      version: v2.map_version,
      url: `https://act-webstatic.mihoyo.com/ys-map-op/map/2/${v2.map_version}/{c}_{r}_N{z}.webp`,
      levels
    };
    console.log(`   detail_v2 新画布 ${totalSize[0]}×${totalSize[1]}，版本 ${v2.map_version}，${levels.length} 级瓦片`);
  } else {
    const detail = JSON.parse(info.detail);
    totalSize = detail.total_size;
    origin = detail.origin || [totalSize[0] / 2, totalSize[1] / 2];
    tiles = { type: 'sheet', tileSize: 2048, slices: detail.slices.map(row => row.map(c => c.url)) };
    console.log(`   detail 旧画布 ${totalSize[0]}×${totalSize[1]}`);
  }

  console.log('2/4 拉取国家区域...');
  const areaData = await getJson(`${API}/get_area_pageLabel?map_id=2&app_sn=ys_obc&lang=zh-cn`);
  const countries = areaData.list
    .filter(a => COUNTRY_IDS.includes(a.id))
    .sort((a, b) => COUNTRY_IDS.indexOf(a.id) - COUNTRY_IDS.indexOf(b.id))
    .map(a => ({
      id: a.id,
      name: a.name,
      bbox: [a.l_x, a.l_y, a.r_x, a.r_y],
      icon: a.pc_icon_url || '',
      desc: COUNTRY_DESC[a.id] || ''
    }));

  console.log('3/4 拉取地点标注（全量，约21MB）...');
  const pointData = await getJson(`${API}/point/list?map_id=2&app_sn=ys_obc&lang=zh-cn`);
  const labelList = pointData.label_list || [];
  const points = pointData.point_list || [];
  console.log(`   共 ${points.length} 个点，分类 ${labelList.length} 个`);

  // 分类图标（取该分类下第一个 label 的图标）
  const labelIcon = {};
  const labelName = {};
  for (const l of labelList) { labelIcon[l.id] = l.icon || ''; labelName[l.id] = l.name; }

  console.log('4/4 按分类打包点位...');
  const markers = {};
  for (const cat of CATEGORIES) {
    const arr = [];
    for (const p of points) {
      if (!cat.labelIds.includes(p.label_id)) continue;
      if (p.z_level !== 0 || p.display_state !== 1) continue;
      // 剔除画布外的限时活动岛屿点位（游戏坐标 + origin = 画布像素）
      const tx = p.x_pos + origin[0];
      const ty = p.y_pos + origin[1];
      if (tx < 0 || ty < 0 || tx > totalSize[0] || ty > totalSize[1]) continue;
      arr.push([Math.round(p.x_pos * 10) / 10, Math.round(p.y_pos * 10) / 10, p.area_id, p.label_id]);
    }
    markers[cat.key] = arr;
    console.log(`   ${cat.name}: ${arr.length} 处`);
  }

  // 点位所属 label 名称（用于弹出框显示具体类型）
  const labels = {};
  for (const cat of CATEGORIES) {
    for (const id of cat.labelIds) {
      if (labelName[id]) labels[id] = labelName[id];
    }
  }

  // 分类图标：优先树/label 图标
  const catIcons = {};
  for (const cat of CATEGORIES) {
    for (const id of cat.labelIds) {
      if (labelIcon[id]) { catIcons[cat.key] = labelIcon[id]; break; }
    }
  }

  const out = {
    source: '米游社「观测枢」原神官方互动地图公开数据 (api-takumi.mihoyo.com)',
    builtAt: new Date().toISOString().slice(0, 10),
    totalSize,
    origin,
    tiles,
    countries,
    categories: CATEGORIES.map(c => ({ key: c.key, name: c.name, color: c.color, icon: catIcons[c.key] || '' })),
    labels,
    markers
  };

  const file = path.join(__dirname, '..', 'js', 'official-map-data.js');
  const js = '/** 提瓦特官方地图数据（由 scripts/build-official-map.js 自动生成，请勿手改）\n *  数据来源：' + out.source + '\n */\nwindow.OFFICIAL_MAP = ' + JSON.stringify(out) + ';\n';
  fs.writeFileSync(file, js, 'utf8');
  console.log('已生成', file, (fs.statSync(file).size / 1024).toFixed(0) + 'KB');
})().catch(e => { console.error('构建失败:', e.message); process.exit(1); });
