/**
 * プレイヤー情報表示コンポーネント
 */

import React from 'react';
import { User, MapPin, Trophy, Clock, Users, Target, Shield, Zap } from 'lucide-react';

const PlayerInfo = ({ 
    playerState,
    effectivePlayerState, 
    gameData, 
    effectiveUserId,
    gameType = 'standard',
    isMyTurn = false,
    formatTime,
    debugMode = false 
}) => {
    // 使用する状態を決定
    const state = effectivePlayerState || playerState;
    if (!state) return null;

    const { 
        position, 
        score = 0, 
        goalTime, 
        personalTimeUsed = 0,
        allianceId,
        sabotageEffects = [],
        secretObjective,
        skipNextTurn,
        inBattleWith
    } = state;

    return (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-700 flex items-center">
                    <User className="mr-2" size={16} />
                    あなたの情報
                </h4>
                <div className="flex items-center space-x-2">
                    {isMyTurn && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            あなたのターン
                        </div>
                    )}
                    {skipNextTurn && (
                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            行動不能
                        </div>
                    )}
                    {inBattleWith && (
                        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            バトル中
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-sm space-y-1">
                <div className="flex items-center">
                    <MapPin className="mr-2" size={14} />
                    <span>
                        <strong>現在位置:</strong> ({position?.r || 0}, {position?.c || 0})
                    </span>
                </div>
                
                <div className="flex items-center">
                    <Trophy className="mr-2" size={14} />
                    <span>
                        <strong>所持ポイント:</strong> {score}pt
                    </span>
                </div>
                
                {goalTime && (
                    <div className="text-green-600 font-bold flex items-center">
                        <Target className="mr-2" size={14} />
                        🎉 ゴール達成！
                    </div>
                )}
                
                {/* エクストラモード情報 */}
                {gameType === 'extra' && formatTime && (
                    <div className="flex items-center">
                        <Clock className="mr-2" size={14} />
                        <span>
                            <strong>個人時間:</strong> {formatTime(personalTimeUsed)}
                        </span>
                    </div>
                )}
                
                {allianceId && (
                    <div className="flex items-center">
                        <Users className="mr-2 text-blue-500" size={14} />
                        <span className="text-blue-600">
                            <strong>同盟:</strong> {allianceId}
                        </span>
                    </div>
                )}
                
                {sabotageEffects.length > 0 && (
                    <div className="flex items-center">
                        <Zap className="mr-2 text-red-500" size={14} />
                        <span className="text-red-600">
                            <strong>妨害効果:</strong> {sabotageEffects.length}個
                        </span>
                    </div>
                )}
                
                {secretObjective && debugMode && (
                    <div className="flex items-center">
                        <Shield className="mr-2 text-purple-500" size={14} />
                        <span className="text-xs text-purple-600">
                            <strong>秘密目標:</strong> {secretObjective.description}
                        </span>
                    </div>
                )}
                
                {/* ゲーム情報 */}
                {gameData?.mode === '4player' && (
                    <div className="flex items-center">
                        <Users className="mr-2" size={14} />
                        <span>
                            <strong>参加者:</strong> {gameData.players?.length || 0}人
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerInfo;
