/*!
 * lp-motion — LPパーツカタログ用の動きライブラリ
 * 使い方: initLpMotion() を1回呼ぶと、ページ内の data-lpm-* が付いた要素がすべて動き出します。
 * 個別に使う場合は lpmReveal() など各関数を呼んでください。どの関数も root（既定は document）を受け取ります。
 * すべての動きは「視差効果を減らす（prefers-reduced-motion）」の設定を尊重します。
 * 自動で強化したくない要素には data-lpm-off（すべて）または data-lpm-off="menu tilt"（名前を指定）を付けてください。
 */
/**
 * lp-motion の JS による強化を、要素ごとに止める（共通）
 * 使い方:
 *   <header data-lpm-off>…</header>                 この要素と中のすべてで、lp-motion の JS を動かさない
 *   <header data-lpm-off="menu autohide">…</header> 名前を書いたものだけ止める（スペースまたはカンマ区切り）
 *   名前の一覧は README の「data-lpm-off で使える名前」を参照
 *   CSS だけの効果はクラスや属性を付けたときだけ効くので、止めたいときはそのクラスを外す
 */
export function lpmOff(el, name) {
    const host = el.closest('[data-lpm-off]');
    if (!host)
        return false;
    const value = (host.getAttribute('data-lpm-off') || '').trim();
    if (!value || value === 'all')
        return true;
    return value.split(/[\s,]+/).includes(name);
}
/**
 * スクロールで要素を表示する
 * 使い方: <div data-lpm-reveal="up">…</div>
 *   種類: up（既定）/ fade / left / right / zoom
 *   data-lpm-delay="200"   表示を遅らせる（ミリ秒）
 *   data-lpm-repeat        画面から外れたら隠し、入るたびに再生する
 *   親に data-lpm-stagger="80" を付けると、子要素が順番に表示される
 */
export function lpmReveal(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-lpm-stagger]').forEach((group) => {
        if (lpmOff(group, 'reveal'))
            return;
        const step = Number(group.dataset.lpmStagger) || 80;
        Array.from(group.children).forEach((child, i) => {
            const el = child;
            if (!el.hasAttribute('data-lpm-reveal')) {
                el.setAttribute('data-lpm-reveal', group.dataset.lpmStaggerType || 'up');
            }
            el.style.setProperty('--lpm-delay', `${i * step}ms`);
        });
    });
    const items = Array.from(root.querySelectorAll('[data-lpm-reveal]:not([data-lpm-ready])')).filter((el) => !lpmOff(el, 'reveal'));
    if (!items.length)
        return;
    if (reduce || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const el = entry.target;
            const repeat = el.hasAttribute('data-lpm-repeat');
            if (entry.isIntersecting) {
                el.classList.add('is-in');
                if (!repeat)
                    io.unobserve(el);
            }
            else if (repeat) {
                el.classList.remove('is-in');
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    items.forEach((el) => {
        const delay = el.dataset.lpmDelay;
        if (delay)
            el.style.setProperty('--lpm-delay', `${Number(delay)}ms`);
        el.setAttribute('data-lpm-ready', '');
        io.observe(el);
    });
}
/**
 * 数字のカウントアップ
 * 使い方: <span data-lpm-count>1,200</span>
 *   表示中の数字（桁区切り・小数も可）を目標値として 0 から数え上げる
 *   data-lpm-count="1200" と書けば、その値を目標にする
 *   data-lpm-duration="1600" で長さを変えられる（ミリ秒）
 */
export function lpmCount(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(root.querySelectorAll('[data-lpm-count]:not([data-lpm-init])')).filter((el) => !lpmOff(el, 'count'));
    if (!items.length)
        return;
    const run = (el) => {
        const raw = el.dataset.lpmCount || el.textContent || '0';
        const target = parseFloat(raw.replace(/[^0-9.\-]/g, ''));
        if (!Number.isFinite(target))
            return;
        const decimals = (raw.split('.')[1] || '').replace(/[^0-9]/g, '').length;
        const fmt = new Intl.NumberFormat('ja-JP', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
        if (reduce) {
            el.textContent = fmt.format(target);
            return;
        }
        const duration = Number(el.dataset.lpmDuration) || 1600;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = fmt.format(target * eased);
            if (t < 1)
                requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    items.forEach((el) => {
        el.setAttribute('data-lpm-init', '');
        el.setAttribute('aria-label', (el.textContent || '').trim());
        el.style.fontVariantNumeric = 'tabular-nums';
    });
    if (!('IntersectionObserver' in window)) {
        items.forEach(run);
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            io.unobserve(entry.target);
            run(entry.target);
        });
    }, { threshold: 0.4 });
    items.forEach((el) => io.observe(el));
}
/**
 * スクロールしたらヘッダーを縮める・影を付ける
 * 使い方: <header data-lpm-header>…</header>
 *   スクロールすると .is-scrolled が付く（見た目は CSS で決める）
 *   data-lpm-header="80" と書くと、80px スクロールしてから切り替わる
 */
export function lpmHeader(root = document) {
    root.querySelectorAll('[data-lpm-header]').forEach((header) => {
        if (header.dataset.lpmInit || lpmOff(header, 'header'))
            return;
        header.dataset.lpmInit = '1';
        if (!('IntersectionObserver' in window))
            return;
        const sentinel = document.createElement('div');
        sentinel.setAttribute('aria-hidden', 'true');
        sentinel.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none';
        header.before(sentinel);
        const offset = Number(header.dataset.lpmHeader) || 0;
        new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', !entry.isIntersecting);
        }, { rootMargin: `${offset}px 0px 0px 0px` }).observe(sentinel);
    });
}
/**
 * ページトップへ戻るボタン
 * 使い方: <a class="lpm-totop" href="#top" data-lpm-totop>…</a>
 *   一定量スクロールすると .is-shown が付いて現れる
 *   data-lpm-totop="400" で表示し始める位置を変えられる（px）
 *   ページ以外の箱をスクロールさせる場合は data-lpm-scroller="#id"
 */
export function lpmToTop(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-lpm-totop]').forEach((btn) => {
        if (btn.dataset.lpmInit || lpmOff(btn, 'totop'))
            return;
        btn.dataset.lpmInit = '1';
        const selector = btn.dataset.lpmScroller;
        const box = selector ? root.querySelector(selector) : null;
        const threshold = Number(btn.dataset.lpmTotop) || 400;
        const getY = () => (box ? box.scrollTop : window.scrollY);
        let ticking = false;
        const update = () => {
            ticking = false;
            btn.classList.toggle('is-shown', getY() > threshold);
        };
        (box !== null && box !== void 0 ? box : window).addEventListener('scroll', () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(update);
        }, { passive: true });
        update();
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            (box !== null && box !== void 0 ? box : window).scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });
    });
}
/**
 * クリックした位置から波紋を広げる
 * 使い方: <button data-lpm-ripple>…</button>
 *   波紋の色は文字色（currentColor）を薄くしたもの
 */
export function lpmRipple(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce)
        return;
    root.querySelectorAll('[data-lpm-ripple]').forEach((el) => {
        if (el.dataset.lpmInit || lpmOff(el, 'ripple'))
            return;
        el.dataset.lpmInit = '1';
        el.addEventListener('pointerdown', (e) => {
            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const dot = document.createElement('span');
            dot.className = 'lpm-ripple__dot';
            dot.style.width = dot.style.height = `${size}px`;
            dot.style.left = `${e.clientX - rect.left - size / 2}px`;
            dot.style.top = `${e.clientY - rect.top - size / 2}px`;
            el.appendChild(dot);
            dot.addEventListener('animationend', () => dot.remove(), { once: true });
        });
    });
}
/**
 * カーソルに吸い寄せられるボタン
 * 使い方: <a data-lpm-magnet>…</a>
 *   data-lpm-magnet="0.35" で吸い寄せの強さを変えられる（0〜1）
 *   マウス操作の端末だけで動き、タッチ端末と「動きを減らす」設定では何もしない
 */
export function lpmMagnet(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !finePointer)
        return;
    root.querySelectorAll('[data-lpm-magnet]').forEach((el) => {
        if (el.dataset.lpmInit || lpmOff(el, 'magnet'))
            return;
        el.dataset.lpmInit = '1';
        const strength = Number(el.dataset.lpmMagnet) || 0.35;
        el.addEventListener('pointermove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        el.addEventListener('pointerleave', () => {
            el.style.transform = '';
        });
    });
}
/**
 * カーソルの位置に合わせてカードを立体的に傾ける
 * 使い方: <div data-lpm-tilt>…</div>
 *   data-lpm-tilt="8" で最大の傾き（度）を変えられる
 *   光の反射は CSS の ::after で描く
 */
export function lpmTilt(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !finePointer)
        return;
    root.querySelectorAll('[data-lpm-tilt]').forEach((el) => {
        if (el.dataset.lpmInit || lpmOff(el, 'tilt'))
            return;
        el.dataset.lpmInit = '1';
        const max = Number(el.dataset.lpmTilt) || 8;
        el.addEventListener('pointermove', (e) => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            el.style.setProperty('--lpm-rx', `${(0.5 - py) * max * 2}deg`);
            el.style.setProperty('--lpm-ry', `${(px - 0.5) * max * 2}deg`);
            el.style.setProperty('--lpm-gx', `${px * 100}%`);
            el.style.setProperty('--lpm-gy', `${py * 100}%`);
            el.classList.add('is-tilting');
        });
        el.addEventListener('pointerleave', () => {
            el.classList.remove('is-tilting');
            el.style.removeProperty('--lpm-rx');
            el.style.removeProperty('--lpm-ry');
        });
    });
}
/**
 * モーダル（<dialog> を開閉アニメ付きで開く）
 * 使い方:
 *   <button data-lpm-open="#movie">動画を見る</button>
 *   <dialog id="movie" class="lpm-modal">… <button data-lpm-close>閉じる</button></dialog>
 *   背景のクリックと Esc キーでも閉じる。開いている間はページのスクロールを止める
 */
