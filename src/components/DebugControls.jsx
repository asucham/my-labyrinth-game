/**
 * デバッグ機能コンポーネント
 */

import React from 'react';
import { 
    Bug, Users, Eye, EyeOff, RotateCcw, Play, Pause, 
    ArrowRight, User, Settings
} from 'lucide-react';

const DebugControls = ({
    debugMode,
    gameData,
    debugCurrentPlayerId,
    setDebugCurrentPlayerId,
    showOpponentWallsDebug,
    setShowOpponentWallsDebug,
    debugPlayerStates,
    userId,
    onPlayerSwitch
}) => {
    if (!debugMode) return null;

    const availablePlayers = gameData?.players || [];

    return (
        <div className="fixed top-4 right-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg z-50 max-w-xs">
            <div className="flex items-center mb-3">
                <Bug className="mr-2 text-yellow-700" size={20} />
                <h3 className="font-bold text-yellow-800">🔧 デバッグモード</h3>
            </div>
            
            <div className="space-y-3">
                {/* プレイヤー切り替え */}
                <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-yellow-800">
                        <User className="mr-1" size={14} />
                        操作プレイヤー:
                    </label>
                    <select
                        value={debugCurrentPlayerId}
                        onChange={(e) => {
                            setDebugCurrentPlayerId(e.target.value);
                            if (onPlayerSwitch) {
                                onPlayerSwitch(e.target.value);
                            }
                        }}
                        className="w-full p-2 text-xs border border-yellow-400 rounded bg-white"
                    >
                        {availablePlayers.map(playerId => (
                            <option key={playerId} value={playerId}>
                                {playerId === userId ? 'あなた' : `${playerId.substring(0, 8)}...`}
                                {playerId === gameData?.currentTurnPlayerId ? ' (ターン中)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 現在の操作プレイヤー情報 */}
                {debugPlayerStates[debugCurrentPlayerId] && (
                    <div className="p-2 bg-white rounded border">
                        <div className="text-xs text-gray-600">
                            <div className="font-medium mb-1">選択中プレイヤー情報:</div>
                            <div>位置: ({debugPlayerStates[debugCurrentPlayerId].position?.r || 0}, {debugPlayerStates[debugCurrentPlayerId].position?.c || 0})</div>
                            <div>ポイント: {debugPlayerStates[debugCurrentPlayerId].score || 0}pt</div>
                            {debugPlayerStates[debugCurrentPlayerId].goalTime && (
                                <div className="text-green-600">✓ ゴール達成済み</div>
                            )}
                        </div>
                    </div>
                )}

                {/* 壁表示トグル */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowOpponentWallsDebug(!showOpponentWallsDebug)}
                        className={`flex items-center px-3 py-1 rounded text-xs transition-colors ${
                            showOpponentWallsDebug 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {showOpponentWallsDebug ? (
                            <><Eye className="mr-1" size={12} />壁表示ON</>
                        ) : (
                            <><EyeOff className="mr-1" size={12} />壁表示OFF</>
                        )}
                    </button>
                </div>

                {/* ゲーム状態情報 */}
                <div className="p-2 bg-white rounded border">
                    <div className="text-xs text-gray-600">
                        <div className="font-medium mb-1">ゲーム状態:</div>
                        <div>ステータス: {gameData?.status}</div>
                        <div>モード: {gameData?.mode}</div>
                        {gameData?.currentTurnPlayerId && (
                            <div>現在のターン: {gameData.currentTurnPlayerId.substring(0, 8)}...</div>
                        )}
                        {gameData?.turnNumber && (
                            <div>ターン数: {gameData.turnNumber}</div>
                        )}
                        {gameData?.roundNumber && (
                            <div>ラウンド: {gameData.roundNumber}</div>
                        )}
                    </div>
                </div>

                {/* 全プレイヤー一覧 */}
                <div className="p-2 bg-white rounded border">
                    <div className="text-xs text-gray-600">
                        <div className="font-medium mb-1">全プレイヤー:</div>
                        {availablePlayers.map(playerId => {
                            const playerState = debugPlayerStates[playerId];
                            const isCurrentTurn = gameData?.currentTurnPlayerId === playerId;
                            const isSelected = debugCurrentPlayerId === playerId;
                            
                            return (
                                <div 
                                    key={playerId}
                                    className={`flex items-center justify-between py-1 px-1 rounded ${
                                        isSelected ? 'bg-blue-100' : ''
                                    }`}
                                >
                                    <span className={`${isCurrentTurn ? 'font-bold text-green-600' : ''}`}>
                                        {playerId === userId ? 'あなた' : `${playerId.substring(0, 8)}...`}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        {isCurrentTurn && (
                                            <Play className="text-green-500" size={10} />
                                        )}
                                        {playerState?.goalTime && (
                                            <span className="text-green-600">🎯</span>
                                        )}
                                        {playerState?.inBattleWith && (
                                            <span className="text-red-600">⚔️</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 警告メッセージ */}
                <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-300">
                    ⚠️ デバッグモードではゲームバランスが変更されます
                </div>
            </div>
        </div>
    );
};

export default DebugControls;
