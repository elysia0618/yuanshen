/**
 * 角色详情页模板生成器
 * 生成 characters/{id}.html
 * 用法：在项目根目录运行 node scripts/generate-characters.js
 */
const fs = require('fs');
const path = require('path');
const { CHARACTERS, ELEMENTS } = require('../js/characters-data.js');

const DIST_DIR = path.join(__dirname, '..', 'characters');
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

// 每个角色的图片提示词
const IMAGE_PROMPTS = {
  aether: 'A young anime man with blonde hair and golden eyes, wearing a white and gold traveler outfit with a flowing scarf, holding a sword, heroic pose, Genshin Impact style art, beautiful detailed illustration, fantasy background',
  amber: 'A cheerful young anime woman with amber eyes and brown twin tails, wearing a red leather outfit with bunny-ear hood, holding a bow, energetic pose, Genshin Impact style art, beautiful detailed illustration',
  kaeya: 'A handsome young anime man with dark blue hair and one eye covered by an eyepatch, wearing a blue and white knight outfit with fur collar, confident smile, Genshin Impact style art, beautiful detailed illustration',
  lisa: 'A beautiful anime woman with long blonde hair and green eyes, wearing a purple witch outfit with a large hat, holding a magic book, elegant pose, Genshin Impact style art, beautiful detailed illustration',
  diluc: 'A handsome young anime man with long red hair tied back, wearing a black coat with red accents and gold details, holding a greatsword, serious expression, Genshin Impact style art, beautiful detailed illustration',
  venti: 'A young anime bard boy with dark green twin braids and teal eyes, wearing a green and white bard outfit, holding a lyre, playful smile, Genshin Impact style art, beautiful detailed illustration, wind effects',
  klee: 'A cute little anime girl with blonde hair and red eyes, wearing a red hat and red dress, holding a bomb, happy smile, Genshin Impact style art, beautiful detailed illustration, explosion effects',
  keqing: 'An elegant young anime woman with purple twin tails and purple eyes, wearing a purple and white chinese-style dress, holding a sword, graceful pose, Genshin Impact style art, beautiful detailed illustration, lightning effects',
  ganyu: 'A beautiful anime woman with long blue hair, horns and purple eyes, wearing a white and blue elegant dress, gentle expression, Genshin Impact style art, beautiful detailed illustration, ice effects',
  hu_tao: 'A playful young anime woman with brown hair and orange eyes, wearing a black and red traditional outfit with a hat, holding a polearm, mischievous smile, Genshin Impact style art, beautiful detailed illustration, fire effects',
  xiao: 'A cool young anime man with teal hair and golden eyes, wearing a dark outfit with green accents and a demon mask, holding a polearm, fierce expression, Genshin Impact style art, beautiful detailed illustration, anemo effects',
  zhongli: 'A handsome mature anime man with brown hair and amber eyes, wearing a brown and gold formal suit with dragon patterns, holding a polearm, dignified expression, Genshin Impact style art, beautiful detailed illustration, geo effects',
  raiden: 'A beautiful anime woman with long purple hair and purple eyes, wearing a purple and white elegant outfit, holding a sword, majestic expression, Genshin Impact style art, beautiful detailed illustration, lightning effects',
  ayaka: 'An elegant anime woman with long light blue hair and blue eyes, wearing a white and blue kimono, holding a folding fan, graceful pose, Genshin Impact style art, beautiful detailed illustration, ice effects',
  nahida: 'A cute young anime girl with white and green hair and green eyes, wearing a green and white elf-like outfit, gentle expression, Genshin Impact style art, beautiful detailed illustration, dendro effects',
  kazuha: 'A handsome young anime man with white and red hair and red eyes, wearing a red and white japanese-style outfit, holding a sword, serene expression, maple leaves falling, Genshin Impact style art, beautiful detailed illustration, anemo wind effects',
  yoimiya: 'A cheerful young anime woman with blonde hair and orange eyes, wearing a red and orange outfit, holding a bow, bright smile, fireworks background, Genshin Impact style art, beautiful detailed illustration, pyro effects',
  ayato: 'A handsome young anime man with light blue hair and blue eyes, wearing a white and blue japanese-style formal outfit, holding a sword, calm expression, Genshin Impact style art, beautiful detailed illustration, hydro water effects',
  yelan: 'A beautiful anime woman with short dark blue hair and blue eyes, wearing a dark blue and black outfit with fur trim, holding a bow, mysterious smile, Genshin Impact style art, beautiful detailed illustration, hydro water effects',
  itto: 'A tall muscular anime man with white hair and red horns, wearing red and black outfit, holding a greatsword, fierce grin, Genshin Impact style art, beautiful detailed illustration, geo rock effects',
  tighnari: 'A handsome young anime man with dark green hair and fox ears, green eyes, wearing a green and brown ranger outfit, holding a bow, serious expression, forest background, Genshin Impact style art, beautiful detailed illustration, dendro effects',
  cyno: 'A handsome anime man with silver hair and red eyes, wearing an egyptian-style headdress and dark outfit, holding a polearm, serious expression, Genshin Impact style art, beautiful detailed illustration, electro lightning effects',
  nilou: 'A beautiful anime woman with long red hair and blue eyes, wearing a white and blue dancer outfit, dancing gracefully, water lilies, Genshin Impact style art, beautiful detailed illustration, hydro water effects',
  wanderer: 'A cool young anime man with indigo hair and blue eyes, wearing a dark blue and purple outfit with a wide hat, holding a catalyst, cold expression, Genshin Impact style art, beautiful detailed illustration, anemo wind effects',
  alhaitham: 'A handsome young anime man with silver hair and teal eyes, wearing a dark green and black outfit with gold accessories, holding a sword, calm expression, Genshin Impact style art, beautiful detailed illustration, dendro effects',
  dehya: 'A beautiful anime woman with long dark brown hair and brown eyes, wearing a red and gold desert outfit with cat ears, holding a greatsword, confident smile, desert background, Genshin Impact style art, beautiful detailed illustration, pyro fire effects',
  baizhu: 'A handsome mature anime man with long white hair and green eyes, wearing a white and green pharmacist robe, holding a catalyst, gentle smile, white snake around neck, Genshin Impact style art, beautiful detailed illustration, dendro effects',
  furina: 'A beautiful anime woman with white and blue hair and blue eyes, wearing an elegant blue and white dress with a small top hat, holding a sword, dramatic expression, Genshin Impact style art, beautiful detailed illustration, hydro water effects',
  neuvillette: 'A handsome mature anime man with long silver hair and blue eyes, wearing a black and white formal judge outfit, holding a catalyst, dignified expression, Genshin Impact style art, beautiful detailed illustration, hydro water effects',
  wriothesley: 'A handsome anime man with short black hair and blue eyes, wearing a dark blue and black outfit with a fur collar, holding a catalyst, cool expression, Genshin Impact style art, beautiful detailed illustration, cryo ice effects'
};