export function lpmModal(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    const close = (dialog) => {
        if (!dialog.open || dialog.classList.contains('is-closing'))
            return;
        if (reduce) {
            dialog.close();
            return;
        }
        dialog.classList.add('is-closing');
        const done = () => {
            dialog.classList.remove('is-closing');
            dialog.close();
        };
        dialog.addEventListener('animationend', done, { once: true });
        window.setTimeout(() => {
            if (dialog.classList.contains('is-closing'))
                done();
        }, 400);
    };
    root.querySelectorAll('[data-lpm-open]').forEach((trigger) => {
        if (trigger.dataset.lpmInit || lpmOff(trigger, 'modal'))
            return;
        trigger.dataset.lpmInit = '1';
        trigger.addEventListener('click', (e) => {
            const selector = trigger.dataset.lpmOpen;
            const dialog = selector ? root.querySelector(selector) : null;
            if (!dialog || typeof dialog.showModal !== 'function')
                return;
            e.preventDefault();
            html.style.overflow = 'hidden';
            dialog.showModal();
        });
    });
    root.querySelectorAll('dialog.lpm-modal').forEach((dialog) => {
        if (dialog.dataset.lpmInit || lpmOff(dialog, 'modal'))
            return;
        dialog.dataset.lpmInit = '1';
        dialog.addEventListener('click', (e) => {
            const target = e.target;
            if (target === dialog || target.closest('[data-lpm-close]'))
                close(dialog);
        });
        dialog.addEventListener('cancel', (e) => {
            e.preventDefault();
            close(dialog);
        });
        dialog.addEventListener('close', () => {
            html.style.removeProperty('overflow');
        });
    });
}
/**
 * タブ（キーボード操作・読み上げ対応）
 * 使い方:
 *   <div data-lpm-tabs>
 *     <div role="tablist" aria-label="…">
 *       <button role="tab" aria-selected="true" aria-controls="p1" id="t1">…</button>
 *     </div>
 *     <div role="tabpanel" id="p1" aria-labelledby="t1">…</div>
 *   </div>
 *   ← → キーで移動、Home / End で端へ
 */
export function lpmTabs(root = document) {
    root.querySelectorAll('[data-lpm-tabs]').forEach((box) => {
        if (box.dataset.lpmInit || lpmOff(box, 'tabs'))
            return;
        box.dataset.lpmInit = '1';
        const tabs = Array.from(box.querySelectorAll('[role="tab"]'));
        if (!tabs.length)
            return;
        const select = (index, focus = false) => {
            tabs.forEach((tab, i) => {
                const on = i === index;
                tab.setAttribute('aria-selected', String(on));
                tab.tabIndex = on ? 0 : -1;
                const id = tab.getAttribute('aria-controls');
                const panel = id ? box.querySelector(`#${id}`) : null;
                if (panel)
                    panel.hidden = !on;
            });
            if (focus)
                tabs[index].focus();
        };
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => select(i));
            tab.addEventListener('keydown', (e) => {
                const last = tabs.length - 1;
                const next = {
                    ArrowRight: i === last ? 0 : i + 1,
                    ArrowLeft: i === 0 ? last : i - 1,
                    Home: 0,
                    End: last,
                };
                if (e.key in next) {
                    e.preventDefault();
                    select(next[e.key], true);
                }
            });
        });
        const current = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
        select(current < 0 ? 0 : current);
    });
}
/**
 * ビフォーアフターの比較スライダー
 * 使い方:
 *   <div class="lpm-compare" data-lpm-compare>
 *     <div class="lpm-compare__before">…</div>
 *     <div class="lpm-compare__after">…</div>
 *     <input class="lpm-compare__range" type="range" min="0" max="100" value="50" aria-label="…">
 *     <span class="lpm-compare__handle" aria-hidden="true"></span>
 *   </div>
 *   操作は range 入力そのものなので、キーボードでも動かせる
 */
export function lpmCompare(root = document) {
    root.querySelectorAll('[data-lpm-compare]').forEach((box) => {
        if (box.dataset.lpmInit || lpmOff(box, 'compare'))
            return;
        box.dataset.lpmInit = '1';
        const range = box.querySelector('input[type="range"]');
        if (!range)
            return;
        const sync = () => {
            box.style.setProperty('--lpm-pos', `${range.value}%`);
        };
        range.addEventListener('input', sync);
        sync();
    });
}
/**
 * お知らせを閉じる（閉じたことを覚えて、次回から表示しない）
 * 使い方:
 *   <div data-lpm-dismissible>
 *     …お知らせ…
 *     <button data-lpm-dismiss="newyear-2026" aria-label="閉じる">×</button>
 *   </div>
 *   data-lpm-dismiss の値ごとに記憶する。内容を変えたら値も変えると、また表示される
 */
export function lpmDismiss(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-lpm-dismiss]').forEach((btn) => {
        if (btn.dataset.lpmInit || lpmOff(btn, 'dismiss'))
            return;
        btn.dataset.lpmInit = '1';
        const box = btn.closest('[data-lpm-dismissible]');
        if (!box)
            return;
        const key = `lpm-dismiss:${btn.dataset.lpmDismiss || 'default'}`;
        let saved = false;
        try {
            saved = window.localStorage.getItem(key) === '1';
        }
        catch {
            saved = false;
        }
        if (saved) {
            box.hidden = true;
            return;
        }
        btn.addEventListener('click', () => {
            try {
                window.localStorage.setItem(key, '1');
            }
            catch {
                /* 保存できない環境では、今回だけ閉じる */
            }
            if (reduce) {
                box.hidden = true;
                return;
            }
            box.classList.add('is-leaving');
            window.setTimeout(() => {
                box.hidden = true;
            }, 250);
        });
    });
}
const LPM_FIELD_BOX = '[data-lpm-field], .ui-field, .lp-form__row, .lp-fi__field';
/** 項目名を label から取り出す（「必須」などの印は除く） */
function lpmFieldLabel(field) {
    if (field.dataset.lpmLabel)
        return field.dataset.lpmLabel;
    const label = field.labels && field.labels[0];
    if (!label)
        return 'この項目';
    const copy = label.cloneNode(true);
    copy.querySelectorAll('span, small, [aria-hidden="true"]').forEach((n) => n.remove());
    return (copy.textContent || '').replace(/\s+/g, ' ').trim() || 'この項目';
}
/** 入力の状態から日本語のエラー文を作る。問題がなければ空文字 */
export function lpmValidationMessage(field) {
    const v = field.validity;
    const name = lpmFieldLabel(field);
    const type = field instanceof HTMLInputElement ? field.type : field.tagName.toLowerCase();
    if (v.valid)
        return '';
    if (v.valueMissing) {
        if (field.dataset.lpmMsgRequired)
            return field.dataset.lpmMsgRequired;
        if (type === 'checkbox')
            return `${name}にチェックを入れてください`;
        if (type === 'radio' || type === 'select')
            return `${name}を選んでください`;
        return `${name}を入力してください`;
    }
    if (v.typeMismatch) {
        if (type === 'email')
            return 'メールアドレスの形式で入力してください（例：name@example.com）';
        if (type === 'url')
            return 'URLの形式で入力してください（https:// から始まる形）';
        return `${name}の形式が正しくありません`;
    }
    if (v.patternMismatch)
        return field.dataset.lpmMsgPattern || `${name}の形式が正しくありません`;
    if (v.tooShort) {
        const f = field;
        return `${name}は${f.minLength}文字以上で入力してください（いま${f.value.length}文字）`;
    }
    if (v.tooLong) {
        const f = field;
        return `${name}は${f.maxLength}文字以内で入力してください（いま${f.value.length}文字）`;
    }
    if (v.rangeUnderflow)
        return `${field.min}以上の値を入力してください`;
    if (v.rangeOverflow)
        return `${field.max}以下の値を入力してください`;
    if (v.badInput)
        return '数字で入力してください';
    if (v.customError)
        return field.validationMessage;
    return `${name}を確認してください`;
}
export function lpmValidate(root = document) {
    root.querySelectorAll('form[data-lpm-validate]').forEach((form) => {
        if (form.dataset.lpmInit || lpmOff(form, 'validate'))
            return;
        form.dataset.lpmInit = '1';
        form.noValidate = true;
        const live = form.dataset.lpmValidate === 'live';
        const fields = Array.from(form.elements).filter((el) => (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) &&
            el.type !== 'hidden' && el.type !== 'submit' && el.type !== 'button' && el.willValidate);
        const errorBox = (field) => {
            const box = field.closest(LPM_FIELD_BOX) || field.parentElement;
            let err = box.querySelector('[data-lpm-err], .ui-field__err, .lpm-err');
            if (!err) {
                err = document.createElement('p');
                err.className = box.classList.contains('ui-field') ? 'ui-field__err' : 'lpm-err';
                err.hidden = true;
                box.appendChild(err);
            }
            if (!err.id)
                err.id = `lpm-err-${Math.random().toString(36).slice(2, 9)}`;
            const ids = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
            if (!ids.includes(err.id))
                field.setAttribute('aria-describedby', [...ids, err.id].join(' '));
            return err;
        };
        const check = (field) => {
            const target = field.dataset.lpmMatch ? form.querySelector(field.dataset.lpmMatch) : null;
            field.setCustomValidity(target && field.value && field.value !== target.value ? `${lpmFieldLabel(field)}が一致しません` : '');
            const message = lpmValidationMessage(field);
            const box = field.closest(LPM_FIELD_BOX);
            const err = errorBox(field);
            err.textContent = message;
            err.hidden = !message;
            box === null || box === void 0 ? void 0 : box.classList.toggle('is-error', Boolean(message));
            if (message)
                field.setAttribute('aria-invalid', 'true');
            else
                field.removeAttribute('aria-invalid');
            return !message;
        };
        const touched = new WeakSet();
        fields.forEach((field) => {
            if (!live)
                return;
            field.addEventListener('blur', () => {
                touched.add(field);
                check(field);
            });
            field.addEventListener('input', () => {
                if (touched.has(field))
                    check(field);
            });
            field.addEventListener('change', () => {
                if (touched.has(field) || field instanceof HTMLSelectElement || field.type === 'checkbox') {
                    touched.add(field);
                    check(field);
                }
            });
        });
        // 送信時の検査は capture で先に動かし、エラーがあれば他の送信処理（M-26 など）を止める
        form.addEventListener('submit', (e) => {
            const results = fields.map((f) => {
                touched.add(f);
                return check(f);
            });
            const firstBad = fields[results.indexOf(false)];
            if (firstBad) {
                e.preventDefault();
                e.stopImmediatePropagation();
                firstBad.focus();
            }
        }, true);
    });
}
/**
 * 文字数カウンター
 * 使い方:
 *   <textarea maxlength="400" data-lpm-charcount></textarea>         上限は maxlength から読む
 *   <textarea data-lpm-charcount="200"></textarea>                   入力は止めずに「目安」として数える
 *   欄の入れ物の最後に「12 / 400」の表示を作る（場所を決めたいときは data-lpm-charcount-target="#id"）
 *   読み上げは残り20・10・5文字になったときと、超えたときだけ（毎文字は読まない）
 */
