import re
with open('/home/claude/phoenix-education-platform/index.html', 'r', encoding='utf-8') as f:
    html = f.read()
m = re.search(r'<script type="text/plain" id="app-source">([\s\S]*?)</script>', html)
app = m.group(1)

hook = '''
// فریز کردن زمان روی یک جمعه‌ی هفته‌ی زوج، ساعت صبح — تا آزمون الزامی کنکور فعال باشد
const __FixedDate = Date;
function PatchedDate(...args) {
  if (args.length > 0) return new __FixedDate(...args);
  return new __FixedDate("2026-01-09T09:00:00");
}
PatchedDate.prototype = __FixedDate.prototype;
Object.getOwnPropertyNames(__FixedDate).forEach((k) => {
  if (k !== "prototype" && k !== "name" && k !== "length") {
    try { PatchedDate[k] = __FixedDate[k]; } catch (e) {}
  }
});
PatchedDate.now = () => new __FixedDate("2026-01-09T09:00:00").getTime();
Date = PatchedDate;

window.__renderStudentQBank = () => {
  root.render(React.createElement(StudentQuestionBankView, {
    onBack: () => {},
    prefillSchoolCode: "12345678",
    prefillGrade: "دهم",
    prefillSubject: "ریاضی",
    studentCode: "ST-001",
  }));
};
window.storage = (function() {
  const mem = {};
  return {
    get: async (k) => mem[k] !== undefined ? { value: mem[k] } : null,
    set: async (k, v) => { mem[k] = v; return { ok: true }; },
    __dump: () => mem,
  };
})();'''

app = app.replace('root.render(<><PhoenixApp /><PalThemeFab /><PalRoleSwitch /></>)', hook).replace('root.render(<><PhoenixApp /><PalThemeFab /></>)', hook).replace('root.render(<PhoenixApp />)', hook)

with open('/home/claude/work/app_transformed_src_konkur.jsx', 'w', encoding='utf-8') as f:
    f.write(app)
print("wrote jsx, len:", len(app))
