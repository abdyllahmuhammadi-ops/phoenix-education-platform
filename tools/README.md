# ابزارهای آزمایش سامانه

نیازمندی: Node، `playwright` (با Chromium)، `react@18.2.0`، `react-dom@18.2.0`، `@babel/standalone@7.23.5`.
```
export NODE_MODULES_DIR=/مسیر/node_modules      # پیش‌فرض ./node_modules
export PHOENIX_INDEX=/مسیر/index.html           # پیش‌فرض ./index.html
export NODE_PATH=/مسیر/جایی/که/playwright/نصب/است   # مثلاً خروجی npm root -g
node tools/pe.js         # خطای نحوی
node tools/audit.js      # همه آزمایش‌ها (باید [] و ERRS [] بدهد)
node tools/aud2.js ID1,ID2
```
اسکریپت‌های پایتون کنکور مسیرهای ثابت دارند؛ قبل از اجرا مسیرها را تنظیم کنید.
