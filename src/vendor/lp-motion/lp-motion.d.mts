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
export declare function lpmOff(el: Element, name: string): boolean;
/**
 * スクロールで要素を表示する
 * 使い方: <div data-lpm-reveal="up">…</div>
 *   種類: up（既定）/ fade / left / right / zoom
 *   data-lpm-delay="200"   表示を遅らせる（ミリ秒）
 *   data-lpm-repeat        画面から外れたら隠し、入るたびに再生する
 *   親に data-lpm-stagger="80" を付けると、子要素が順番に表示される
 */
export declare function lpmReveal(root?: ParentNode): void;
/**
 * 数字のカウントアップ
 * 使い方: <span data-lpm-count>1,200</span>
 *   表示中の数字（桁区切り・小数も可）を目標値として 0 から数え上げる
 *   data-lpm-count="1200" と書けば、その値を目標にする
 *   data-lpm-duration="1600" で長さを変えられる（ミリ秒）
 */
export declare function lpmCount(root?: ParentNode): void;
/**
 * スクロールしたらヘッダーを縮める・影を付ける
 * 使い方: <header data-lpm-header>…</header>
 *   スクロールすると .is-scrolled が付く（見た目は CSS で決める）
 *   data-lpm-header="80" と書くと、80px スクロールしてから切り替わる
 */
export declare function lpmHeader(root?: ParentNode): void;
/**
 * ページトップへ戻るボタン
 * 使い方: <a class="lpm-totop" href="#top" data-lpm-totop>…</a>
 *   一定量スクロールすると .is-shown が付いて現れる
 *   data-lpm-totop="400" で表示し始める位置を変えられる（px）
 *   ページ以外の箱をスクロールさせる場合は data-lpm-scroller="#id"
 */
export declare function lpmToTop(root?: ParentNode): void;
/**
 * クリックした位置から波紋を広げる
 * 使い方: <button data-lpm-ripple>…</button>
 *   波紋の色は文字色（currentColor）を薄くしたもの
 */
export declare function lpmRipple(root?: ParentNode): void;
/**
 * カーソルに吸い寄せられるボタン
 * 使い方: <a data-lpm-magnet>…</a>
 *   data-lpm-magnet="0.35" で吸い寄せの強さを変えられる（0〜1）
 *   マウス操作の端末だけで動き、タッチ端末と「動きを減らす」設定では何もしない
 */
export declare function lpmMagnet(root?: ParentNode): void;
/**
 * カーソルの位置に合わせてカードを立体的に傾ける
 * 使い方: <div data-lpm-tilt>…</div>
 *   data-lpm-tilt="8" で最大の傾き（度）を変えられる
 *   光の反射は CSS の ::after で描く
 */
export declare function lpmTilt(root?: ParentNode): void;
/**
 * モーダル（<dialog> を開閉アニメ付きで開く）
 * 使い方:
 *   <button data-lpm-open="#movie">動画を見る</button>
 *   <dialog id="movie" class="lpm-modal">… <button data-lpm-close>閉じる</button></dialog>
 *   背景のクリックと Esc キーでも閉じる。開いている間はページのスクロールを止める
 */
export declare function lpmModal(root?: ParentNode): void;
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
export declare function lpmTabs(root?: ParentNode): void;
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
export declare function lpmCompare(root?: ParentNode): void;
/**
 * お知らせを閉じる（閉じたことを覚えて、次回から表示しない）
 * 使い方:
 *   <div data-lpm-dismissible>
 *     …お知らせ…
 *     <button data-lpm-dismiss="newyear-2026" aria-label="閉じる">×</button>
 *   </div>
 *   data-lpm-dismiss の値ごとに記憶する。内容を変えたら値も変えると、また表示される
 */
export declare function lpmDismiss(root?: ParentNode): void;
/**
 * 入力チェックの強化（エラー文の日本語化・リアルタイム表示）
 * 使い方:
 *   <form data-lpm-validate>          送信したときに日本語のエラーを各欄の下に出す
 *   <form data-lpm-validate="live">   さらに、欄を離れたあとは入力のたびに表示を更新する
 *   欄の入れ物（.ui-field / .lp-form__row / .lp-fi__field / data-lpm-field）に .is-error を付け、
 *   入力欄には aria-invalid と aria-describedby（エラー文）を付ける。
 *   独自の文言: data-lpm-msg-required / data-lpm-msg-pattern / data-lpm-label（項目名）
 *   確認入力: data-lpm-match="#email"（指定した欄と同じ値かを確かめる）
 */
