import asyncio, json
from playwright.async_api import async_playwright
BASE = '/home/claude/work/node_modules'

FAKE_KONKUR_ITEMS = {
    "items": [
        {"chapter": "معادلات", "text": "حاصل 2+2 چند است؟ الف) 3 ب) 4 ج) 5 د) 6", "difficulty": "آسان", "explanation": "گزینه‌ی ب درست است؛ چون 2+2=4."},
        {"chapter": "هندسه", "text": "مجموع زوایای مثلث چند درجه است؟ الف) 90 ب) 180 ج) 270 د) 360", "difficulty": "آسان", "explanation": "گزینه‌ی ب درست است؛ مجموع زوایای داخلی مثلث 180 درجه است."},
        {"chapter": "آمار", "text": "میانگین 2 و 4 چند است؟ الف) 2 ب) 3 ج) 4 د) 6", "difficulty": "متوسط", "explanation": "گزینه‌ی ب درست است؛ (2+4)/2=3."},
        {"chapter": "مجموعه‌ها", "text": "تعداد زیرمجموعه‌های یک مجموعه‌ی دوعضوی چند است؟ الف) 2 ب) 3 ج) 4 د) 8", "difficulty": "سخت", "explanation": "گزینه‌ی ج درست است؛ 2 به توان 2 برابر 4 است."},
    ]
}

async def route(r):
    u = r.request.url
    if 'react-dom' in u and 'cdnjs' in u: return await r.fulfill(path=BASE+'/react-dom/umd/react-dom.production.min.js',content_type='application/javascript')
    if 'react.production' in u: return await r.fulfill(path=BASE+'/react/umd/react.production.min.js',content_type='application/javascript')
    if 'api.anthropic.com' in u:
        body = {"content": [{"text": json.dumps(FAKE_KONKUR_ITEMS, ensure_ascii=False)}]}
        return await r.fulfill(status=200, content_type='application/json', body=json.dumps(body))
    if u.startswith('file://'): return await r.continue_()
    return await r.abort()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 1200, 'height': 1800})
        page = await ctx.new_page()
        errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))
        await ctx.route('**/*', route)
        await page.goto('file:///home/claude/work/test_vlab_konkur.html')
        await page.wait_for_timeout(300)

        await page.evaluate("() => window.__renderStudentQBank()")
        await page.wait_for_timeout(300)

        code_input = await page.query_selector('xpath=//label[contains(text(),"کد مدرسه")]/following-sibling::input')
        await code_input.fill("12345678")
        load_btn = await page.query_selector('xpath=//button[contains(text(),"مشاهده")]')
        await load_btn.click()
        await page.wait_for_timeout(500)

        start_btn = await page.query_selector('xpath=//button[contains(text(),"آزمون الزامی")]')
        print("mandatory exam start button found:", start_btn is not None)
        if not start_btn:
            txt = await page.inner_text('body')
            print(txt[:1500])
            await b.close()
            return
        await start_btn.click()
        await page.wait_for_timeout(600)

        header = await page.query_selector('.pqb-exam-header h2')
        print("header:", await header.inner_text() if header else None)

        items = await page.query_selector_all('.pqb-question-item')
        print("question items:", len(items))

        # answer: Q1 correct (ب), Q2 wrong (pick الف instead of ب), Q3 blank, Q4 correct (ج)
        option_groups = await page.query_selector_all('.pqb-mcq-options')
        print("mcq groups:", len(option_groups))

        async def click_option_in_group_matching_question(question_text_substr, letter_prefix):
            for qitem, group in zip(items, option_groups):
                qtxt = await qitem.inner_text()
                if question_text_substr in qtxt:
                    opts = await group.query_selector_all('.pqb-mcq-option')
                    for o in opts:
                        txt = await o.inner_text()
                        if txt.strip().startswith(letter_prefix):
                            await o.click()
                            return True
            return False

        # content-based mapping (question order is seeded-shuffled, so match by content, not index)
        await click_option_in_group_matching_question("2+2", "ب)")       # correct (ب)
        await click_option_in_group_matching_question("زوایای", "ج)")     # wrong (correct is ب)
        # "میانگین" question left blank intentionally
        await click_option_in_group_matching_question("زیرمجموعه", "ج)")  # correct (ج)

        finish_btn = await page.query_selector('xpath=//button[contains(text(),"پایان آزمون")]')
        print("finish button text:", await finish_btn.inner_text() if finish_btn else None)
        await finish_btn.click()
        await page.wait_for_timeout(500)

        percent_el = await page.query_selector('.pqb-exam-score p')
        print("result:", await percent_el.inner_text() if percent_el else None)

        all_score_text = await page.query_selector('.pqb-exam-score')
        print("full score box:", (await all_score_text.inner_text()).replace(chr(10), ' | '))

        correct_opts = await page.query_selector_all('.pqb-mcq-option.correct')
        wrong_opts = await page.query_selector_all('.pqb-mcq-option.wrong')
        print("highlighted correct options:", len(correct_opts), "wrong options:", len(wrong_opts))

        print("page errors:", errs)
        await b.close()

asyncio.run(main())
