# Task Management REST API

タスク管理システムのバックエンドAPIです。

## 機能

- **認証機能**
  - JWT (JSON Web Token) による認証
  - ユーザー登録・ログイン
  - トークンリフレッシュ

- **タスク管理**
  - タスクのCRUD操作（作成・読み取り・更新・削除）
  - カテゴリー別管理
  - 優先度設定（高・中・低）
  - 期限設定と通知

- **カテゴリー管理**
  - カテゴリーのCRUD操作
  - タスクとカテゴリーの紐付け

## 技術スタック

- **Backend**: PHP 8.2
- **Database**: PostgreSQL
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Testing**: PHPUnit

## API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/refresh` - トークンリフレッシュ
- `POST /api/auth/logout` - ログアウト

### タスク
- `GET /api/tasks` - タスク一覧取得
- `GET /api/tasks/{id}` - タスク詳細取得
- `POST /api/tasks` - タスク作成
- `PUT /api/tasks/{id}` - タスク更新
- `DELETE /api/tasks/{id}` - タスク削除

### カテゴリー
- `GET /api/categories` - カテゴリー一覧取得
- `POST /api/categories` - カテゴリー作成
- `PUT /api/categories/{id}` - カテゴリー更新
- `DELETE /api/categories/{id}` - カテゴリー削除

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/kt040403/task-management-api.git

# 依存関係のインストール
composer install

# 環境変数の設定
cp .env.example .env

# データベースのマイグレーション
php artisan migrate

# サーバー起動
php -S localhost:8000
```

## API ドキュメント

Swagger UIによる詳細なAPIドキュメントは以下で確認できます：
[https://kt040403.github.io/task-api-docs](https://kt040403.github.io/task-api-docs)