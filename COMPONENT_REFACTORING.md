# PlayScreenコンポーネント分割提案

現在のPlayScreen.jsxは約2000行と非常に大きくなっているため、以下のように分割することを提案します。

## 作成したコンポーネント

### 1. components/ChatSection.jsx
- チャット機能を独立したコンポーネント
- プロップス: chatMessages, chatInput, setChatInput, handleSendChatMessage, onShowHelp, chatLogRef, isInBattle, title

### 2. components/PlayerInfo.jsx
- プレイヤー情報表示コンポーネント
- プロップス: playerState, gameData, effectiveUserId, isMyTurn

### 3. components/MovementControls.jsx
- 移動操作ボタンコンポーネント
- プロップス: isMyTurn, isMoving, message, onMove, disabled

### 4. components/PlayerMazeView.jsx
- 他プレイヤーの迷路表示コンポーネント
- プロップス: gameData, effectiveUserId, selectedViewPlayerId, setSelectedViewPlayerId, currentGridSize

### 5. components/StandardModeLayout.jsx
- スタンダードモードのレイアウトコンポーネント
- 上記のコンポーネントを組み合わせて3列レイアウトを実現

### 6. hooks/useGameMovement.js
- ゲーム移動処理のカスタムフック
- 移動ロジック、壁衝突検知、状態管理を担当

### 7. hooks/useChat.js
- チャット機能のカスタムフック
- チャットメッセージの読み込み、送信処理を担当

## PlayScreen.jsxの使用方法

```jsx
// インポート部分にコンポーネントを追加
import ChatSection from './ChatSection';
import StandardModeLayout from './StandardModeLayout';
import { useGameMovement } from '../hooks/useGameMovement';
import { useChat } from '../hooks/useChat';

// PlayScreenコンポーネント内で使用
const { isMoving, hitWalls, handleStandardMove } = useGameMovement(gameId, effectiveUserId, effectivePlayerState, mazeToPlayData);
const { chatMessages, chatInput, setChatInput, handleSendChatMessage } = useChat(gameId, userId);

// スタンダードモード部分をStandardModeLayoutコンポーネントで置き換え
{gameType === 'standard' ? (
    <StandardModeLayout
        // 必要なプロップスを渡す
        mazeToPlayData={mazeToPlayData}
        effectivePlayerState={effectivePlayerState}
        // ... その他のプロップス
    />
) : (
    // エクストラモードの既存コード
)}
```

## 利点

1. **可読性向上**: 各ファイルが特定の機能に集中
2. **再利用性**: 他の画面でもコンポーネントを使用可能
3. **保守性**: バグ修正や機能追加が容易
4. **テスト**: 個別コンポーネントのテストが可能
5. **パフォーマンス**: 必要な部分のみ再レンダリング

## 次のステップ

現在のPlayScreen.jsxの機能を段階的に分割したコンポーネントに移行することで、より管理しやすいコードベースにできます。

作成済みのコンポーネントファイル:
- ✅ components/ChatSection.jsx
- ✅ components/PlayerInfo.jsx  
- ✅ components/MovementControls.jsx
- ✅ components/PlayerMazeView.jsx
- ✅ components/StandardModeLayout.jsx
- ✅ hooks/useGameMovement.js
- ✅ hooks/useChat.js

これらのコンポーネントを活用して、PlayScreen.jsxを段階的にリファクタリングできます。