export function lpmCharCount(root = document) {
    root.querySelectorAll('[data-lpm-charcount]').forEach((field) => {
        if (field.dataset.lpmInit || lpmOff(field, 'charcount'))
            return;
        field.dataset.lpmInit = '1';
        const limit = field.maxLength > 0 ? field.maxLength : Number(field.dataset.lpmCharcount) || 0;
        const targetSel = field.dataset.lpmCharcountTarget;
        let out = targetSel ? root.querySelector(targetSel) : null;
        if (!out) {
            // 入力欄の入れ物の最後に置く（入力欄と label の並びを崩さないため）
            const box = field.closest('[data-lpm-field], .ui-field, .lp-form__row, .lp-fi__field') || field.parentElement;
            out = document.createElement('p');
            if (box)
                box.appendChild(out);
            else
                field.insertAdjacentElement('afterend', out);
        }
        out.classList.add('lpm-charcount');
        if (!out.id)
            out.id = `lpm-cc-${Math.random().toString(36).slice(2, 9)}`;
        const ids = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (!ids.includes(out.id))
            field.setAttribute('aria-describedby', [...ids, out.id].join(' '));
        const visual = document.createElement('span');
        visual.setAttribute('aria-hidden', 'true');
        const status = document.createElement('span');
        status.className = 'lpm-sr';
        status.setAttribute('aria-live', 'polite');
        out.replaceChildren(visual, status);
        let lastState = '';
        const update = () => {
            const n = field.value.length;
            visual.textContent = limit ? `${n.toLocaleString('ja-JP')} / ${limit.toLocaleString('ja-JP')}` : `${n.toLocaleString('ja-JP')}文字`;
            const rest = limit - n;
            // 読み上げは「残り20・10・5文字」と「超えたとき」の節目だけにする（毎文字は読まない）
            const state = !limit ? '' : rest < 0 ? 'over' : rest <= 5 ? 'near5' : rest <= 10 ? 'near10' : rest <= 20 ? 'near20' : '';
            out.classList.toggle('is-near', state.startsWith('near'));
            out.classList.toggle('is-over', state === 'over');
            if (state !== lastState) {
                status.textContent = state === 'over' ? `${-rest}文字オーバーしています` : state ? `残り${rest}文字です` : '';
                lastState = state;
            }
        };
        field.addEventListener('input', update);
        update();
    });
}
/** 既定の送り方：fetch でフォームの内容を送り、JSON を受け取る */
export const lpmFetchSend = async (form) => {
    const res = await fetch(form.action, {
        method: (form.getAttribute('method') || 'post').toUpperCase(),
        body: new FormData(form),
        headers: { Accept: 'application/json' },
    });
    if (!res.ok)
        throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') || '';
    return type.includes('application/json') ? (await res.json()) : {};
};
export function lpmAsyncSubmit(root = document, options = {}) {
    const send = options.send || lpmFetchSend;
    root.querySelectorAll('form[data-lpm-async]').forEach((form) => {
        if (form.dataset.lpmAsyncInit || lpmOff(form, 'async'))
            return;
        form.dataset.lpmAsyncInit = '1';
        let errorBox = form.querySelector('[data-lpm-async-error]');
        if (!errorBox) {
            errorBox = document.createElement('p');
            errorBox.className = 'lpm-async-error';
            errorBox.setAttribute('data-lpm-async-error', '');
            errorBox.setAttribute('role', 'alert');
            errorBox.hidden = true;
            form.appendChild(errorBox);
        }
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (form.getAttribute('aria-busy') === 'true')
                return;
            if (!form.noValidate && !form.reportValidity())
                return;
            const buttons = Array.from(form.querySelectorAll('button[type="submit"], button:not([type])'));
            const labels = buttons.map((b) => b.textContent);
            form.setAttribute('aria-busy', 'true');
            buttons.forEach((b) => {
                b.disabled = true;
                b.textContent = b.dataset.lpmBusyText || '送信中…';
            });
            errorBox.hidden = true;
            try {
                const data = await send(form);
                const done = form.dataset.lpmAsync ? root.querySelector(form.dataset.lpmAsync) : null;
                if (done) {
                    done.querySelectorAll('[data-lpm-fill]').forEach((slot) => {
                        const value = data[slot.dataset.lpmFill || ''];
                        if (value !== undefined && value !== null)
                            slot.textContent = String(value);
                    });
                    form.hidden = true;
                    done.hidden = false;
                    const heading = done.querySelector('h1, h2, h3') || done;
                    heading.tabIndex = -1;
                    heading.focus();
                }
                // 手順表示は最後の段階（完了）を現在地にし、それより前をすべて完了済みにする
                const steps = form.dataset.lpmSteps ? root.querySelector(form.dataset.lpmSteps) : null;
                const items = steps ? Array.from(steps.children) : [];
                items.forEach((li, i) => {
                    if (i === items.length - 1) {
                        li.setAttribute('aria-current', 'step');
                    }
                    else {
                        li.removeAttribute('aria-current');
                        li.classList.add('is-done');
                    }
                });
                form.dispatchEvent(new CustomEvent('lpm:sent', { detail: data, bubbles: true }));
            }
            catch {
                errorBox.textContent =
                    form.dataset.lpmErrorText || '送信できませんでした。通信の状態を確かめて、もう一度お試しください。入力した内容は残っています。';
                errorBox.hidden = false;
            }
            finally {
                form.removeAttribute('aria-busy');
                buttons.forEach((b, i) => {
                    b.disabled = false;
                    b.textContent = labels[i];
                });
            }
        });
    });
}
/**
 * 既定のアダプター：zipcloud（https://zipcloud.ibsnet.co.jp/）
 *   GET /api/search?zipcode=1000001
 *   → { status: 200, message: null, results: [{ address1: 都道府県, address2: 市区町村, address3: 町域, … }] }
 *   見つからないときは results が null になる。利用条件は公式サイトで確認すること。
 *
 * 日本郵便の「郵便番号・デジタルアドレスAPI」に差し替える場合:
 *   1. ゆうIDで利用者登録し、ダッシュボードでクライアントIDとシークレットキーを発行する
 *   2. シークレットキーはブラウザに置かない。自分のサーバーに中継の窓口を作る
 *      （WordPress なら register_rest_route、EmDash なら API ルート）
 *      サーバー側で POST /api/v1/j/token（grant_type=client_credentials, client_id, secret_key）でトークンを取り、
 *      GET /api/v1/searchcode/{郵便番号}（Authorization: Bearer トークン）を呼ぶ
 *   3. 返ってくる pref_name / city_name / town_name を、下のように LpmAddress に詰め替えて返すアダプターを作る
 *      const lpmJapanPostViaServer: LpmZipLookup = async (zip) => {
 *        const res = await fetch(`/wp-json/site/v1/zip/${zip}`);
 *        if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *        const data = await res.json();
 *        return (data.addresses || []).map((a: any) => ({ pref: a.pref_name, city: a.city_name, town: a.town_name }));
 *      };
 *      lpmZip(document, { lookup: lpmJapanPostViaServer });
 */