type LpmField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
/** 入力の状態から日本語のエラー文を作る。問題がなければ空文字 */
export declare function lpmValidationMessage(field: LpmField): string;
export declare function lpmValidate(root?: ParentNode): void;
/**
 * 文字数カウンター
 * 使い方:
 *   <textarea maxlength="400" data-lpm-charcount></textarea>         上限は maxlength から読む
 *   <textarea data-lpm-charcount="200"></textarea>                   入力は止めずに「目安」として数える
 *   欄の入れ物の最後に「12 / 400」の表示を作る（場所を決めたいときは data-lpm-charcount-target="#id"）
 *   読み上げは残り20・10・5文字になったときと、超えたときだけ（毎文字は読まない）
 */
export declare function lpmCharCount(root?: ParentNode): void;
/**
 * 非同期送信と完了表示（ページを移動せずに送信し、完了画面に切り替える）
 * 使い方:
 *   <form action="/wp-json/site/v1/contact" method="post" data-lpm-async="#done" data-lpm-steps="#steps">…</form>
 *   <div id="done" hidden>… 受付番号 <b data-lpm-fill="receiptNo"></b> …</div>
 *   - data-lpm-async  … 成功したら表示する要素。フォームは隠す
 *   - data-lpm-steps  … FM-02 の手順表示（ol）。成功したら最後の段階（完了）を現在地にする
 *   - data-lpm-fill="キー" … 返ってきた JSON の値を差し込む
 *   送信先は JSON を返すサーバーの窓口を想定。送り方を変えたいときは lpmAsyncSubmit(root, { send }) で差し替える
 *   M-23（data-lpm-validate）と一緒に使うと、入力エラーがあるときは送信しない
 */
export type LpmSend = (form: HTMLFormElement) => Promise<Record<string, unknown>>;
/** 既定の送り方：fetch でフォームの内容を送り、JSON を受け取る */
export declare const lpmFetchSend: LpmSend;
export declare function lpmAsyncSubmit(root?: ParentNode, options?: {
    send?: LpmSend;
}): void;
/**
 * 郵便番号から住所を入れる
 * 使い方:
 *   <input data-lpm-zip data-lpm-zip-pref="#pref" data-lpm-zip-city="#city" data-lpm-zip-town="#town" inputmode="numeric" autocomplete="postal-code">
 *   - 7桁（全角・ハイフン入りも可）がそろった時点で検索する
 *   - 都道府県が <select> なら、同じ名前の選択肢を選ぶ
 *   - 都道府県と市区町村を1つの欄にまとめる場合は data-lpm-zip-addr="#addr"
 *   - 候補が複数あるときは選べる一覧を出し、見つからないときはその旨を伝える（読み上げにも届く）
 *
 * 住所の取得は「アダプター」（LpmZipLookup 型の関数）に切り出してあり、差し替えられる:
 *   lpmZip(root, { lookup: 自作の関数 })
 */
export interface LpmAddress {
    pref: string;
    city: string;
    town: string;
}
/** 7桁の郵便番号（数字のみ）を受け取り、住所の候補を返す関数 */
export type LpmZipLookup = (zip: string) => Promise<LpmAddress[]>;
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
export declare const lpmZipcloud: LpmZipLookup;
/** 全角数字やハイフンを取り除き、半角7桁にそろえる */
export declare function lpmNormalizeZip(value: string): string;
export declare function lpmZip(root?: ParentNode, options?: {
    lookup?: LpmZipLookup;
}): void;
/**
 * ハンバーガーメニューの強化（Escで閉じる・aria-expanded・外側クリックで閉じる）
 * 使い方:
 *   NV-02 の <details class="lp-hd__menu"> は、何も書き換えずにそのまま強化される
 *   ほかの <details> は data-lpm-menu を付ける
 *   <button data-lpm-menu aria-controls="nav"> と <nav id="nav" hidden> の組み合わせにも対応
 *   メニュー内のリンクを押したときも閉じる（ページ内リンクで画面が移らない場合のため）
 */
export declare function lpmMenu(root?: ParentNode): void;
/**
 * スクロール方向で隠れるヘッダー
 * 使い方: <header data-lpm-autohide>…</header>
 *   下へスクロールすると .is-hidden が付いて上に隠れ、少しでも上へ戻すと現れる
 *   ページの先頭付近（ヘッダーの高さぶん）では常に表示
 *   中にフォーカスがあるとき、メニューが開いているときは隠さない
 *   ページ以外の箱をスクロールさせる場合は data-lpm-scroller="#id"
 */
