// /src/services/webService.ts

import { Locator, Page } from "@playwright/test";
import { TestRecord } from "../records/testRecord";

/**
 * Webページに対する基本操作をまとめたサービスクラス。
 *
 * Playwright の Page オブジェクトを直接テストコードから操作するのではなく、
 * よく使う操作をこのクラスにまとめることで、テストコード側の可読性を高める。
 *
 * 例：
 * - ページ遷移
 * - タイトル取得
 * - 要素取得
 * - テキスト取得
 * - テキスト入力
 * - クリック操作
 * - スクリーンショット取得
 *
 * 注意：
 * このクラスはあくまで「汎用的なWeb操作」を担当する。
 * Todo追加・Todo削除など、画面固有の業務操作は TodoService など別クラスに分ける。
 */
export class WebService {
    /**
     * Playwright の Page インスタンス。
     *
     * Page はブラウザ上の1つのタブ、または1つのページを表す。
     * このクラスでは、コンストラクタで受け取った Page を使って各種操作を行う。
     *
     * readonly を付けることで、コンストラクタ以外で page が再代入されることを防ぐ。
     */
    private readonly page: Page;

    /**
     * WebService のインスタンスを生成する。
     *
     * @param page Playwright の Page インスタンス
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 指定したURLのページを開く。
     *
     * page.goto() は対象URLへ遷移するための Playwright 標準メソッド。
     * テスト開始時に対象画面を開く場合などに使用する。
     *
     * @param url 遷移先のURL
     */
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * 現在表示しているページのタイトルを取得する。
     *
     * HTML の <title> タグに設定されている値を取得する。
     * 画面遷移後に、正しいページが表示されているか確認する場合などに使用できる。
     *
     * @returns ページタイトル
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * 現在のページを閉じる。
     *
     * 通常、Playwright Test ではテスト終了時に自動でページやブラウザが閉じられるため、
     * 必ずしも毎回呼び出す必要はない。
     *
     * ただし、明示的にページを閉じたい場合や、
     * 1つのテスト内で複数ページを扱う場合には使用できる。
     */
    async close(): Promise<void> {
        await this.page.close();
    }

    /**
     * 現在表示しているページのスクリーンショットを撮影する。
     *
     * テスト失敗時の調査や、画面状態の確認に利用できる。
     * path には保存先のファイルパスを指定する。
     *
     * 例：
     * await webService.screenshot("screenshots/top-page.png");
     *
     * @param path スクリーンショットの保存先パス
     */
    async screenshot(path: string): Promise<void> {
        await this.page.screenshot({ path });
    }

    /**
     * 指定したセレクターに一致する Locator を取得する。
     *
     * Locator は Playwright における要素操作の基本単位。
     * 取得した Locator に対して click(), fill(), textContent() などを実行できる。
     *
     * page.locator() 自体は非同期処理ではないため、async/await は不要。
     *
     * 例：
     * const button = webService.getNode("#submit-button");
     * await button.click();
     *
     * @param selector CSSセレクター、または Playwright が対応するセレクター
     * @returns 指定した要素を表す Locator
     */
    getNode(selector: string): Locator {
        return this.page.locator(selector);
    }

    /**
     * 指定したセレクターに一致する要素のテキストを取得する。
     *
     * textContent() は対象要素内のテキストを取得する。
     * 要素が存在していても、テキストが存在しない場合は null が返る可能性がある。
     *
     * そのため戻り値の型は string | null になる。
     *
     * 例：
     * const title = await webService.getText("h1");
     *
     * @param selector テキストを取得したい要素のセレクター
     * @returns 要素のテキスト。存在しない場合や空の場合は null
     */
    async getText(selector: string): Promise<string | null> {
        return await this.page.locator(selector).textContent();
    }

    /**
     * 指定したセレクターに一致する入力要素へテキストを入力する。
     *
     * fill() は input や textarea などの入力欄に値を設定する。
     * 既に入力されている値がある場合は、基本的にその内容を置き換える。
     *
     * 例：
     * await webService.inputText("#username", "test-user");
     *
     * @param selector 入力対象の要素セレクター
     * @param text 入力する文字列
     */
    async inputText(selector: string, text: string): Promise<void> {
        await this.page.locator(selector).fill(text);
    }

    /**
     * 指定したセレクターに一致する要素をクリックする。
     *
     * ボタン、リンク、チェックボックスなどのクリック操作に使用する。
     * Playwright の click() は、要素が表示されて操作可能になるまで自動的に待機する。
     *
     * 例：
     * await webService.click("#login-button");
     *
     * @param selector クリック対象の要素セレクター
     */
    async click(selector: string): Promise<void> {
        await this.page.locator(selector).click();
    }



    /**
     * 指定したセレクターに一致する要素が表示されているかどうかを確認する。
     *
     * isVisible() は要素が画面上に表示されているかどうかを確認する。
     * 対象要素が存在しない場合は false が返る。
     *
     * @param selector 確認対象の要素セレクター
     * @returns 要素が表示されている場合は true、表示されていない場合は false
     */
    async isVisible(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isVisible();
    }

    /**
     * 指定したセレクターに一致する要素が有効かどうかを確認する。
     *
     * isEnabled() は、ボタンや入力欄などの要素が操作可能な状態かどうかを確認する。
     * disabled 属性が付いている場合などは false が返る。
     *
     * @param selector 確認対象の要素セレクター
     * @returns 要素が有効な場合は true、有効でない場合は false
     */
    async isEnabled(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isEnabled();
    }

    /**
     * 指定したセレクターに一致する要素が表示されるまで待機する。
     *
     * waitFor({ state: "visible" }) は、対象要素が DOM 上に存在し、
     * かつ画面上で表示される状態になるまで待機する。
     *
     * 画面遷移後や非同期処理後に、対象要素が表示されることを確認してから
     * 次の操作を行いたい場合に使用する。
     *
     * 指定した timeout 内に要素が表示状態にならない場合、
     * Playwright の TimeoutError が発生する。
     *
     * @param selector 待機対象の要素セレクター
     * @param timeout 最大待機時間。単位はミリ秒。未指定の場合は TIMEOUT.MEDIUM(5000ミリ秒)。
    */
    async waitForVisible(selector: string, timeout: number = TestRecord.timeout.medium): Promise<void> {
        await this.page.locator(selector).waitFor({ state: "visible", timeout });
    }
    
    /**
     * エンターキー
     */
    async press(key: string): Promise<void> {
        await this.page.keyboard.press(key);
    }

}