# web-automation-test

Playwright を使用した Web UI 自動化テスト用のサンプルプロジェクトです。

本課題では、テスト対象として TodoMVC を使用しています。
TodoMVC は操作内容が比較的シンプルなため、テストケースそのものよりも、テストコードの可読性、保守性、Service 分離、fixture、CI 実行の構成を確認しやすい対象として選定しました。

Playwright の基本操作は共通サービスにまとめ、画面固有の操作は別サービスに分離することで、テストケース側では検証内容が分かりやすくなるようにしています。

## 手動テストケース

### TC-001: TODO を追加できること

| 項目   | 内容                                                                                         |
| ---- | ------------------------------------------------------------------------------------------ |
| 前提条件 | TODO 画面を開いていること                                                                            |
| 手順   | 1. TODO 入力欄に任意の TODO を入力する<br>2. Enter キーを押下する                                             |
| 期待結果 | 1. 入力した TODO が一覧に表示されること<br>2. TODO のテキストが入力内容と一致すること<br>3. TODO 件数表示が `1 item left` になること |

### TC-002: TODO を完了状態に変更できること

| 項目   | 内容                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------- |
| 前提条件 | TODO 画面を開いていること                                                                                   |
| 手順   | 1. TODO を 1 件追加する<br>2. 追加した TODO のチェックボックスをクリックする                                                |
| 期待結果 | 1. 対象 TODO が完了状態になること<br>2. 対象 TODO のチェックボックスがチェック済みになること<br>3. 未完了 TODO 件数が `0 items left` になること |

### TC-003: TODO を状態別に絞り込み表示できること

| 項目   | 内容                                                                                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 前提条件 | TODO 画面を開いていること                                                                                                                                                 |
| 手順   | 1. TODO を 2 件追加する<br>2. 1 件を完了状態に変更する<br>3. `All` フィルターを選択する<br>4. `Active` フィルターを選択する<br>5. `Completed` フィルターを選択する                                             |
| 期待結果 | 1. `All` 選択時、未完了 TODO と完了済み TODO の両方が表示されること<br>2. `Active` 選択時、未完了 TODO のみが表示され、完了済み TODO は表示されないこと<br>3. `Completed` 選択時、完了済み TODO のみが表示され、未完了 TODO は表示されないこと |

## 使用技術

* TypeScript
* Playwright
* pnpm
* GitHub Actions

## プロジェクト構成

```text
web-automation-test
├─ .github/
│  └─ workflows/
│     └─ playwright.yml
├─ src/
│  ├─ fixtures/
│  │  └─ todoFixture.ts
│  ├─ records/
│  │  └─ testRecord.ts
│  └─ services/
│     ├─ webService.ts
│     └─ todoService.ts
├─ tests/
│  └─ todo.spec.ts
├─ package.json
├─ playwright.config.ts
└─ README.md
```

## 主な構成

* `src/services/webService.ts`
  Playwright の `Page` 操作を共通化するクラスです。

* `src/services/todoService.ts`
  TODO 画面固有の操作をまとめるクラスです。

* `src/fixtures/todoFixture.ts`
  `TodoService` を fixture 経由で各テストに提供します。

* `src/records/testRecord.ts`
  テスト対象 URL、期待値、テストデータを管理します。

* `tests/todo.spec.ts`
  README に記載した手動テストケースを自動化したテストを配置しています。

## セットアップ

```bash
pnpm install
pnpm exec playwright install
```

CI 環境などで必要な依存関係も含めてインストールする場合は、以下を使用します。

```bash
pnpm exec playwright install --with-deps
```

## テスト実行

| コマンド               | 内容                           |
| ------------------ | ---------------------------- |
| `pnpm test`        | Playwright テストを実行します         |
| `pnpm test:headed` | ブラウザを表示してテストを実行します           |
| `pnpm test:ui`     | Playwright UI モードでテストを実行します  |
| `pnpm report`      | Playwright の HTML レポートを表示します |

## 対応ブラウザ

Playwright の `projects` 設定により、以下のブラウザで同じテストを実行します。

* Chromium
* Firefox
* WebKit

## 失敗時の調査情報

テスト失敗時の原因調査をしやすくするため、以下を保存する設定にしています。

* `trace`: 失敗時に保存
* `screenshot`: 失敗時のみ保存
* `video`: 失敗時に保存

また、テストコードでは `test.step` と assertion message を利用し、HTML レポート上でどの操作・確認で失敗したかを把握しやすくしています。

## GitHub Actions

GitHub Actions により、push 時および Pull Request 作成時に自動テストを実行します。
また、workflow_dispatch により、必要に応じて手動実行も可能です。

CI では、依存パッケージのインストール、Playwright ブラウザのインストール、テスト実行を行い、テスト結果や HTML レポートを確認できるようにしています。

## 設計方針

* Playwright の基本操作は `WebService` にまとめる
* 画面固有の操作は `TodoService` にまとめる
* `TodoService` は fixture 経由で各テストに提供する
* テストデータや期待値は `TestRecord` にまとめる
* テストケース側では CSS セレクターや DOM 構造の詳細をできるだけ直接扱わない
* 入力欄やフィルターリンクなど、ユーザー操作に近い要素は `getByPlaceholder` や `getByRole` を使用し、テストの意図を分かりやすくする
* `test.step` を利用し、テストレポート上で操作内容と確認内容を追いやすくする
* ローカル実行と CI 実行で同じテストを実行できるようにする

## 自動化しているテスト

README に記載した手動テストケースに対応する形で、以下の内容を自動化しています。

* 初期表示時に TODO 画面のタイトルが正しいこと
* 初期表示時に TODO 件数が表示されていないこと
* TODO を 1 件追加できること
* 追加した TODO が正しく表示されること
* TODO 件数表示が `1 item left` になること
* TODO を完了状態に変更できること
* 完了状態に変更した TODO のチェックボックスがチェック済みになること
* 未完了 TODO 件数が `0 items left` になること
* `All` フィルターで全 TODO が表示されること
* `Active` フィルターで未完了 TODO のみが表示されること
* `Completed` フィルターで完了済み TODO のみが表示されること

## 今後の改善案

* TODO 削除、 TODO の一括削除などのテストケースを追加する
* テスト対象 URL を環境変数化する
* ESLint / Prettier を導入し、コードスタイルを統一する
* CI 上で保存する artifact の保存期間や通知方法を整理する
* テストデータが増えた場合に備えて、データ管理方法をさらに整理する

## 備考

`node_modules`、テスト結果、Playwright レポート、環境変数ファイルなどは `.gitignore` により管理対象外としています。