export declare function lpmAutoHide(root?: ParentNode): void;
/**
 * 現在地メニューのハイライト（いま読んでいるセクションのリンクに印を付ける）
 * 使い方:
 *   <nav data-lpm-spy> <a href="#about">…</a> <a href="#works">…</a> </nav>
 *   ページ内リンク（#id）の先のセクションを見張り、画面の上から4割ほどの位置にあるものを「いまの場所」とする
 *   印は aria-current="true" と .is-current。見た目は CSS で決める
 *   ページ以外の箱をスクロールさせる場合は data-lpm-scroller="#id"
 */
export declare function lpmScrollSpy(root?: ParentNode): void;
/**
 * スクロール進捗バーの補完（CSSのスクロール連動に未対応のブラウザ向け）
 * 使い方: <div class="lpm-progress" data-lpm-progress aria-hidden="true"></div>
 *   対応ブラウザ（animation-timeline: scroll()）では CSS だけで動くので、この関数は何もしない
 *   未対応ブラウザでは、スクロール量を --lpm-progress（0〜1）に入れて同じ見た目にする
 *   ページ以外の箱の進み具合を出す場合は data-lpm-scroller="#id"
 */
export declare function lpmProgress(root?: ParentNode): void;
/**
 * 1文字ずつ出る（文字を自動で分けて、画面に入ったときに再生する）
 * 使い方: <h2 data-lpm-chars>家族の10年後まで考えた家づくり。</h2>
 *   中の文字を1文字ずつ <span class="lpm-chars__c" style="--i:番号"> に分ける（<br> はそのまま残す）
 *   読み上げ用に元の文章を1つ残し、分けた文字は読み上げから外す
 *   画面に入ると .is-in が付いて再生する。data-lpm-chars="30" で1文字ごとの間隔（ミリ秒）を変えられる
 *   CSS だけで使う場合は、サーバー側（PHP など）で同じ形に分けて出力すれば、読み込み時に再生される
 */
export declare function lpmSplitChars(root?: ParentNode): void;
/**
 * 画像の読み込み後にふわっと表示する
 * 使い方:
 *   <div class="lpm-img"><img src="photo.jpg" alt="…" loading="lazy" width="800" height="533" data-lpm-fade></div>
 *   読み込み中は .lpm-img の背景（色や小さなぼかし画像）が見え、読み込みが終わると画像がフェードインする
 *   すでに読み込み済みの画像はそのまま表示（フェードしない）。読み込みに失敗したら .is-error を付ける
 *   JS が動かない環境では、ふつうの画像として表示される
 */
export declare function lpmImgFade(root?: ParentNode): void;
/**
 * トースト通知（画面の端に短いお知らせを出し、時間がたつと消える）
 * 使い方:
 *   スクリプトから: lpmToast('保存しました', { type: 'ok' })   ※WordPress 版では LpMotion.toast(…)
 *     type: 'info' | 'ok' | 'warn' | 'error'、time: 表示する時間（ミリ秒、0 で自動では消えない）
 *   HTML から: <button data-lpm-toast="リンクをコピーしました" data-lpm-toast-type="ok">…</button>
 *   - 既定は5秒で消える。マウスを乗せている間・フォーカスがある間は止まる。× でいつでも閉じられる
 *   - error は自動では消さず、読み上げでもすぐに伝える。ほかは控えめに伝える
 *   - 見た目は UI-09（.ui-toasts / .ui-toast）
 */
export type LpmToastType = 'info' | 'ok' | 'warn' | 'error';
export interface LpmToastOptions {
    type?: LpmToastType;
    time?: number;
    root?: ParentNode;
}
export declare function lpmToast(message: string, options?: LpmToastOptions): HTMLElement;
/** data-lpm-toast を付けたボタンを押したときにトーストを出す */
export declare function lpmToastTriggers(root?: ParentNode): void;
/**
 * クリックで開くポップオーバーの位置調整
 * 使い方:
 *   <button popovertarget="tip-price">料金について</button>
 *   <div id="tip-price" class="lpm-pop" popover>…</div>
 *   HTML 標準の popover 属性だけで、クリックで開き、外側のクリックや Esc で閉じる（JS なしでは画面の中央に出る）
 *   この関数を使うと、押したボタンのすぐ下に出し、下に入りきらなければ上に、左右は画面からはみ出さないようにずらす
 *   data-lpm-pop-align="end" でボタンの右端にそろえる
 */
