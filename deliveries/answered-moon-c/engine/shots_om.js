// OpenMontage shots: S03 S04 S05 S06 S08. Real footage (Pexels) + the shared Answered. kit.
(function () {
  const { W, H, clamp, lerp, seg, ss, eo, eio, back, captions, icon, tag, frame, legibility } = KIT;
  const B = BRAND, ctx = CTX, S = window.S;
  const N = { s03a: 90, s03b: 90, s04a: 108, s04a_half: 108, s04b_half: 90, s05: 180, s06a: 120, s06b: 105, s06c: 120, s08a: 90, s08b: 105, s08c: 90, s08d: 90 };
  const wt = i => S.words[i].t0;
  // draw a full-frame clip with a gentle slow push
  async function clip(name, lt, len, opt = {}) {
    const im = await frame(name, lt, N[name]);
    const z = 1 + (opt.push ?? 0.035) * eio(lt / Math.max(len, 0.5));
    ctx.save(); ctx.translate(540, opt.cy ?? 960); ctx.scale(z, z); ctx.drawImage(im, -540, -(opt.cy ?? 960), W, H); ctx.restore();
  }
  // edit list helper: [[name, tStart], ...] -> clip at t
  async function edl(list, t, opt) {
    let i = list.length - 1; while (i > 0 && t < list[i][1]) i--;
    const [name, t0] = list[i], t1 = i + 1 < list.length ? list[i + 1][1] : S.dur;
    await clip(name, t - t0, t1 - t0, opt);
  }
  const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };

  // ---- S03 Diwali ----
  async function S03(t) {
    await edl([['s03a', 0], ['s03b', wt(4) - 0.07]], t);   // cut on "Diwali"
    legibility(ctx);
    tag(ctx, 'CLOCK · Diwali → new moon', 'clock', t);
    captions(ctx, S, t);
  }

  // ---- S04 Holi | Raksha Bandhan: frame splits 50/50 on "Raksha" ----
  async function S04(t) {
    const tc = wt(2) - 0.08, p = eio(seg(t, tc, tc + 0.4));
    const holi = await frame(p > 0 ? 's04a' : 's04a', t, N.s04a);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    // Holi: full frame -> top half (keeps its centre)
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H - 960 * p); ctx.clip();
    const z = 1 + 0.03 * eio(t / S.dur); ctx.translate(540, 960 - 480 * p); ctx.scale(z, z); ctx.drawImage(holi, -540, -960, W, H); ctx.restore();
    if (p > 0) {
      const lt = t - tc, rk = await frame('s04b_half', lt, N.s04b_half), y = 960 + 960 * (1 - p);
      ctx.save(); ctx.beginPath(); ctx.rect(0, y, W, 960); ctx.clip(); const z2 = 1 + 0.03 * eio(lt / 2.6); ctx.translate(540, y + 480); ctx.scale(z2, z2); ctx.drawImage(rk, -540, -480, W, 960); ctx.restore();
      ctx.fillStyle = B.accent; ctx.fillRect(0, y - 3, W, 6);
    }
    legibility(ctx);
    tag(ctx, 'Holi · Raksha Bandhan → full moon', null, t);
    captions(ctx, S, t);
  }

  // ---- S05 Eid + blanking calendar ----
  function phase(c, kind, x, y, r) {
    c.save(); c.translate(x, y);
    if (kind === 'new') { c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); c.fillStyle = 'rgba(0,0,0,0.35)'; c.fill(); }
    else if (kind === 'full') { c.fillStyle = B.paper; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); }
    else { c.fillStyle = B.paper; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(r * 0.45, -r * 0.15, r * 0.95, 0, 7); c.fill(); }
    c.restore();
  }
  async function S05(t) {
    await clip('s05', t, S.dur, { push: 0.03 });
    legibility(ctx);
    tag(ctx, 'Eid → moon sighting', null, t);
    // calendar card (lower half)
    const a = eo(seg(t, 0.25, 0.65)); if (a > 0) {
      const x0 = 70, y0 = 1350 + (1 - a) * 40, w = 940, h = 400;
      ctx.save(); ctx.globalAlpha = a;
      ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
      ctx.fillStyle = hexA(B.bg, 0.88); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 26); ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.fillStyle = B.accent; ctx.beginPath(); ctx.roundRect(x0, y0, w, 64, [26, 26, 0, 0]); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `800 32px ${B.font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '6px';
      ctx.fillText('FESTIVAL CALENDAR', x0 + w / 2, y0 + 34); ctx.letterSpacing = '0px';
      const tiles = [['HOLI', 'full', 'full moon'], ['EID', 'cres', 'crescent'], ['RAKHI', 'full', 'full moon'], ['DIWALI', 'new', 'new moon']];
      const blankAt = [wt(6), wt(8), wt(11), wt(13)];   // "set", "year", "Moon", "no"
      tiles.forEach(([nm, ph, lab], i) => {
        const tx = x0 + 30 + i * 225, ty = y0 + 92, tw = 205, th = 280, b = eo(seg(t, blankAt[i] - 0.05, blankAt[i] + 0.35));
        ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 18); ctx.fill();
        ctx.setLineDash([10, 8]); ctx.strokeStyle = `rgba(255,255,255,${0.15 + 0.45 * b})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 18); ctx.stroke(); ctx.setLineDash([]);
        ctx.save(); ctx.globalAlpha = a * (1 - b);
        ctx.fillStyle = B.ink; ctx.font = `800 34px ${B.font}`; ctx.fillText(nm, tx + tw / 2, ty + 44);
        phase(ctx, ph, tx + tw / 2, ty + 138, 46);
        ctx.fillStyle = B.muted; ctx.font = `600 26px ${B.font}`; ctx.fillText(lab, tx + tw / 2, ty + 236);
        ctx.restore();
        if (b > 0) { ctx.save(); ctx.globalAlpha = a * b * 0.6; ctx.fillStyle = B.ink; ctx.font = `800 64px ${B.font}`; ctx.fillText('?', tx + tw / 2, ty + th / 2 + 4); ctx.restore(); }
      });
      ctx.restore();
    }
    captions(ctx, S, t);
  }

  // ---- S06 Turtles: nights go dark ----
  async function S06(t) {
    const c1 = wt(6) - 0.08, c2 = wt(9) - 0.08;   // "On", "olive"
    await edl([['s06a', 0], ['s06b', c1], ['s06c', c2]], t);
    if (t < c1) { const d = ss(wt(2), wt(5) + 0.3, t);   // "nights" .. "dark."
      ctx.fillStyle = `rgba(4,10,28,${0.55 * d})`; ctx.fillRect(0, 0, W, H);
      const v = ctx.createRadialGradient(540, 960, 300, 540, 960, 1150); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${0.55 * d})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); }
    legibility(ctx);
    tag(ctx, 'LAMP · Odisha · Olive Ridley turtles', 'lamp', t);
    captions(ctx, S, t);
  }

  // ---- S08 Tides + draining bar ----
  async function S08(t) {
    const c1 = wt(5) - 0.08, c2 = wt(11) - 0.08, c3 = wt(13) - 0.08;   // "Tides", "Mangroves", "tide"
    await edl([['s08a', 0], ['s08b', c1], ['s08c', c2], ['s08d', c3]], t);
    legibility(ctx);
    tag(ctx, 'Tides: ~⅓', null, t);
    const ap = seg(t, c1 + 0.05, c1 + 0.4);
    if (ap > 0) {
      const lvl = lerp(1, 0.33, eio(seg(t, wt(6), wt(10) + 0.4)));   // "shrink" .. "third."
      const x = 930, y0 = 560, h = 600, w = 70, sc = 0.85 + 0.15 * back(ap, 2);
      ctx.save(); ctx.globalAlpha = clamp(ap / 0.5); ctx.translate(x + w / 2, y0 + h / 2); ctx.scale(sc, sc); ctx.translate(-(x + w / 2), -(y0 + h / 2));
      ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 20;
      ctx.fillStyle = 'rgba(8,16,34,0.55)'; ctx.beginPath(); ctx.roundRect(x, y0, w, h, 35); ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.save(); ctx.beginPath(); ctx.roundRect(x, y0, w, h, 35); ctx.clip();
      const wy = y0 + h * (1 - lvl);
      const g = ctx.createLinearGradient(0, wy, 0, y0 + h); g.addColorStop(0, '#7CC6F2'); g.addColorStop(1, '#2A6FB0'); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x, wy); for (let k = 0; k <= 10; k++) ctx.lineTo(x + k * w / 10, wy + 4 * Math.sin(k * 1.1 + t * 5)); ctx.lineTo(x + w, y0 + h); ctx.lineTo(x, y0 + h); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(x, y0, w, h, 35); ctx.stroke();
      // 1/3 tick
      const ty = y0 + h * (1 - 0.33); ctx.strokeStyle = B.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 18, ty); ctx.lineTo(x, ty); ctx.stroke();
      // live % label riding the waterline
      ctx.font = `800 40px ${B.font}`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillStyle = lvl < 0.36 ? B.accent : B.ink;
      ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12;
      ctx.fillText(Math.round(lvl * 100) + '%', x - 26, wy);
      ctx.font = `700 26px ${B.font}`; ctx.fillStyle = B.ink; ctx.textAlign = 'center'; ctx.fillText('TIDE', x + w / 2, y0 - 30);
      ctx.restore();
    }
    captions(ctx, S, t);
  }

  const SHOTS = { S03, S04, S05, S06, S08 };
  window.render = async function (t) { await SHOTS[SHOT](Math.min(t, DUR - 1e-4)); };
  bootFonts(async () => { await frame('s03a', 0, 1).catch(() => {}); });
})();
