/** 全站共用：导航、出场动画、下载（版本刷新 + 微信提示）、英文提示 */
export function initSite() {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
  menuBtn?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('[data-menu] a').forEach((a) => a.addEventListener('click', () => nav?.classList.remove('open')));

  // 出场动画
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // 下载按钮：版本与大小实时刷新（发版后官网未重建也是新的）
  fetch('/api/release')
    .then((r) => (r.ok ? r.json() : null))
    .then((r) => {
      if (!r?.version) return;
      const size = `${Math.round(r.size / 1048576)} MB`;
      document.querySelectorAll<HTMLElement>('[data-release-meta]').forEach((el) => {
        el.textContent = el.textContent!.replace(/v[\d.]+(-[\w.]+)? · \d+ MB/, `v${r.version} · ${size}`);
      });
      document.querySelectorAll<HTMLElement>('[data-release-version]').forEach((el) => (el.textContent = r.version));
      document.querySelectorAll<HTMLElement>('[data-release-sha]').forEach((el) => (el.textContent = r.sha256));
      document.querySelectorAll<HTMLElement>('[data-release-size]').forEach((el) => (el.textContent = size));
    })
    .catch(() => {});

  // 微信、QQ、微博等内置浏览器不能下载 APK：拦下来提示在浏览器打开
  const inApp = /MicroMessenger|QQ\/|Weibo|DingTalk|Lark|Feishu|AlipayClient/i.test(navigator.userAgent);
  const mask = document.querySelector<HTMLElement>('[data-wx]');
  if (inApp && mask) {
    document.querySelectorAll<HTMLAnchorElement>('[data-download]').forEach((a) =>
      a.addEventListener('click', (e) => { e.preventDefault(); mask.hidden = false; }),
    );
  }
  mask?.querySelector('[data-wx-close]')?.addEventListener('click', () => (mask.hidden = true));
  mask?.addEventListener('click', (e) => { if (e.target === mask) mask.hidden = true; });
  const copyBtn = mask?.querySelector<HTMLButtonElement>('[data-wx-copy]');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.origin + '/');
      copyBtn.textContent = copyBtn.dataset.done ?? '✓';
    } catch {}
  });

  // 中文页：浏览器语言不是中文时，提示一次可以看英文版（不自动跳转）
  const hint = document.querySelector<HTMLElement>('[data-lang-hint]');
  if (hint) {
    let seen = false;
    try { seen = localStorage.getItem('ts-lang-hint') === '1'; } catch {}
    const zh = (navigator.languages || [navigator.language]).some((l) => /^zh/i.test(l));
    if (!seen && !zh) setTimeout(() => (hint.hidden = false), 1200);
    const dismiss = () => { hint.hidden = true; try { localStorage.setItem('ts-lang-hint', '1'); } catch {} };
    hint.querySelector('[data-lang-hint-close]')?.addEventListener('click', dismiss);
    hint.querySelector('a')?.addEventListener('click', dismiss);
  }
}
