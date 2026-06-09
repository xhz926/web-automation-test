// /src/records/testRecord.ts

/**
 * テストで使用する固定データを管理するオブジェクト。
 *
 * テスト対象URLや、テストで使用する入力値などをここにまとめることで、
 * テストコード内に値を直接書かずに済むようにする。
 */
export const TestRecord = {
    /**
     * TODO MVC のテスト対象URL。
     */
    testUrl: "https://demo.playwright.dev/todomvc/#/",

    /**
     * テストケース名。
     */
    testCaseTitle: {
        addTodo: "TODOを新規追加できること",
        completeTodo: "TODOを完了状態に変更できること",
        filterTodos: "TODOをすべて・未完了・完了済みで絞り込めること",
    },

    /**
     * テストで使用するTODO項目。
     */
    todoItems: {
        first: "テストケースを作成する",
        second: "自動テストを実行する",
        third: "テスト結果を確認する",
    },
    /**
     * 期待するTODO画面のタイトル。
     */
    expectedTitle: "React • TodoMVC",
    /**
     * 待機時間の設定値。
     *
     * short  : 通常の要素表示待ちなど、短時間で完了する処理に使用する。
     * medium : 画面遷移や非同期処理など、少し時間がかかる可能性がある処理に使用する。
     * long   : データ取得や処理完了待ちなど、比較的時間がかかる処理に使用する。
     *
     * 単位はミリ秒。
     */
    timeout: {
        short: 3000,
        medium: 5000,
        long: 10000,
    },
} as const;