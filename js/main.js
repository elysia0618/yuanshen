/**
 * 原神角色图鉴 - 主交互脚本
 */

// 角色立绘图片提示词（用于文本生成图像 API）
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

/**
 * 获取角色立绘图片 URL（使用文本生成图像 API）
 */
function getCharacterImage(charId) {
  const prompt = IMAGE_PROMPTS[charId] || 'anime character portrait, Genshin Impact style, beautiful detailed illustration';
  const encoded = encodeURIComponent(prompt);
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=portrait_4_3`;
}

/**
 * 渲染角色卡片网格
 */
function renderCharacters(filter = 'all') {
  const grid = document.getElementById('charactersGrid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? CHARACTERS
    : CHARACTERS.filter(c => c.element === filter);

  grid.innerHTML = '';

  filtered.forEach((char, index) => {
    const el = ELEMENTS[char.element];
    const card = document.createElement('a');
    card.href = `characters/${char.id}.html`;
    card.className = 'character-card';
    card.style.animationDelay = `${index * 0.05}s`;
    card.style.setProperty('--element-color', el.color);
    card.style.setProperty('--element-color-dark', el.dark);

    card.innerHTML = `
      <div class="card-image">
        <img src="${getCharacterImage(char.id)}" alt="${char.name}立绘" loading="lazy" onerror="this.style.opacity='0.3'">
        <div class="element-badge" style="background:${el.color}; box-shadow:0 0 12px ${el.color};">${el.icon}</div>
        <div class="rarity-badge">${'★'.repeat(char.rarity)}</div>
        <div class="card-hover-overlay">
          <span class="view-detail">查 看 详 情</span>
        </div>
      </div>
      <div class="card-info">
        <div class="card-name">${char.name}</div>
        <div class="card-title">${char.title}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * 初始化元素筛选
 */
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCharacters(btn.dataset.element);
    });
  });
}

/**
 * 创建背景粒子
 */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('span');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.width = particle.style.height = (Math.random() * 3 + 2) + 'px';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    container.appendChild(particle);
  }
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderCharacters('all');
  initFilter();
  initSmoothScroll();
});