export const lpmZipcloud = async (zip) => {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${encodeURIComponent(zip)}`);
    if (!res.ok)
        throw new Error(`HTTP ${res.status}`);
    const data = (await res.json());
    if (data.status !== 200)
        throw new Error(data.message || `status ${data.status}`);
    return (data.results || []).map((r) => ({ pref: r.address1, city: r.address2, town: r.address3 }));
};
/** 全角数字やハイフンを取り除き、半角7桁にそろえる */
export function lpmNormalizeZip(value) {
    return value
        .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
        .replace(/[^0-9]/g, '');
}
export function lpmZip(root = document, options = {}) {
    const lookup = options.lookup || lpmZipcloud;
    root.querySelectorAll('input[data-lpm-zip]').forEach((input) => {
        if (input.dataset.lpmInit || lpmOff(input, 'zip'))
            return;
        input.dataset.lpmInit = '1';
        const pick = (sel) => (sel ? root.querySelector(sel) : null);
        const pref = pick(input.dataset.lpmZipPref);
        const city = pick(input.dataset.lpmZipCity);
        const town = pick(input.dataset.lpmZipTown);
        const addr = pick(input.dataset.lpmZipAddr);
        const status = document.createElement('p');
        status.className = 'lpm-zip-status';
        status.setAttribute('aria-live', 'polite');
        const choices = document.createElement('ul');
        choices.className = 'lpm-zip-choices';
        choices.hidden = true;
        // 入力欄の入れ物の最後に置く（入力欄と label の並びを崩さないため）
        const box = input.closest('[data-lpm-field], .ui-field, .lp-form__row, .lp-fi__field') || input.parentElement;
        if (box)
            box.append(status, choices);
        else
            input.after(status, choices);
        const fill = (a) => {
            const setValue = (el, value) => {
                if (!el)
                    return;
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            };
            if (addr)
                setValue(addr, `${a.pref}${a.city}${a.town}`);
            setValue(pref, a.pref);
            setValue(city, a.city);
            setValue(town, a.town);
            choices.hidden = true;
            choices.replaceChildren();
            status.textContent = `住所を入れました：${a.pref}${a.city}${a.town}。番地以降を続けて入力してください。`;
        };
        let lastZip = '';
        let seq = 0;
        const search = async () => {
            const zip = lpmNormalizeZip(input.value);
            if (zip.length !== 7 || zip === lastZip)
                return;
            lastZip = zip;
            const mine = ++seq;
            status.textContent = '住所を探しています…';
            try {
                const list = await lookup(zip);
                if (mine !== seq)
                    return;
                if (!list.length) {
                    status.textContent = 'この郵便番号の住所が見つかりませんでした。住所を直接入力してください。';
                }
                else if (list.length === 1) {
                    fill(list[0]);
                }
                else {
                    status.textContent = `候補が${list.length}件あります。当てはまる住所を選んでください。`;
                    choices.replaceChildren(...list.map((a) => {
                        const li = document.createElement('li');
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.textContent = `${a.pref}${a.city}${a.town}`;
                        btn.addEventListener('click', () => fill(a));
                        li.appendChild(btn);
                        return li;
                    }));
                    choices.hidden = false;
                }
            }
            catch {
                if (mine !== seq)
                    return;
                lastZip = '';
                status.textContent = '住所を取得できませんでした。住所を直接入力してください。';
            }
        };
        input.addEventListener('input', () => {
            void search();
        });
    });
}
/**
 * ハンバーガーメニューの強化（Escで閉じる・aria-expanded・外側クリックで閉じる）
 * 使い方:
 *   NV-02 の <details class="lp-hd__menu"> は、何も書き換えずにそのまま強化される
 *   ほかの <details> は data-lpm-menu を付ける
 *   <button data-lpm-menu aria-controls="nav"> と <nav id="nav" hidden> の組み合わせにも対応
 *   メニュー内のリンクを押したときも閉じる（ページ内リンクで画面が移らない場合のため）
 */
export function lpmMenu(root = document) {
    const doc = document;
    root.querySelectorAll('details[data-lpm-menu], details.lp-hd__menu').forEach((menu) => {
        if (menu.dataset.lpmInit || lpmOff(menu, 'menu'))
            return;
        menu.dataset.lpmInit = '1';
        const summary = menu.querySelector(':scope > summary');
        if (!summary)
            return;
        const sync = () => summary.setAttribute('aria-expanded', String(menu.open));
        const close = (focus) => {
            if (!menu.open)
                return;
            menu.open = false;
            if (focus)
                summary.focus();
        };
        sync();
        menu.addEventListener('toggle', sync);
        menu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.open) {
                e.preventDefault();
                close(true);
            }
        });
        menu.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && menu.open && !link.closest('summary'))
                close(false);
        });
        doc.addEventListener('click', (e) => {
            if (menu.open && !e.composedPath().includes(menu))
                close(false);
        });
    });
    root.querySelectorAll('button[data-lpm-menu][aria-controls]').forEach((btn) => {
        if (btn.dataset.lpmInit || lpmOff(btn, 'menu'))
            return;
        btn.dataset.lpmInit = '1';
        const id = btn.getAttribute('aria-controls');
        const panel = id ? root.querySelector(`#${id}`) : null;
        if (!panel)
            return;
        const set = (open, focus = false) => {
            btn.setAttribute('aria-expanded', String(open));
            panel.hidden = !open;
            if (!open && focus)
                btn.focus();
        };
        set(btn.getAttribute('aria-expanded') === 'true');
        btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
        doc.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !panel.hidden)
                set(false, true);
        });
        doc.addEventListener('click', (e) => {
            const path = e.composedPath();
            if (!panel.hidden && !path.includes(panel) && !path.includes(btn))
                set(false);
        });
        panel.addEventListener('click', (e) => {
            if (e.target.closest('a'))
                set(false);
        });
    });
}
/**
 * スクロール方向で隠れるヘッダー
 * 使い方: <header data-lpm-autohide>…</header>
 *   下へスクロールすると .is-hidden が付いて上に隠れ、少しでも上へ戻すと現れる
 *   ページの先頭付近（ヘッダーの高さぶん）では常に表示
 *   中にフォーカスがあるとき、メニューが開いているときは隠さない
 *   ページ以外の箱をスクロールさせる場合は data-lpm-scroller="#id"
 */
export function lpmAutoHide(root = document) {
    root.querySelectorAll('[data-lpm-autohide]').forEach((header) => {
        if (header.dataset.lpmInit || lpmOff(header, 'autohide'))
            return;
        header.dataset.lpmInit = '1';
        const sel = header.dataset.lpmScroller;
        const box = sel ? root.querySelector(sel) : null;
        const getY = () => (box ? box.scrollTop : window.scrollY);
        const tolerance = Number(header.dataset.lpmAutohide) || 8;
        let lastY = getY();
        let ticking = false;
        const update = () => {
            ticking = false;
            const y = getY();
            const delta = y - lastY;
            if (Math.abs(delta) < tolerance)
                return;
            const busy = header.matches(':focus-within') || Boolean(header.querySelector('details[open], [aria-expanded="true"]'));
            const hide = delta > 0 && y > header.offsetHeight && !busy;
            header.classList.toggle('is-hidden', hide);
            lastY = y;
        };
        (box !== null && box !== void 0 ? box : window).addEventListener('scroll', () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(update);
        }, { passive: true });
        header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
    });
}
/**
 * 現在地メニューのハイライト（いま読んでいるセクションのリンクに印を付ける）
 * 使い方:
 *   <nav data-lpm-spy> <a href="#about">…</a> <a href="#works">…</a> </nav>
 *   ページ内リンク（#id）の先のセクションを見張り、画面の上から4割ほどの位置にあるものを「いまの場所」とする
 *   印は aria-current="true" と .is-current。見た目は CSS で決める
 *   ページ以外の箱をスクロールさせる場合は data-lpm-scroller="#id"
 */
export function lpmScrollSpy(root = document) {
    if (!('IntersectionObserver' in window))
        return;
    root.querySelectorAll('[data-lpm-spy]').forEach((nav) => {
        if (nav.dataset.lpmInit || lpmOff(nav, 'spy'))
            return;
        nav.dataset.lpmInit = '1';
        const sel = nav.dataset.lpmScroller;
        const box = sel ? root.querySelector(sel) : null;
        const pairs = Array.from(nav.querySelectorAll('a[href^="#"]'))
            .map((link) => {
            const id = decodeURIComponent(link.getAttribute('href').slice(1));
            const section = id ? root.querySelector(`#${CSS.escape(id)}`) : null;
            return section ? { link, section } : null;
        })
            .filter((p) => p !== null);
        if (!pairs.length)
            return;
        const setCurrent = (section) => {
            pairs.forEach(({ link, section: s }) => {
                const on = s === section;
                link.classList.toggle('is-current', on);
                if (on)
                    link.setAttribute('aria-current', 'true');
                else
                    link.removeAttribute('aria-current');
            });
        };
        const visible = new Set();
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting)
                    visible.add(entry.target);
                else
                    visible.delete(entry.target);
            });
            const first = pairs.find((p) => visible.has(p.section));
            if (first)
                setCurrent(first.section);
        }, { root: box, rootMargin: '-35% 0px -60% 0px' });
        pairs.forEach((p) => io.observe(p.section));
    });
}
/**
 * スクロール進捗バーの補完（CSSのスクロール連動に未対応のブラウザ向け）
 * 使い方: <div class="lpm-progress" data-lpm-progress aria-hidden="true"></div>
 *   対応ブラウザ（animation-timeline: scroll()）では CSS だけで動くので、この関数は何もしない
 *   未対応ブラウザでは、スクロール量を --lpm-progress（0〜1）に入れて同じ見た目にする
 *   ページ以外の箱の進み具合を出す場合は data-lpm-scroller="#id"
 */