function getImageUrl(charId) {
  const prompt = IMAGE_PROMPTS[charId] || 'anime character portrait, Genshin Impact style';
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_4_3`;
}

function generatePage(char) {
  const el = ELEMENTS[char.element];
  const imgUrl = getImageUrl(char.id);
  const stars = '★'.repeat(char.rarity);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${char.name} · ${char.title} - 原神角色图鉴</title>
  <link rel="stylesheet" href="../css/style.css">
  <style>
    .detail-hero { --element-color: ${el.color}; --element-color-dark: ${el.dark}; }
  </style>
</head>
<body>
  <div class="bg-particles" id="particles"></div>

  <nav class="navbar">
    <a href="../index.html" class="logo">
      <span class="logo-icon">原</span>
      <span>提瓦特图鉴</span>
    </a>
    <ul class="nav-links">
      <li><a href="../index.html#home">首页</a></li>
      <li><a href="../index.html#characters">角色</a></li>
      <li><a href="../versions.html">版本剧情</a></li>
      <li><a href="../index.html#about">关于</a></li>
    </ul>
  </nav>

  <main class="detail-hero fade-in">
    <!-- 左侧立绘 -->
    <div class="detail-portrait-wrap">
      <img src="${imgUrl}" alt="${char.name}立绘">
    </div>

    <!-- 右侧信息 -->
    <div class="detail-info">
      <a href="../index.html#characters" class="back-btn">← 返回角色列表</a>

      <h1>${char.name}</h1>
      <p class="char-title">${char.title}</p>

      <div class="detail-tags">
        <span class="tag element-tag">${el.icon}元素</span>
        <span class="tag">${char.region}</span>
        <span class="tag">${char.weapon}</span>
        <span class="tag">${stars}</span>
      </div>

      <div class="detail-quote">"${char.quote}"</div>

      <div class="detail-section">
        <h3>故 事 背 景</h3>
        <p>${char.bg}</p>
      </div>

      <div class="detail-section">
        <h3>主 要 剧 情</h3>
        <p>${char.plot}</p>
      </div>
    </div>
  </main>

  <footer class="footer">
    <p>© 提瓦特角色图鉴 · 原神爱好者制作 · 仅供学习交流</p>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>`;
}

// 生成所有角色页面
let count = 0;
CHARACTERS.forEach(char => {
  const filePath = path.join(DIST_DIR, `${char.id}.html`);
  fs.writeFileSync(filePath, generatePage(char), 'utf-8');
  count++;
  console.log(`✓ 生成: characters/${char.id}.html  (${char.name})`);
});

console.log(`\n共生成 ${count} 个角色详情页。`);
