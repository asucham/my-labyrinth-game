/**
 * ゲーム情報表示コンポーネント
 */

import React from 'react';
import { 
    Clock, Trophy, Users, Target, AlertCircle, Timer,
    Play, Pause, RotateCcw, CheckCircle
} from 'lucide-react';

const GameInfo = ({ 
    gameData, 
    gameType, 
    phaseTimeLeft, 
    overallTimeLeft,
    formatTime,
    message,
    debugMode = false 
}) => {
    if (!gameData) return null;

    const {
        status,
        mode,
        currentTurnPlayerId,
        turnNumber,
        roundNumber,
        currentExtraModePhase,
        goalCount = 0,
        players = [],
        activeBattle,
        specialEventActive
    } = gameData;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Trophy className="mr-2" size={20} />
                ゲーム情報
            </h3>
            
            <div className="space-y-3">
                {/* ゲーム状態 */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">ゲーム状態:</span>
                    <div className="flex items-center">
                        {status === 'playing' ? (
                            <Play className="mr-1 text-green-500" size={16} />
                        ) : status === 'finished' ? (
                            <CheckCircle className="mr-1 text-blue-500" size={16} />
                        ) : (
                            <Pause className="mr-1 text-orange-500" size={16} />
                        )}
                        <span className="text-sm capitalize">{status}</span>
                    </div>
                </div>

                {/* 現在のメッセージ */}
                {message && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="mr-2 text-blue-600" size={16} />
                            <span className="text-sm text-blue-800">{message}</span>
                        </div>
                    </div>
                )}

                {/* スタンダードモード情報 */}
                {gameType === 'standard' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">ターン数:</span>
                            <span className="text-sm font-medium">{turnNumber || 1}</span>
                        </div>
                        
                        {currentTurnPlayerId && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm">現在のプレイヤー:</span>
                                <span className="text-sm font-medium">
                                    {currentTurnPlayerId.substring(0, 8)}...
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* エクストラモード情報 */}
                {gameType === 'extra' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">ラウンド:</span>
                            <span className="text-sm font-medium">{roundNumber || 1}</span>
                        </div>
                        
                        {currentExtraModePhase && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm">フェーズ:</span>
                                <span className="text-sm font-medium">
                                    {currentExtraModePhase === 'declaration' ? '宣言' : 
                                     currentExtraModePhase === 'actionExecution' ? 'アクション実行' :
                                     currentExtraModePhase === 'chat' ? 'チャット' : 
                                     currentExtraModePhase}
                                </span>
                            </div>
                        )}

                        {/* フェーズタイマー */}
                        {phaseTimeLeft !== null && formatTime && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm">フェーズ残り時間:</span>
                                <div className="flex items-center">
                                    <Timer className="mr-1" size={14} />
                                    <span className="text-sm font-medium">{formatTime(phaseTimeLeft)}</span>
                                </div>
                            </div>
                        )}

                        {/* 全体タイマー */}
                        {overallTimeLeft !== null && formatTime && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm">ゲーム残り時間:</span>
                                <div className="flex items-center">
                                    <Clock className="mr-1" size={14} />
                                    <span className="text-sm font-medium">{formatTime(overallTimeLeft)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* プレイヤー情報 */}
                <div className="flex items-center justify-between">
                    <span className="text-sm">参加プレイヤー:</span>
                    <div className="flex items-center">
                        <Users className="mr-1" size={14} />
                        <span className="text-sm font-medium">{players.length}人</span>
                    </div>
                </div>

                {/* ゴール達成者数 */}
                {goalCount > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm">ゴール達成者:</span>
                        <div className="flex items-center">
                            <Target className="mr-1 text-green-500" size={14} />
                            <span className="text-sm font-medium text-green-600">{goalCount}人</span>
                        </div>
                    </div>
                )}

                {/* アクティブバトル */}
                {activeBattle && (
                    <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center">
                            <RotateCcw className="mr-2 text-orange-600" size={16} />
                            <span className="text-sm text-orange-800">
                                バトル進行中: {activeBattle.player1?.substring(0,8)}... vs {activeBattle.player2?.substring(0,8)}...
                            </span>
                        </div>
                    </div>
                )}

                {/* 特殊イベント */}
                {specialEventActive && (
                    <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="mr-2 text-purple-600" size={16} />
                            <span className="text-sm text-purple-800">
                                特殊イベント: {specialEventActive.name || specialEventActive.type}
                            </span>
                        </div>
                    </div>
                )}

                {/* デバッグ情報 */}
                {debugMode && (
                    <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-xs text-yellow-800">
                            <div>🔧 デバッグモード有効</div>
                            <div>ゲームモード: {mode}</div>
                            <div>ステータス: {status}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameInfo;