export function lpmProgress(root = document) {
    const supported = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');
    root.querySelectorAll('[data-lpm-progress]').forEach((bar) => {
        if (bar.dataset.lpmInit || lpmOff(bar, 'progress'))
            return;
        bar.dataset.lpmInit = '1';
        if (supported)
            return;
        bar.classList.add('is-js');
        const sel = bar.dataset.lpmScroller;
        const box = sel ? root.querySelector(sel) : null;
        let ticking = false;
        const update = () => {
            ticking = false;
            const el = box !== null && box !== void 0 ? box : document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            const y = box ? box.scrollTop : window.scrollY;
            bar.style.setProperty('--lpm-progress', String(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0));
        };
        (box !== null && box !== void 0 ? box : window).addEventListener('scroll', () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(update);
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    });
}
/**
 * 1文字ずつ出る（文字を自動で分けて、画面に入ったときに再生する）
 * 使い方: <h2 data-lpm-chars>家族の10年後まで考えた家づくり。</h2>
 *   中の文字を1文字ずつ <span class="lpm-chars__c" style="--i:番号"> に分ける（<br> はそのまま残す）
 *   読み上げ用に元の文章を1つ残し、分けた文字は読み上げから外す
 *   画面に入ると .is-in が付いて再生する。data-lpm-chars="30" で1文字ごとの間隔（ミリ秒）を変えられる
 *   CSS だけで使う場合は、サーバー側（PHP など）で同じ形に分けて出力すれば、読み込み時に再生される
 */
export function lpmSplitChars(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(root.querySelectorAll('[data-lpm-chars]:not([data-lpm-ready])')).filter((el) => !lpmOff(el, 'chars'));
    if (!items.length)
        return;
    const Segmenter = Intl.Segmenter;
    const split = (text) => Segmenter ? Array.from(new Segmenter('ja', { granularity: 'grapheme' }).segment(text), (s) => s.segment) : Array.from(text);
    items.forEach((el) => {
        const step = Number(el.dataset.lpmChars) || 40;
        const fullText = (el.textContent || '').replace(/\s+/g, ' ').trim();
        const visual = document.createElement('span');
        visual.setAttribute('aria-hidden', 'true');
        let i = 0;
        Array.from(el.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                split(node.textContent || '').forEach((ch) => {
                    if (/\s/.test(ch)) {
                        visual.appendChild(document.createTextNode(ch));
                        return;
                    }
                    const c = document.createElement('span');
                    c.className = 'lpm-chars__c';
                    c.textContent = ch;
                    c.style.setProperty('--i', String(i++));
                    visual.appendChild(c);
                });
            }
            else {
                visual.appendChild(node.cloneNode(true));
            }
        });
        const sr = document.createElement('span');
        sr.className = 'lpm-sr';
        sr.textContent = fullText;
        el.replaceChildren(sr, visual);
        el.classList.add('lpm-chars');
        el.style.setProperty('--lpm-step', `${step}ms`);
        el.setAttribute('data-lpm-ready', '');
    });
    if (reduce || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.3 });
    items.forEach((el) => io.observe(el));
}
/**
 * 画像の読み込み後にふわっと表示する
 * 使い方:
 *   <div class="lpm-img"><img src="photo.jpg" alt="…" loading="lazy" width="800" height="533" data-lpm-fade></div>
 *   読み込み中は .lpm-img の背景（色や小さなぼかし画像）が見え、読み込みが終わると画像がフェードインする
 *   すでに読み込み済みの画像はそのまま表示（フェードしない）。読み込みに失敗したら .is-error を付ける
 *   JS が動かない環境では、ふつうの画像として表示される
 */
export function lpmImgFade(root = document) {
    root.querySelectorAll('img[data-lpm-fade]').forEach((img) => {
        if (img.dataset.lpmInit || lpmOff(img, 'imgfade'))
            return;
        img.dataset.lpmInit = '1';
        const box = img.closest('.lpm-img');
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add('is-loaded');
            return;
        }
        img.setAttribute('data-lpm-ready', '');
        img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        img.addEventListener('error', () => {
            box === null || box === void 0 ? void 0 : box.classList.add('is-error');
            img.classList.add('is-loaded');
        }, { once: true });
    });
}
const LPM_TOAST_ICON = {
    info: '<circle cx="8" cy="8" r="6.5"/><path d="M8 7.5v3.5M8 5h.01"/>',
    ok: '<circle cx="8" cy="8" r="6.5"/><path d="M5 8.3l2 2 4-4.3"/>',
    warn: '<path d="M8 2l6.5 11.5h-13z"/><path d="M8 6.5v3M8 11.5h.01"/>',
    error: '<circle cx="8" cy="8" r="6.5"/><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4"/>',
};
/** トーストを並べる場所と、読み上げ用の領域を用意する（すでにあれば再利用） */
function lpmToastRegion(root) {
    let region = root.querySelector('[data-lpm-toast-region]');
    if (!region) {
        region = document.createElement('div');
        region.className = 'ui-toasts';
        region.setAttribute('data-lpm-toast-region', '');
        const host = root instanceof Document ? root.body : root;
        host.appendChild(region);
    }
    // HTML に置いた入れ物を使う場合も、読み上げ用の領域を必ず用意する
    ['polite', 'assertive'].forEach((level) => {
        if (region.querySelector(`[data-lpm-toast-live="${level}"]`))
            return;
        const live = document.createElement('div');
        live.className = 'lpm-sr';
        live.setAttribute('aria-live', level);
        live.setAttribute('data-lpm-toast-live', level);
        region.prepend(live);
    });
    return region;
}
export function lpmToast(message, options = {}) {
    var _a, _b;
    const type = options.type || 'info';
    const time = (_a = options.time) !== null && _a !== void 0 ? _a : (type === 'error' ? 0 : 5000);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const region = lpmToastRegion(options.root || document);
    const toast = document.createElement('div');
    toast.className = `ui-toast ui-toast--${type}`;
    const icon = `<svg viewBox="0 0 16 16" aria-hidden="true">${LPM_TOAST_ICON[type]}</svg>`;
    toast.innerHTML = `${icon}<p class="ui-toast__msg"></p><button type="button" class="ui-toast__close" aria-label="通知を閉じる"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>`;
    toast.querySelector('.ui-toast__msg').textContent = message;
    const visible = region.querySelectorAll('.ui-toast:not(.is-leaving)');
    if (visible.length >= 3)
        (_b = visible[0].querySelector('.ui-toast__close')) === null || _b === void 0 ? void 0 : _b.click();
    region.appendChild(toast);
    // 読み上げ：入れ物を先に用意しておき、少し遅らせて文字を入れると確実に読まれる
    const live = region.querySelector(`[data-lpm-toast-live="${type === 'error' ? 'assertive' : 'polite'}"]`);
    live.textContent = '';
    window.setTimeout(() => {
        live.textContent = message;
    }, 100);
    let remain = time;
    let started = 0;
    let timer = 0;
    const close = () => {
        if (toast.classList.contains('is-leaving'))
            return;
        window.clearTimeout(timer);
        toast.classList.add('is-leaving');
        window.setTimeout(() => toast.remove(), reduce ? 0 : 220);
    };
    const run = () => {
        if (!remain)
            return;
        started = Date.now();
        timer = window.setTimeout(close, remain);
    };
    const pause = () => {
        if (!remain)
            return;
        window.clearTimeout(timer);
        remain = Math.max(800, remain - (Date.now() - started));
    };
    toast.querySelector('.ui-toast__close').addEventListener('click', close);
    toast.addEventListener('pointerenter', pause);
    toast.addEventListener('pointerleave', run);
    toast.addEventListener('focusin', pause);
    toast.addEventListener('focusout', run);
    run();
    return toast;
}
/** data-lpm-toast を付けたボタンを押したときにトーストを出す */
export function lpmToastTriggers(root = document) {
    root.querySelectorAll('[data-lpm-toast]').forEach((btn) => {
        if (btn.dataset.lpmInit || lpmOff(btn, 'toast'))
            return;
        btn.dataset.lpmInit = '1';
        lpmToastRegion(root);
        btn.addEventListener('click', () => {
            lpmToast(btn.dataset.lpmToast || '', {
                type: btn.dataset.lpmToastType || 'info',
                time: btn.dataset.lpmToastTime !== undefined ? Number(btn.dataset.lpmToastTime) : undefined,
                root,
            });
        });
    });
}
/**
 * クリックで開くポップオーバーの位置調整
 * 使い方:
 *   <button popovertarget="tip-price">料金について</button>
 *   <div id="tip-price" class="lpm-pop" popover>…</div>
 *   HTML 標準の popover 属性だけで、クリックで開き、外側のクリックや Esc で閉じる（JS なしでは画面の中央に出る）
 *   この関数を使うと、押したボタンのすぐ下に出し、下に入りきらなければ上に、左右は画面からはみ出さないようにずらす
 *   data-lpm-pop-align="end" でボタンの右端にそろえる
 */
