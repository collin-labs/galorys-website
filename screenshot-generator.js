/**
 * 📸 SCREENSHOTTER PRO - GALORYS (COMPLETO)
 * TODAS as páginas do projeto
 * 
 * Total: 70+ páginas
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// 📝 CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  outputDir: './screenshots',
  
  viewports: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 },
  },
  
  activeViewports: ['desktop', 'tablet', 'mobile'],
  waitTime: 2000,
  fullPage: true,
  format: 'png',
  quality: 90,
};

// ═══════════════════════════════════════════════════════════════════
// 📄 TODAS AS PÁGINAS DO GALORYS
// ═══════════════════════════════════════════════════════════════════

const PAGES = [
  // ══════════════════════════════════════
  // 🌐 PÚBLICAS - PRINCIPAIS
  // ══════════════════════════════════════
  { path: '/', name: '01-home' },
  { path: '/sobre', name: '02-sobre' },
  { path: '/contato', name: '03-contato' },
  { path: '/faq', name: '04-faq' },
  { path: '/termos', name: '05-termos' },
  { path: '/privacidade', name: '06-privacidade' },
  { path: '/login', name: '07-login' },
  
  // ══════════════════════════════════════
  // 🏆 TIMES
  // ══════════════════════════════════════
  { path: '/times', name: '10-times-lista' },
  { path: '/times/cs2', name: '11-time-cs2' },
  { path: '/times/cs2-galorynhos', name: '12-time-galorynhos' },
  { path: '/times/cod-mobile', name: '13-time-codm' },
  { path: '/times/gran-turismo', name: '14-time-granturismo' },
  
  // ══════════════════════════════════════
  // 👤 JOGADORES - LISTA
  // ══════════════════════════════════════
  { path: '/jogadores', name: '20-jogadores-lista' },
  
  // ══════════════════════════════════════
  // 👤 JOGADORES - CS2 (Individuais)
  // ══════════════════════════════════════
  { path: '/times/cs2/jogador/artzin', name: '21-jogador-artzin' },
  { path: '/times/cs2/jogador/cagao', name: '22-jogador-cagao' },
  { path: '/times/cs2/jogador/gutotrindade', name: '23-jogador-gutotrindade' },
  { path: '/times/cs2/jogador/lubansa', name: '24-jogador-lubansa' },
  { path: '/times/cs2/jogador/madmartigan', name: '25-jogador-madmartigan' },
  { path: '/times/cs2/jogador/malibu', name: '26-jogador-malibu' },
  
  // ══════════════════════════════════════
  // 👤 JOGADORES - CS2 GALORYNHOS (Individuais)
  // ══════════════════════════════════════
  { path: '/times/cs2-galorynhos/jogador/chacall', name: '27-jogador-chacall' },
  { path: '/times/cs2-galorynhos/jogador/leall', name: '28-jogador-leall' },
  { path: '/times/cs2-galorynhos/jogador/lusca1911', name: '29-jogador-lusca1911' },
  { path: '/times/cs2-galorynhos/jogador/mths', name: '30-jogador-mths' },
  { path: '/times/cs2-galorynhos/jogador/wini', name: '31-jogador-wini' },
  
  // ══════════════════════════════════════
  // 👤 JOGADORES - COD MOBILE (Individuais)
  // ══════════════════════════════════════
  { path: '/times/cod-mobile/jogador/delsjr', name: '32-jogador-delsjr' },
  { path: '/times/cod-mobile/jogador/gabrielogro', name: '33-jogador-gabrielogro' },
  { path: '/times/cod-mobile/jogador/luixz', name: '34-jogador-luixz' },
  { path: '/times/cod-mobile/jogador/nytsz', name: '35-jogador-nytsz' },
  { path: '/times/cod-mobile/jogador/tsjm', name: '36-jogador-tsjm' },
  
  // ══════════════════════════════════════
  // 👤 JOGADORES - GRAN TURISMO (Individuais)
  // ══════════════════════════════════════
  { path: '/times/gran-turismo/jogador/danilofab', name: '37-jogador-danilofab' },
  { path: '/times/gran-turismo/jogador/g1anna', name: '38-jogador-g1anna' },
  
  // ══════════════════════════════════════
  // 🏅 CONQUISTAS & OUTROS
  // ══════════════════════════════════════
  { path: '/conquistas', name: '40-conquistas' },
  { path: '/wallpapers', name: '41-wallpapers' },
  { path: '/roblox', name: '42-roblox' },
  
  // ══════════════════════════════════════
  // 👤 DASHBOARD DO CLIENTE
  // ══════════════════════════════════════
  { path: '/dashboard', name: '50-dashboard-home' },
  { path: '/dashboard/favoritos', name: '51-dashboard-favoritos' },
  { path: '/dashboard/recompensas', name: '52-dashboard-recompensas' },
  { path: '/dashboard/configuracoes', name: '53-dashboard-config' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - PRINCIPAL
  // ══════════════════════════════════════
  { path: '/admin', name: '60-admin-home' },
  { path: '/admin/configuracoes', name: '61-admin-config' },
  { path: '/admin/layout-home', name: '62-admin-layout' },
  { path: '/admin/backup', name: '63-admin-backup' },
  { path: '/admin/mensagens', name: '64-admin-mensagens' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - USUÁRIOS
  // ══════════════════════════════════════
  { path: '/admin/usuarios', name: '65-admin-usuarios' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - TIMES
  // ══════════════════════════════════════
  { path: '/admin/times', name: '66-admin-times-lista' },
  { path: '/admin/times/novo', name: '67-admin-times-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - JOGADORES
  // ══════════════════════════════════════
  { path: '/admin/jogadores', name: '68-admin-jogadores-lista' },
  { path: '/admin/jogadores/novo', name: '69-admin-jogadores-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - PARTIDAS
  // ══════════════════════════════════════
  { path: '/admin/partidas', name: '70-admin-partidas-lista' },
  { path: '/admin/partidas/novo', name: '71-admin-partidas-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - CONQUISTAS
  // ══════════════════════════════════════
  { path: '/admin/conquistas', name: '72-admin-conquistas-lista' },
  { path: '/admin/conquistas/novo', name: '73-admin-conquistas-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - BANNERS
  // ══════════════════════════════════════
  { path: '/admin/banners', name: '74-admin-banners-lista' },
  { path: '/admin/banners/novo', name: '75-admin-banners-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - SEÇÕES
  // ══════════════════════════════════════
  { path: '/admin/secoes', name: '76-admin-secoes-lista' },
  { path: '/admin/secoes/novo', name: '77-admin-secoes-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - NOTÍCIAS
  // ══════════════════════════════════════
  { path: '/admin/noticias', name: '78-admin-noticias-lista' },
  { path: '/admin/noticias/novo', name: '79-admin-noticias-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - PARCEIROS
  // ══════════════════════════════════════
  { path: '/admin/parceiros', name: '80-admin-parceiros-lista' },
  { path: '/admin/parceiros/novo', name: '81-admin-parceiros-novo' },
  
  // ══════════════════════════════════════
  // ⚙️ ADMIN - RECOMPENSAS
  // ══════════════════════════════════════
  { path: '/admin/recompensas', name: '82-admin-recompensas-lista' },
  { path: '/admin/recompensas/novo', name: '83-admin-recompensas-novo' },
  { path: '/admin/resgates', name: '84-admin-resgates' },
];

// ═══════════════════════════════════════════════════════════════════
// 🎨 CORES DO CONSOLE
// ═══════════════════════════════════════════════════════════════════

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(color, emoji, message) {
  console.log(`${colors[color]}${emoji} ${message}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════════════
// 📸 FUNÇÕES PRINCIPAIS
// ═══════════════════════════════════════════════════════════════════

async function createDirectories() {
  log('blue', '📁', 'Criando diretórios...');
  
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  for (const viewport of CONFIG.activeViewports) {
    const dir = path.join(CONFIG.outputDir, viewport);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  
  log('green', '✓', 'Diretórios criados!');
}

async function takeScreenshot(browser, page, viewport) {
  const { width, height } = CONFIG.viewports[viewport];
  const url = `${CONFIG.baseUrl}${page.path}`;
  const filename = `${page.name}.${CONFIG.format}`;
  const filepath = path.join(CONFIG.outputDir, viewport, filename);
  
  const browserPage = await browser.newPage();
  
  try {
    await browserPage.setViewport({ width, height });
    
    await browserPage.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(r => setTimeout(r, CONFIG.waitTime));
    
    const screenshotOptions = {
      path: filepath,
      fullPage: CONFIG.fullPage,
    };
    
    if (CONFIG.format === 'jpeg') {
      screenshotOptions.quality = CONFIG.quality;
    }
    
    await browserPage.screenshot(screenshotOptions);
    
    log('green', '✓', `${viewport}/${filename}`);
    
  } catch (error) {
    log('red', '✗', `Erro em ${page.path}: ${error.message}`);
  } finally {
    await browserPage.close();
  }
}

async function generateScreenshots() {
  console.log('\n');
  log('magenta', '📸', '═══════════════════════════════════════════');
  log('magenta', '🎮', '   SCREENSHOTTER PRO - GALORYS COMPLETO');
  log('magenta', '📸', '═══════════════════════════════════════════');
  console.log('\n');
  
  await createDirectories();
  
  log('blue', '🌐', 'Iniciando navegador...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  log('green', '✓', 'Navegador iniciado!');
  console.log('\n');
  
  const totalScreenshots = PAGES.length * CONFIG.activeViewports.length;
  let completed = 0;
  
  log('cyan', '📊', `Total: ${PAGES.length} páginas × ${CONFIG.activeViewports.length} tamanhos = ${totalScreenshots} screenshots`);
  console.log('\n');
  
  for (const viewport of CONFIG.activeViewports) {
    log('yellow', '📱', `Capturando ${viewport.toUpperCase()} (${CONFIG.viewports[viewport].width}px)...`);
    console.log('');
    
    for (const page of PAGES) {
      await takeScreenshot(browser, page, viewport);
      completed++;
    }
    
    console.log('');
  }
  
  await browser.close();
  
  console.log('\n');
  log('magenta', '═══', '═══════════════════════════════════════════');
  log('green', '✅', `CONCLUÍDO! ${completed} screenshots gerados`);
  log('blue', '📁', `Pasta: ${path.resolve(CONFIG.outputDir)}`);
  log('magenta', '═══', '═══════════════════════════════════════════');
  console.log('\n');
  
  log('cyan', '💡', 'PRÓXIMOS PASSOS:');
  console.log('   1. Abra o Figma');
  console.log('   2. Crie um novo arquivo');
  console.log('   3. Arraste a pasta screenshots para o Figma');
  console.log('   4. Organize em frames por viewport');
  console.log('\n');
}

// ═══════════════════════════════════════════════════════════════════
// 🚀 EXECUTAR
// ═══════════════════════════════════════════════════════════════════

generateScreenshots().catch(error => {
  log('red', '❌', `Erro fatal: ${error.message}`);
  process.exit(1);
});
