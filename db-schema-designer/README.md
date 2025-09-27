# Database Schema Designer

ER図の作成とSQLスクリプトの自動生成ツール

## 概要

Database Schema Designerは、データベース設計を視覚的に行い、SQLスクリプトを自動生成するWebアプリケーションです。直感的なインターフェースでテーブル定義やリレーションシップを設計し、PostgreSQLおよびMySQL向けのDDLを自動生成します。

## 主な機能

### ER図エディタ
- ドラッグ&ドロップによるテーブル配置
- テーブル間のリレーションシップ設定
- カラムの詳細定義（型、制約、デフォルト値）
- ビジュアルエディタでの直感的な設計

### スキーマ管理
- テーブル定義の作成・編集・削除
- カラムプロパティの詳細設定
  - データ型選択
  - NULL制約
  - UNIQUE制約
  - DEFAULT値
  - CHECK制約
- インデックス管理
  - 単一カラムインデックス
  - 複合インデックス
  - UNIQUE インデックス

### リレーションシップ
- 1対1、1対多、多対多の関係定義
- 外部キー制約の設定
- カスケード削除・更新の設定
- 参照整合性の自動チェック

### SQL生成
- PostgreSQL対応DDL生成
- MySQL対応DDL生成
- CREATE TABLE文の自動生成
- ALTER TABLE文の生成
- インデックス作成文の生成

### エクスポート機能
- ER図の画像エクスポート（PNG/SVG）
- SQLファイルのダウンロード
- JSON形式でのスキーマ定義エクスポート
- マイグレーションファイル生成

## 技術スタック

### フロントエンド
- **Framework**: Vue.js 3
- **UI Library**: Element Plus
- **Diagram**: D3.js / Vue Flow
- **State Management**: Vuex
- **Build Tool**: Vite

### バックエンド
- **Language**: PHP 8.2
- **Framework**: Laravel 10
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: Laravel Queue

### インフラ
- **Container**: Docker
- **Web Server**: Nginx
- **Development**: Docker Compose

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/kt040403/db-schema-designer.git
cd db-schema-designer

# Dockerコンテナの起動
docker-compose up -d

# 依存関係のインストール
docker-compose exec app composer install
docker-compose exec app npm install

# 環境変数の設定
cp .env.example .env
docker-compose exec app php artisan key:generate

# データベースのマイグレーション
docker-compose exec app php artisan migrate

# フロントエンドのビルド
docker-compose exec app npm run build

# 開発サーバーの起動
docker-compose exec app npm run dev
```

## 使用方法

1. **新規プロジェクトの作成**
   - プロジェクト名とデータベースタイプを選択
   - 空のキャンバスが表示される

2. **テーブルの追加**
   - 「テーブル追加」ボタンをクリック
   - テーブル名とカラムを定義
   - データ型と制約を設定

3. **リレーションの設定**
   - テーブル間をドラッグで接続
   - 関係性のタイプを選択
   - 外部キー制約を設定

4. **SQLの生成**
   - 「SQL生成」ボタンをクリック
   - 対象データベースを選択
   - 生成されたSQLをコピーまたはダウンロード

## スクリーンショット

（プロジェクトの実際のスクリーンショットをここに追加）

## ライセンス

MIT License

## 作者

kt040403

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容について議論してください。