export function lpmPopover(root = document) {
    root.querySelectorAll('[popover].lpm-pop').forEach((pop) => {
        if (pop.dataset.lpmInit || lpmOff(pop, 'popover'))
            return;
        pop.dataset.lpmInit = '1';
        pop.setAttribute('data-lpm-ready', '');
        const gap = 8;
        const margin = 8;
        let invoker = null;
        const place = () => {
            if (!invoker || !pop.matches(':popover-open'))
                return;
            const r = invoker.getBoundingClientRect();
            const pw = pop.offsetWidth;
            const ph = pop.offsetHeight;
            const vw = document.documentElement.clientWidth;
            const vh = window.innerHeight;
            const below = r.bottom + gap + ph <= vh - margin;
            const above = r.top - gap - ph >= margin;
            const top = below || !above ? r.bottom + gap : r.top - gap - ph;
            let left = pop.dataset.lpmPopAlign === 'end' ? r.right - pw : r.left;
            left = Math.min(Math.max(left, margin), vw - pw - margin);
            pop.style.top = `${Math.round(top)}px`;
            pop.style.left = `${Math.round(left)}px`;
            pop.style.setProperty('--lpm-arrow-x', `${Math.round(r.left + r.width / 2 - left)}px`);
            pop.classList.toggle('is-above', !(below || !above));
        };
        let ticking = false;
        const onMove = () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                place();
            });
        };
        const findInvoker = (e) => {
            const source = e.source;
            if (source instanceof HTMLElement)
                return source;
            const id = pop.id;
            return id ? root.querySelector(`[popovertarget="${CSS.escape(id)}"], [commandfor="${CSS.escape(id)}"]`) : null;
        };
        // 開く直前に押したボタンを覚え、表示された次の描画の前に位置を決める（ちらつかない）
        pop.addEventListener('beforetoggle', (e) => {
            if (e.newState !== 'open')
                return;
            invoker = findInvoker(e);
            requestAnimationFrame(place);
        });
        pop.addEventListener('toggle', (e) => {
            if (pop.matches(':popover-open')) {
                if (!invoker)
                    invoker = findInvoker(e);
                place();
                window.addEventListener('scroll', onMove, { passive: true, capture: true });
                window.addEventListener('resize', onMove);
            }
            else {
                window.removeEventListener('scroll', onMove, { capture: true });
                window.removeEventListener('resize', onMove);
                invoker = null;
            }
        });
    });
}
/**
 * JS なしで開くモーダルの補完（command 属性に未対応のブラウザ向け）
 * 使い方:
 *   <button command="show-modal" commandfor="movie">動画を見る</button>
 *   <dialog id="movie" class="lpm-modal">… <button command="close" commandfor="movie">閉じる</button></dialog>
 *   対応ブラウザ（Chrome・Edge 135、Firefox 144、Safari 26.2 以降）では HTML だけで開閉する
 *   未対応のブラウザでは、M-17（lpmModal）の仕組みに切り替えて同じように開閉する
 *   popover の show-popover / hide-popover / toggle-popover にも対応
 */
export function lpmCommand(root = document) {
    if ('commandForElement' in HTMLButtonElement.prototype)
        return;
    let usesModal = false;
    root.querySelectorAll('button[commandfor][command]').forEach((btn) => {
        // 印は lpmCmd（lpmInit は置き換え先の M-17 が使うため）
        if (btn.dataset.lpmCmd || lpmOff(btn, 'command'))
            return;
        btn.dataset.lpmCmd = '1';
        const id = btn.getAttribute('commandfor') || '';
        const command = btn.getAttribute('command') || '';
        const target = id ? root.querySelector(`#${CSS.escape(id)}`) : null;
        if (!target)
            return;
        if (target instanceof HTMLDialogElement) {
            if (command === 'show-modal') {
                btn.setAttribute('data-lpm-open', `#${id}`);
                usesModal = true;
            }
            else if (command === 'close' || command === 'request-close') {
                if (target.contains(btn))
                    btn.setAttribute('data-lpm-close', '');
                else
                    btn.addEventListener('click', () => target.close());
                usesModal = true;
            }
            return;
        }
        const pop = target;
        btn.addEventListener('click', () => {
            var _a, _b, _c;
            if (command === 'show-popover')
                (_a = pop.showPopover) === null || _a === void 0 ? void 0 : _a.call(pop);
            else if (command === 'hide-popover')
                (_b = pop.hidePopover) === null || _b === void 0 ? void 0 : _b.call(pop);
            else if (command === 'toggle-popover')
                (_c = pop.togglePopover) === null || _c === void 0 ? void 0 : _c.call(pop);
        });
    });
    if (usesModal)
        lpmModal(root);
}
/**
 * ドロップダウンメニューの強化（NV-03 の .lp-dd をそのまま強化）
 * 使い方:
 *   <li class="lp-dd"><button aria-controls="dd-1">家づくり</button><ul id="dd-1">…</ul></li>
 *   ほかの部品では .lp-dd の代わりに data-lpm-dropdown を付ける
 *   - クリックで開閉し、aria-expanded で状態を伝える
 *   - ↓ でメニューの最初へ、↑ で最後へ。メニュー内は ↑ ↓ Home End で移動、Esc で閉じてボタンへ戻る
 *   - マウス操作の端末では、乗せると開き、離れて少したつと閉じる
 *   - 外側をクリック、Tab でメニューの外へ出たときも閉じる。ほかのメニューを開くと前のものは閉じる
 *   JS なしでも、NV-03 は :hover と :focus-within で開く
 */
export function lpmDropdown(root = document) {
    const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const opened = [];
    root.querySelectorAll('.lp-dd, [data-lpm-dropdown]').forEach((box) => {
        if (box.dataset.lpmInit || lpmOff(box, 'dropdown'))
            return;
        const btn = box.querySelector(':scope > button[aria-controls]');
        const menuId = (btn === null || btn === void 0 ? void 0 : btn.getAttribute('aria-controls')) || '';
        const menu = menuId ? root.querySelector(`#${CSS.escape(menuId)}`) : null;
        if (!btn || !menu)
            return;
        box.dataset.lpmInit = '1';
        box.setAttribute('data-lpm-ready', '');
        const items = () => Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
        let byHover = false;
        let timer = 0;
        const set = (open, focus) => {
            var _a, _b;
            window.clearTimeout(timer);
            if (open)
                opened.forEach((close) => close !== set && close(false));
            btn.setAttribute('aria-expanded', String(open));
            if (!open)
                byHover = false;
            if (focus === 'first')
                (_a = items()[0]) === null || _a === void 0 ? void 0 : _a.focus();
            if (focus === 'last')
                (_b = items()[items().length - 1]) === null || _b === void 0 ? void 0 : _b.focus();
            if (focus === 'button')
                btn.focus();
        };
        opened.push(set);
        set(false);
        const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
        btn.addEventListener('click', () => {
            if (byHover && isOpen()) {
                byHover = false;
                return;
            }
            set(!isOpen());
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                set(true, 'first');
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                set(true, 'last');
            }
        });
        menu.addEventListener('keydown', (e) => {
            const list = items();
            const i = list.indexOf(e.target);
            const go = {
                ArrowDown: (i + 1) % list.length,
                ArrowUp: (i - 1 + list.length) % list.length,
                Home: 0,
                End: list.length - 1,
            };
            if (e.key in go) {
                e.preventDefault();
                list[go[e.key]].focus();
            }
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen()) {
                e.preventDefault();
                set(false, 'button');
            }
        });
        box.addEventListener('focusout', (e) => {
            const next = e.relatedTarget;
            if (isOpen() && (!next || !box.contains(next)))
                set(false);
        });
        document.addEventListener('click', (e) => {
            if (isOpen() && !e.composedPath().includes(box))
                set(false);
        });
        if (hoverable) {
            box.addEventListener('pointerenter', (e) => {
                if (e.pointerType !== 'mouse')
                    return;
                window.clearTimeout(timer);
                if (!isOpen()) {
                    byHover = true;
                    set(true);
                }
            });
            box.addEventListener('pointerleave', (e) => {
                if (e.pointerType !== 'mouse')
                    return;
                timer = window.setTimeout(() => {
                    if (!box.matches(':focus-within'))
                        set(false);
                }, 250);
            });
        }
    });
}
/**
 * 自動再生・矢印・ドット付きのスライダー
 * 使い方（お客様の声、スマホのカード送り）:
 *   <section class="lpm-slider" data-lpm-slider="6000" aria-roledescription="カルーセル" aria-label="お客様の声">
 *     <ul class="lpm-slider__track"><li class="lpm-slider__slide">…</li>…</ul>
 *     <div class="lpm-slider__controls">
 *       <button class="lpm-slider__play" type="button">一時停止</button>
 *       <button class="lpm-slider__prev" type="button" aria-label="前へ">…</button>
 *       <div class="lpm-slider__dots"></div>
 *       <button class="lpm-slider__next" type="button" aria-label="次へ">…</button>
 *     </div>
 *   </section>
 *   - data-lpm-slider の数字は自動で送る間隔（ミリ秒）。空なら自動再生しない
 *   - 1画面に何枚見せるかは CSS の --lpm-per（1 や 1.2）
 *   - 自動再生は「動きを減らす」設定・一時停止ボタン・マウスを乗せている間・中にフォーカスがある間・画面外では止まる
 *   - JS なしでも、横スワイプ（scroll-snap）で読める。ボタンとドットは JS があるときだけ表示
 */
