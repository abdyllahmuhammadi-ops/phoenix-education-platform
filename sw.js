// ققنوس — Service Worker
// هدف: نصب‌پذیرشدن سامانه روی صفحه‌ی اصلی گوشی (PWA) و کارکردن حداقلی آفلاین.
// نسخه‌ی کش را هر بار که index.html تغییر مهمی می‌کند، تغییر بده تا کاربران نسخه‌ی تازه را بگیرند.
const CACHE_VERSION = "phoenix-cache-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // فقط درخواست‌های GET را از کش مدیریت می‌کنیم — درخواست‌های API (مثل هوش مصنوعی یا ذخیره‌سازی) همیشه مستقیم به شبکه بروند
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // درخواست‌های API و ذخیره‌سازی را اصلاً دست نمی‌زنیم — باید همیشه زنده و تازه باشند
  if (url.origin !== self.location.origin && !url.hostname.endsWith("cdnjs.cloudflare.com")) {
    return;
  }

  // برای صفحه‌ی اصلی: ابتدا شبکه را امتحان کن تا همیشه آخرین نسخه بیاید؛ اگر آفلاین بود، از کش بده
  if (req.mode === "navigate" || url.pathname.endsWith("index.html") || url.pathname === "/" || url.pathname.endsWith("/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  // برای بقیه (فونت‌ها، کتابخانه‌های cdnjs، آیکون‌ها): اول کش، بعد شبکه (سریع و قابل‌استفاده‌ی آفلاین)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone)).catch(() => {});
          return res;
        })
        .catch(() => cached);
    })
  );
});
