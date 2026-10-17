/**
 * Görsel yedeği — index.html'deki satır içi <script>'ten taşındı (CSP satır içi
 * script'e izin vermiyor). Body'nin başında, klasik script olarak yüklenir ki
 * sayfadaki ilk görsellerin hataları da yakalansın.
 *
 * - data-fallback="…" olan bir görsel yüklenemezse bir kez o adrese geçer
 *   (ör. video kapağı hqdefault -> mqdefault).
 * - Diğer görsellerin yerine tasarlanmış bir yer tutucu paneli (başlık + sarı
 *   sıra işareti) konur.
 */
window.__imgFallback = function (img) {
  if (!img || img.dataset.phDone) return;
  img.dataset.phDone = '1';
  var host = img.parentElement;
  if (!host) return;
  var dark = !!img.closest('[data-theme="dark"], .vids, .bcast, .footer');
  var cap = img.dataset.caption || img.alt || '';
  var idx = img.dataset.index || '';
  var note = img.dataset.note || 'Görsel buraya gelecek';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  var ph = document.createElement('span');
  ph.className = 'imgph' + (dark ? ' imgph--dark' : '');
  ph.setAttribute('aria-hidden', 'true');
  ph.innerHTML =
    (idx ? '<span class="imgph__idx">' + idx + '</span>' : '') +
    '<span class="imgph__body"><span class="imgph__cap"></span>' +
    '<span class="imgph__rule"></span>' +
    '<span class="imgph__note"></span></span>';
  ph.querySelector('.imgph__cap').textContent = cap;
  ph.querySelector('.imgph__note').textContent = note;
  img.style.display = 'none';
  host.appendChild(ph);
};

// Yakalama aşamasında ('error' kabarcıklanmaz): JS ile sonradan eklenen görseller de kapsanır.
document.addEventListener('error', function (e) {
  var t = e.target;
  if (!t || t.tagName !== 'IMG') return;
  if (t.dataset.fallback) {
    var fallback = t.dataset.fallback;
    delete t.dataset.fallback;
    t.src = fallback;
    return;
  }
  // vids__thumb hariç: kapağın yedeği data-fallback ile hqdefault -> mqdefault;
  // o da yüklenemezse buradaki panel kartı gizleyip bozardı.
  if (!t.classList.contains('navbar__logo')
    && !t.classList.contains('footer__logo')
    && !t.classList.contains('vids__thumb')) window.__imgFallback(t);
}, true);