export function lpmSlider(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-lpm-slider]').forEach((box) => {
        var _a, _b;
        if (box.dataset.lpmInit || lpmOff(box, 'slider'))
            return;
        const track = box.querySelector('.lpm-slider__track');
        if (!track)
            return;
        const slides = Array.from(track.children);
        if (slides.length < 2)
            return;
        box.dataset.lpmInit = '1';
        box.setAttribute('data-lpm-ready', '');
        const n = slides.length;
        slides.forEach((s, i) => {
            s.setAttribute('role', 'group');
            s.setAttribute('aria-roledescription', 'スライド');
            s.setAttribute('aria-label', `${i + 1} / ${n}`);
        });
        const dotsBox = box.querySelector('.lpm-slider__dots');
        const dots = slides.map((_, i) => {
            const d = document.createElement('button');
            d.type = 'button';
            d.className = 'lpm-slider__dot';
            d.setAttribute('aria-label', `${i + 1}枚目を表示`);
            d.addEventListener('click', () => go(i, true));
            dotsBox === null || dotsBox === void 0 ? void 0 : dotsBox.appendChild(d);
            return d;
        });
        const maxScroll = () => track.scrollWidth - track.clientWidth;
        const posOf = (i) => Math.min(slides[i].offsetLeft - slides[0].offsetLeft, maxScroll());
        let current = 0;
        const lastReachable = () => {
            const max = maxScroll();
            const idx = slides.findIndex((_, i) => posOf(i) >= max - 2);
            return idx < 0 ? n - 1 : idx;
        };
        const update = () => {
            const x = track.scrollLeft;
            let best = 0;
            slides.forEach((_, i) => {
                if (Math.abs(posOf(i) - x) < Math.abs(posOf(best) - x))
                    best = i;
            });
            current = best;
            dots.forEach((d, i) => {
                if (i === current)
                    d.setAttribute('aria-current', 'true');
                else
                    d.removeAttribute('aria-current');
            });
        };
        const go = (i, user = false) => {
            const last = lastReachable();
            const target = i > last ? 0 : i < 0 ? last : i;
            track.scrollTo({ left: posOf(target), behavior: reduce ? 'auto' : 'smooth' });
            current = target;
            if (user)
                restart();
        };
        (_a = box.querySelector('.lpm-slider__prev')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => go(current - 1, true));
        (_b = box.querySelector('.lpm-slider__next')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => go(current + 1, true));
        let ticking = false;
        track.addEventListener('scroll', () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                update();
            });
        }, { passive: true });
        update();
        // 自動再生
        const interval = Number(box.dataset.lpmSlider) || 0;
        const playBtn = box.querySelector('.lpm-slider__play');
        let playing = interval > 0 && !reduce;
        let holds = 0; // マウス・フォーカス・画面外などの一時停止の数
        let timer = 0;
        const live = () => track.setAttribute('aria-live', playing && !holds ? 'off' : 'polite');
        const restart = () => {
            window.clearInterval(timer);
            if (playing && !holds)
                timer = window.setInterval(() => go(current + 1), interval);
            live();
        };
        const syncButton = () => {
            if (!playBtn)
                return;
            playBtn.hidden = !(interval > 0) || reduce;
            playBtn.textContent = playing ? '一時停止' : '再生';
            playBtn.setAttribute('aria-label', playing ? '自動再生を一時停止' : '自動再生を再開');
            box.classList.toggle('is-playing', playing);
        };
        playBtn === null || playBtn === void 0 ? void 0 : playBtn.addEventListener('click', () => {
            playing = !playing;
            syncButton();
            restart();
        });
        const hold = (on) => {
            holds = Math.max(0, holds + (on ? 1 : -1));
            restart();
        };
        box.addEventListener('pointerenter', () => hold(true));
        box.addEventListener('pointerleave', () => hold(false));
        box.addEventListener('focusin', (e) => {
            if (!(e.relatedTarget && box.contains(e.relatedTarget)))
                hold(true);
        });
        box.addEventListener('focusout', (e) => {
            if (!(e.relatedTarget && box.contains(e.relatedTarget)))
                hold(false);
        });
        if ('IntersectionObserver' in window) {
            let hidden = false;
            new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting !== hidden) {
                    hidden = !entry.isIntersecting;
                    hold(hidden);
                }
            }).observe(box);
        }
        document.addEventListener('visibilitychange', () => hold(document.hidden));
        syncButton();
        restart();
    });
}
/**
 * パララックスの補完（CSS のスクロール連動に未対応のブラウザ向け）
 * 使い方:
 *   <div class="lpm-parallax-frame"><img class="lpm-parallax" data-lpm-parallax src="…" alt="" style="--lpm-shift:40px"></div>
 *   対応ブラウザ（animation-timeline: view()）では CSS だけで動くので、この関数は何もしない
 *   未対応ブラウザでは、画面内の位置から --lpm-y を計算して同じ動きにする
 *   「動きを減らす」設定では動かさない。ページ以外の箱の中で使う場合は data-lpm-scroller="#id"
 */
export function lpmParallax(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supported = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
    const items = Array.from(root.querySelectorAll('[data-lpm-parallax]')).filter((el) => !el.dataset.lpmInit && !lpmOff(el, 'parallax'));
    items.forEach((el) => (el.dataset.lpmInit = '1'));
    if (supported || reduce || !items.length)
        return;
    items.forEach((el) => el.classList.add('is-js'));
    const scrollerOf = (el) => {
        const sel = el.dataset.lpmScroller;
        return sel ? root.querySelector(sel) : null;
    };
    const update = () => {
        items.forEach((el) => {
            const box = scrollerOf(el);
            const top0 = box ? box.getBoundingClientRect().top : 0;
            const vh = box ? box.clientHeight : window.innerHeight;
            const frame = el.parentElement || el;
            const r = frame.getBoundingClientRect();
            const p = Math.min(1, Math.max(0, (vh - (r.top - top0)) / (vh + r.height)));
            el.style.setProperty('--lpm-y', String(p * 2 - 1));
        });
    };
    let ticking = false;
    const onScroll = () => {
        if (ticking)
            return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            update();
        });
    };
    const scrollers = new Set([window]);
    items.forEach((el) => {
        const box = scrollerOf(el);
        if (box)
            scrollers.add(box);
    });
    scrollers.forEach((s) => s.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('resize', onScroll);
    update();
}
/**
 * 固定したまま中身が切り替わる演出（GSAP ScrollTrigger の代わり）
 * 使い方:
 *   <section class="lpm-scene" data-lpm-scene>
 *     <div class="lpm-scene__stage" aria-hidden="true">
 *       <div class="lpm-scene__panel">…図1…</div><div class="lpm-scene__panel">…図2…</div>
 *     </div>
 *     <div class="lpm-scene__steps">
 *       <div class="lpm-scene__step">…説明1…</div><div class="lpm-scene__step">…説明2…</div>
 *     </div>
 *   </section>
 *   左（スマホでは上）の図が sticky で止まったまま、右の説明が画面の中央に来るたびに図が切り替わる
 *   対応ブラウザでは CSS（名前付きのビュー・タイムライン）だけで切り替わる
 *   この関数は、どのブラウザでも同じように切り替わるよう、いま中央にある説明に合わせて .is-active を付ける
 *   ページ以外の箱の中で使う場合は data-lpm-scroller="#id"
 */
export function lpmScene(root = document) {
    if (!('IntersectionObserver' in window))
        return;
    root.querySelectorAll('[data-lpm-scene]').forEach((scene) => {
        if (scene.dataset.lpmInit || lpmOff(scene, 'scene'))
            return;
        scene.dataset.lpmInit = '1';
        const steps = Array.from(scene.querySelectorAll('.lpm-scene__step'));
        const panels = Array.from(scene.querySelectorAll('.lpm-scene__panel'));
        if (!steps.length)
            return;
        const sel = scene.dataset.lpmScroller;
        const box = sel ? root.querySelector(sel) : null;
        scene.setAttribute('data-lpm-ready', '');
        const activate = (i) => {
            steps.forEach((s, j) => s.classList.toggle('is-active', i === j));
            panels.forEach((p, j) => p.classList.toggle('is-active', i === j));
            scene.style.setProperty('--lpm-scene-index', String(i));
        };
        activate(0);
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting)
                    activate(steps.indexOf(entry.target));
            });
        }, { root: box, rootMargin: '-45% 0px -45% 0px' });
        steps.forEach((s) => io.observe(s));
    });
}
/**
 * 背景動画の一時停止ボタン（HR-05）
 * 使い方:
 *   <section data-lpm-video> <video autoplay muted loop playsinline>…</video>
 *     <button type="button" data-lpm-video-toggle aria-label="背景の動画を一時停止">…</button> </section>
 *   - ボタンで再生と一時停止を切り替え、ボタンの名前も「一時停止」「再生」と入れ替える
 *   - 「動きを減らす」設定では最初から止め、ポスター画像を見せる
 *   - 画面の外に出たら止め、戻ったら再開する（自分で止めた場合は再開しない）
 */
export function lpmVideo(root = document) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-lpm-video]').forEach((box) => {
        if (box.dataset.lpmInit || lpmOff(box, 'video'))
            return;
        const video = box.querySelector('video');
        if (!video)
            return;
        box.dataset.lpmInit = '1';
        box.setAttribute('data-lpm-ready', '');
        const btn = box.querySelector('[data-lpm-video-toggle]');
        let userPaused = reduce;
        const sync = () => {
            const paused = video.paused;
            box.classList.toggle('is-paused', paused);
            if (btn)
                btn.setAttribute('aria-label', paused ? '背景の動画を再生' : '背景の動画を一時停止');
        };
        const play = () => {
            // 低電力モードなどで再生できないときは、止まった状態の表示に合わせる
            const result = video.play();
            if (result && typeof result.catch === 'function')
                result.catch(() => sync());
        };
        if (reduce) {
            video.removeAttribute('autoplay');
            video.pause();
        }
        video.addEventListener('play', sync);
        video.addEventListener('pause', sync);
        btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', () => {
            if (video.paused) {
                userPaused = false;
                play();
            }
            else {
                userPaused = true;
                video.pause();
            }
        });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting)
                    video.pause();
                else if (!userPaused)
                    play();
            }).observe(box);
        }
        sync();
    });
}
/**
 * 読み込みが終わったら消えるローディング画面
 * 使い方:
 *   <div class="lpm-loader" data-lpm-loader data-lpm-loader-min="400">
 *     <span class="lpm-spinner lpm-spinner--l" role="status"><span class="lpm-sr">読み込み中</span></span>
 *   </div>
 *   - ページの画像などがすべて読み終わる（load）と消える。すでに読み終わっていれば、最低表示時間のあとに消える
 *   - data-lpm-loader-min で最低表示時間（ミリ秒）。ちらつきを防ぐための値で、長くしすぎない
 *   - JS が動かなくても、CSS の安全装置で4秒後に必ず消える
 */