export declare function lpmPopover(root?: ParentNode): void;
/**
 * JS なしで開くモーダルの補完（command 属性に未対応のブラウザ向け）
 * 使い方:
 *   <button command="show-modal" commandfor="movie">動画を見る</button>
 *   <dialog id="movie" class="lpm-modal">… <button command="close" commandfor="movie">閉じる</button></dialog>
 *   対応ブラウザ（Chrome・Edge 135、Firefox 144、Safari 26.2 以降）では HTML だけで開閉する
 *   未対応のブラウザでは、M-17（lpmModal）の仕組みに切り替えて同じように開閉する
 *   popover の show-popover / hide-popover / toggle-popover にも対応
 */
export declare function lpmCommand(root?: ParentNode): void;
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
export declare function lpmDropdown(root?: ParentNode): void;
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
export declare function lpmSlider(root?: ParentNode): void;
/**
 * パララックスの補完（CSS のスクロール連動に未対応のブラウザ向け）
 * 使い方:
 *   <div class="lpm-parallax-frame"><img class="lpm-parallax" data-lpm-parallax src="…" alt="" style="--lpm-shift:40px"></div>
 *   対応ブラウザ（animation-timeline: view()）では CSS だけで動くので、この関数は何もしない
 *   未対応ブラウザでは、画面内の位置から --lpm-y を計算して同じ動きにする
 *   「動きを減らす」設定では動かさない。ページ以外の箱の中で使う場合は data-lpm-scroller="#id"
 */
export declare function lpmParallax(root?: ParentNode): void;
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
export declare function lpmScene(root?: ParentNode): void;
/**
 * 背景動画の一時停止ボタン（HR-05）
 * 使い方:
 *   <section data-lpm-video> <video autoplay muted loop playsinline>…</video>
 *     <button type="button" data-lpm-video-toggle aria-label="背景の動画を一時停止">…</button> </section>
 *   - ボタンで再生と一時停止を切り替え、ボタンの名前も「一時停止」「再生」と入れ替える
 *   - 「動きを減らす」設定では最初から止め、ポスター画像を見せる
 *   - 画面の外に出たら止め、戻ったら再開する（自分で止めた場合は再開しない）
 */
export declare function lpmVideo(root?: ParentNode): void;
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
export declare function lpmLoader(root?: ParentNode): void;
/**
 * ページ内の表示の切り替えに View Transitions を使う
 * 使い方:
 *   lpmViewTransition(() => { 表示を切り替える処理 });   ※WordPress 版では LpMotion.viewTransition(…)
 *   - 対応ブラウザでは、切り替えの前後がなめらかにつながる（Chrome・Edge 111、Safari 18 以降）
 *   - 未対応ブラウザと「動きを減らす」設定では、ふつうに切り替えるだけ
 *   ページをまたぐ遷移（別のページへのリンク）は CSS の @view-transition だけで動く（lp-motion.css の M-53 を参照）
 */
export declare function lpmViewTransition(update: () => void): Promise<void>;
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
export declare function lpmTheme(root?: ParentNode): void;
/**
 * クリップボードにコピーするボタン
 * 使い方:
 *   <button type="button" data-lpm-copy="#coupon">コピー</button>   指定した要素の文字（入力欄なら値）をコピー
 *   <button type="button" data-lpm-copy data-lpm-copy-text="SPRING2026">コピー</button>   書いた文字をコピー
 *   - 成功するとボタンの表示が2秒間「コピーしました」に変わり、読み上げでも伝える
 *   - コピーが許可されない環境では、文字を選択した状態にして ⌘C / Ctrl+C を案内する
 *   - data-lpm-copied で成功時の表示を変えられる
 */
export declare function lpmCopy(root?: ParentNode): void;
/**
 * パスワードの表示・非表示の切り替え
 * 使い方:
 *   UI-08（ログイン画面）のパスワード欄は、何も書き換えずにそのまま強化される
 *   ほかの欄は <input type="password" data-lpm-password> のように付ける（入れ物に付けてもよい）
 *   - 欄の右端に目のボタンを置き、押すと文字を表示／非表示に切り替える（aria-pressed で状態を伝える）
 *   - 送信するときは必ず非表示に戻す（ブラウザに平文で記憶させないため）
 *   - FM-03 のように入力欄のすぐ後ろに label がある場合は、並びを崩さずに一緒に包む
 */
export declare function lpmPassword(root?: ParentNode): void;
/** ページ内のすべての動きを有効にする */
export declare function initLpMotion(root?: ParentNode): void;
export {};
