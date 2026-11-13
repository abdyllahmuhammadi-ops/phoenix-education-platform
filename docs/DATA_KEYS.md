# فهرست کلیدهای ذخیره‌سازی (تولیدشده خودکار از کد)

سامانه همه داده‌ها را به‌صورت جفت «کلید ← متن JSON» ذخیره می‌کند. کلیدها معمولاً با «:» به بخش‌ها جدا می‌شوند
(مثلاً `gradebook-data:<کد مدرسه>:<نام کلاس>`) و بخش‌های متغیر از تابع `skey()` عبور می‌کنند تا امن شوند.

هر کلید با پرچم `shared` خوانده/نوشته می‌شود: `true` یعنی داده مشترک بین همه کاربران (باید روی سرور باشد)،
`false` یعنی مخصوص همان کاربر.

## پیشوند کلیدها (فقط بخش ثابت اول هر کلید)

- `all-registered-schools`
- `all-schools-registry`
- `bank`
- `cache`
- `class-field`
- `class-subjects`
- `class-teacher`
- `classes`
- `custom-bakhsh`
- `custom-counties`
- `data`
- `exam-history`
- `flashcards`
- `free-access`
- `freeform-subject-teachers`
- `gradebook-data`
- `gradebook-recent-classes`
- `gradebook-roster`
- `health`
- `hist`
- `history`
- `homework`
- `hygiene-checklist`
- `key`
- `lab-feedback`
- `last-session`
- `list`
- `log`
- `login-code`
- `login-profile`
- `login-role`
- `login-roles`
- `payments`
- `plan`
- `pool`
- `profile`
- `pub`
- `publish`
- `question-bank`
- `rahyar`
- `recent`
- `records`
- `reports`
- `roster`
- `schedule`
- `school`
- `school-classes`
- `school-info`
- `school-letterhead`
- `school-location`
- `school-payments`
- `seen`
- `settings`
- `student-by-national-code`
- `subj`
- `subject-teachers`
- `suggestions`
- `teacher`
- `team-code`
- `team-test-seeded`
- `thread`
- `week`
- `weekly-schedule`

## نکته
برخی موارد این فهرست نام متغیرهای کمکی کد هستند (مثل `bank`، `cache`، `key`، `hist`) نه کلید واقعی؛ هنگام استفاده با جست‌وجو در کد تأیید کنید.
این فهرست فقط پیشوندهای ثابت را نشان می‌دهد. برای دیدن فهرست کامل (با بخش‌های متغیر) در `index.html` جست‌وجو کنید:
`authStorageGet(`، `authStorageSet(`، `window.storage.get(`، `window.storage.set(`.