export function lpmLoader(root = document) {
    root.querySelectorAll('[data-lpm-loader]').forEach((loader) => {
        if (loader.dataset.lpmInit || lpmOff(loader, 'loader'))
            return;
        loader.dataset.lpmInit = '1';
        const min = Number(loader.dataset.lpmLoaderMin) || 0;
        const start = performance.now();
        const hide = () => {
            const wait = Math.max(0, min - (performance.now() - start));
            window.setTimeout(() => {
                loader.classList.add('is-done');
                loader.setAttribute('aria-hidden', 'true');
                loader.dispatchEvent(new CustomEvent('lpm:loaded', { bubbles: true }));
            }, wait);
        };
        if (document.readyState === 'complete')
            hide();
        else
            window.addEventListener('load', hide, { once: true });
    });
}
/**
 * ページ内の表示の切り替えに View Transitions を使う
 * 使い方:
 *   lpmViewTransition(() => { 表示を切り替える処理 });   ※WordPress 版では LpMotion.viewTransition(…)
 *   - 対応ブラウザでは、切り替えの前後がなめらかにつながる（Chrome・Edge 111、Safari 18 以降）
 *   - 未対応ブラウザと「動きを減らす」設定では、ふつうに切り替えるだけ
 *   ページをまたぐ遷移（別のページへのリンク）は CSS の @view-transition だけで動く（lp-motion.css の M-53 を参照）
 */
export function lpmViewTransition(update) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document;
    if (reduce || typeof doc.startViewTransition !== 'function') {
        update();
        return Promise.resolve();
    }
    return doc.startViewTransition(update).finished.catch(() => undefined);
}
/**
 * ダークモードの切り替え（選んだものを保存する）
 * 使い方:
 *   <fieldset class="lpm-theme-switch" data-lpm-theme>
 *     <legend class="lpm-sr">画面の色</legend>
 *     <label><input type="radio" name="theme" value="system" checked><span>OSに合わせる</span></label>
 *     <label><input type="radio" name="theme" value="light"><span>ライト</span></label>
 *     <label><input type="radio" name="theme" value="dark"><span>ダーク</span></label>
 *   </fieldset>
 *   - 選んだ値を <html class="lpm-theme" data-theme="light|dark"> に入れる（「OSに合わせる」は属性を外す）
 *   - JS が動かない環境では切り替えを隠し、OS の設定（prefers-color-scheme）に合わせる
 *   - 選んだ値はブラウザに保存し、次に開いたときも同じにする
 *   - 色は --lp-* 変数で切り替わる。カタログの Basic トーンのパーツは、そのままダークになる
 *   - ページを開いた瞬間の色のちらつきを防ぐため、<head> に短いスクリプトを入れる（HTML タブ参照）
 *   - data-lpm-theme-target="#id" で <html> 以外に、data-lpm-theme-key で保存名を変えられる
 */
export function lpmTheme(root = document) {
    root.querySelectorAll('[data-lpm-theme]').forEach((box) => {
        if (box.dataset.lpmInit || lpmOff(box, 'theme'))
            return;
        box.dataset.lpmInit = '1';
        box.setAttribute('data-lpm-ready', '');
        const key = box.dataset.lpmThemeKey || 'lpm-theme';
        const targetSel = box.dataset.lpmThemeTarget;
        const target = (targetSel ? root.querySelector(targetSel) : null) || document.documentElement;
        const radios = Array.from(box.querySelectorAll('input[type="radio"]'));
        const apply = (value) => {
            if (value === 'light' || value === 'dark')
                target.setAttribute('data-theme', value);
            else
                target.removeAttribute('data-theme');
            target.dispatchEvent(new CustomEvent('lpm:theme', { detail: value, bubbles: true }));
        };
        let saved = 'system';
        try {
            saved = window.localStorage.getItem(key) || 'system';
        }
        catch {
            saved = 'system';
        }
        radios.forEach((r) => {
            r.checked = r.value === saved;
            r.addEventListener('change', () => {
                if (!r.checked)
                    return;
                apply(r.value);
                try {
                    if (r.value === 'system')
                        window.localStorage.removeItem(key);
                    else
                        window.localStorage.setItem(key, r.value);
                }
                catch {
                    /* 保存できない環境では、今回だけ切り替える */
                }
            });
        });
        apply(saved);
    });
}
/**
 * クリップボードにコピーするボタン
 * 使い方:
 *   <button type="button" data-lpm-copy="#coupon">コピー</button>   指定した要素の文字（入力欄なら値）をコピー
 *   <button type="button" data-lpm-copy data-lpm-copy-text="SPRING2026">コピー</button>   書いた文字をコピー
 *   - 成功するとボタンの表示が2秒間「コピーしました」に変わり、読み上げでも伝える
 *   - コピーが許可されない環境では、文字を選択した状態にして ⌘C / Ctrl+C を案内する
 *   - data-lpm-copied で成功時の表示を変えられる
 */
export function lpmCopy(root = document) {
    root.querySelectorAll('[data-lpm-copy]').forEach((btn) => {
        if (btn.dataset.lpmInit || lpmOff(btn, 'copy'))
            return;
        btn.dataset.lpmInit = '1';
        const label = btn.innerHTML;
        const status = document.createElement('span');
        status.className = 'lpm-sr';
        status.setAttribute('aria-live', 'polite');
        btn.after(status);
        let timer = 0;
        const source = () => {
            const sel = btn.dataset.lpmCopy;
            return sel && sel !== '' ? root.querySelector(sel) : null;
        };
        const textOf = () => {
            if (btn.dataset.lpmCopyText !== undefined)
                return btn.dataset.lpmCopyText;
            const el = source();
            if (!el)
                return '';
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)
                return el.value;
            return (el.textContent || '').trim();
        };
        const done = (message, ok) => {
            window.clearTimeout(timer);
            btn.classList.toggle('is-copied', ok);
            btn.textContent = ok ? btn.dataset.lpmCopied || 'コピーしました' : btn.textContent;
            status.textContent = message;
            timer = window.setTimeout(() => {
                btn.innerHTML = label;
                btn.classList.remove('is-copied');
                status.textContent = '';
            }, 2000);
        };
        const selectSource = () => {
            const el = source();
            if (!el)
                return;
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                el.focus();
                el.select();
                return;
            }
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
            sel === null || sel === void 0 ? void 0 : sel.addRange(range);
        };
        btn.addEventListener('click', () => {
            const text = textOf();
            if (!text)
                return;
            const fail = () => {
                selectSource();
                done('コピーできなかったため、文字を選択しました。⌘C または Ctrl+C でコピーしてください。', false);
            };
            try {
                if (!navigator.clipboard)
                    throw new Error('no clipboard');
                navigator.clipboard.writeText(text).then(() => done(`「${text}」をコピーしました`, true), fail);
            }
            catch {
                fail();
            }
        });
    });
}
/**
 * パスワードの表示・非表示の切り替え
 * 使い方:
 *   UI-08（ログイン画面）のパスワード欄は、何も書き換えずにそのまま強化される
 *   ほかの欄は <input type="password" data-lpm-password> のように付ける（入れ物に付けてもよい）
 *   - 欄の右端に目のボタンを置き、押すと文字を表示／非表示に切り替える（aria-pressed で状態を伝える）
 *   - 送信するときは必ず非表示に戻す（ブラウザに平文で記憶させないため）
 *   - FM-03 のように入力欄のすぐ後ろに label がある場合は、並びを崩さずに一緒に包む
 */
export function lpmPassword(root = document) {
    const sel = 'input[type="password"][data-lpm-password], [data-lpm-password] input[type="password"], .ui-login__field input[type="password"]';
    root.querySelectorAll(sel).forEach((input) => {
        var _a;
        if (input.dataset.lpmInit || lpmOff(input, 'password'))
            return;
        input.dataset.lpmInit = '1';
        if (!input.id)
            input.id = `lpm-pw-${Math.random().toString(36).slice(2, 9)}`;
        const wrap = document.createElement('span');
        wrap.className = 'lpm-pass';
        const next = input.nextElementSibling;
        const label = next instanceof HTMLLabelElement && next.htmlFor === input.id ? next : null;
        input.before(wrap);
        wrap.appendChild(input);
        if (label)
            wrap.appendChild(label);
        input.classList.add('lpm-pass__input');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lpm-pass__btn';
        btn.setAttribute('aria-controls', input.id);
        btn.innerHTML =
            '<svg class="lpm-pass__show" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>' +
                '<svg class="lpm-pass__hide" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
        wrap.appendChild(btn);
        const set = (show) => {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            input.type = show ? 'text' : 'password';
            btn.setAttribute('aria-pressed', String(show));
            btn.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示');
            wrap.classList.toggle('is-shown', show);
            if (start !== null && end !== null && document.activeElement === input)
                input.setSelectionRange(start, end);
        };
        set(false);
        btn.addEventListener('click', () => set(input.type === 'password'));
        (_a = input.form) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', () => set(false), true);
    });
}
/** ページ内のすべての動きを有効にする */
export function initLpMotion(root = document) {
    lpmReveal(root);
    lpmCount(root);
    lpmHeader(root);
    lpmToTop(root);
    lpmRipple(root);
    lpmMagnet(root);
    lpmTilt(root);
    lpmModal(root);
    lpmTabs(root);
    lpmCompare(root);
    lpmDismiss(root);
    lpmValidate(root);
    lpmCharCount(root);
    lpmAsyncSubmit(root);
    lpmZip(root);
    lpmMenu(root);
    lpmAutoHide(root);
    lpmScrollSpy(root);
    lpmProgress(root);
    lpmSplitChars(root);
    lpmImgFade(root);
    lpmToastTriggers(root);
    lpmPopover(root);
    lpmCommand(root);
    lpmDropdown(root);
    lpmSlider(root);
    lpmParallax(root);
    lpmScene(root);
    lpmVideo(root);
    lpmLoader(root);
    lpmTheme(root);
    lpmCopy(root);
    lpmPassword(root);
}
