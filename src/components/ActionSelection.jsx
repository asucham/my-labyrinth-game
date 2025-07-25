/**
 * エクストラモード用アクション選択コンポーネント
 */

import React from 'react';
import { 
    Move, Search, Zap, Handshake, Clock, CheckCircle,
    Target, Users, Shield, AlertTriangle
} from 'lucide-react';

const ActionSelection = ({
    gameType,
    selectedAction,
    setSelectedAction,
    actionTarget,
    setActionTarget,
    sabotageType,
    setSabotageType,
    negotiationDetails,
    setNegotiationDetails,
    selectedMoveTarget,
    setSelectedMoveTarget,
    isSelectingMoveTarget,
    setIsSelectingMoveTarget,
    showActionDetails,
    setShowActionDetails,
    trapPlacementCoord,
    setTrapPlacementCoord,
    isPlacingTrap,
    setIsPlacingTrap,
    myPlayerState,
    gameData,
    gameMode,
    onDeclareAction,
    onStartMoveTargetSelection
}) => {
    if (gameType !== 'extra') return null;

    // アクションボタンコンポーネント
    const ActionButton = ({ actionType, label, icon: Icon, disabled = false, description = "" }) => {
        const isSelected = selectedAction === actionType;
        return (
            <button
                onClick={() => {
                    if (!disabled) {
                        setSelectedAction(actionType);
                        setShowActionDetails(true);
                    }
                }}
                disabled={disabled}
                className={`p-3 rounded-lg border-2 text-sm transition-all duration-200 ${
                    disabled 
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected 
                            ? 'border-blue-500 bg-blue-100 text-blue-800' 
                            : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                }`}
                title={description}
            >
                <div className="flex flex-col items-center space-y-1">
                    <Icon size={20}/>
                    <span className="font-medium">{label}</span>
                </div>
            </button>
        );
    };

    // 利用可能なプレイヤーリスト（自分以外）
    const otherPlayers = gameData?.players?.filter(pid => pid !== myPlayerState?.id) || [];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="mr-2" size={20} />
                アクション選択
            </h3>
            
            {/* 宣言状態表示 */}
            {myPlayerState?.hasDeclaredThisTurn && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="mr-2 text-green-600" size={16} />
                        <span className="text-green-800 font-medium">
                            アクション宣言済み: {myPlayerState.declaredAction?.type || '不明'}
                        </span>
                    </div>
                </div>
            )}
            
            {/* アクションボタン群 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <ActionButton 
                    actionType="move" 
                    label="移動" 
                    icon={Move}
                    description="隣接するセルに移動します"
                />
                <ActionButton 
                    actionType="scout" 
                    label="偵察" 
                    icon={Search}
                    description="他のプレイヤーの位置を偵察します"
                />
                <ActionButton 
                    actionType="sabotage" 
                    label="妨害" 
                    icon={Zap}
                    description="他のプレイヤーを妨害します"
                />
                <ActionButton 
                    actionType="negotiate" 
                    label="交渉" 
                    icon={Handshake}
                    description="他のプレイヤーと交渉します"
                />
                <ActionButton 
                    actionType="wait" 
                    label="待機" 
                    icon={Clock}
                    description="何もしないで待機します"
                />
            </div>
            
            {/* アクション詳細設定 */}
            {showActionDetails && selectedAction && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow-inner">
                    <h4 className="font-semibold mb-3 flex items-center">
                        <Shield className="mr-2" size={16} />
                        アクション詳細: {selectedAction}
                    </h4>
                    
                    {selectedAction === 'move' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">隣接するセルに移動します。</p>
                            {!selectedMoveTarget ? (
                                <button 
                                    onClick={onStartMoveTargetSelection}
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-lg"
                                >
                                    移動先を選択
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-green-600 font-medium">
                                        移動先: ({selectedMoveTarget.r}, {selectedMoveTarget.c})
                                    </p>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => setSelectedMoveTarget(null)}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
                                        >
                                            リセット
                                        </button>
                                        <button 
                                            onClick={onDeclareAction}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                                        >
                                            宣言
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {selectedAction === 'scout' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">他のプレイヤーの位置を偵察します。</p>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">対象プレイヤー:</label>
                                <select 
                                    value={actionTarget || ''}
                                    onChange={(e) => setActionTarget(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">選択してください</option>
                                    {otherPlayers.map(playerId => (
                                        <option key={playerId} value={playerId}>
                                            {playerId.substring(0, 8)}...
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {actionTarget && (
                                <button 
                                    onClick={onDeclareAction}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                                >
                                    偵察を宣言
                                </button>
                            )}
                        </div>
                    )}
                    
                    {selectedAction === 'sabotage' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">他のプレイヤーを妨害します。</p>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">妨害の種類:</label>
                                <select 
                                    value={sabotageType || ''}
                                    onChange={(e) => setSabotageType(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">選択してください</option>
                                    <option value="move_block">移動妨害</option>
                                    <option value="info_jam">情報妨害</option>
                                    <option value="trap">トラップ設置</option>
                                </select>
                            </div>
                            {sabotageType && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">対象プレイヤー:</label>
                                    <select 
                                        value={actionTarget || ''}
                                        onChange={(e) => setActionTarget(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">選択してください</option>
                                        {otherPlayers.map(playerId => (
                                            <option key={playerId} value={playerId}>
                                                {playerId.substring(0, 8)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {sabotageType && actionTarget && (
                                <button 
                                    onClick={onDeclareAction}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                                >
                                    妨害を宣言
                                </button>
                            )}
                        </div>
                    )}
                    
                    {selectedAction === 'negotiate' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">他のプレイヤーと交渉します。</p>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">交渉の種類:</label>
                                <select 
                                    value={negotiationDetails.type || ''}
                                    onChange={(e) => setNegotiationDetails(prev => ({...prev, type: e.target.value}))}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">選択してください</option>
                                    <option value="alliance">同盟提案</option>
                                    <option value="truce">停戦協定</option>
                                    <option value="info_share">情報共有</option>
                                </select>
                            </div>
                            {negotiationDetails.type && (
                                <>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">対象プレイヤー:</label>
                                        <select 
                                            value={actionTarget || ''}
                                            onChange={(e) => setActionTarget(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">選択してください</option>
                                            {otherPlayers.map(playerId => (
                                                <option key={playerId} value={playerId}>
                                                    {playerId.substring(0, 8)}...
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">条件:</label>
                                        <textarea 
                                            value={negotiationDetails.conditions || ''}
                                            onChange={(e) => setNegotiationDetails(prev => ({...prev, conditions: e.target.value}))}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            rows={2}
                                            placeholder="交渉の条件を入力..."
                                        />
                                    </div>
                                </>
                            )}
                            {negotiationDetails.type && actionTarget && (
                                <button 
                                    onClick={onDeclareAction}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                                >
                                    交渉を宣言
                                </button>
                            )}
                        </div>
                    )}
                    
                    {selectedAction === 'wait' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">何もしないで待機します。</p>
                            <button 
                                onClick={onDeclareAction}
                                className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                            >
                                待機を宣言
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {/* フェーズ情報 */}
            {gameData?.currentExtraModePhase && (
                <div className="mt-4 p-2 bg-blue-100 rounded-lg">
                    <div className="flex items-center">
                        <AlertTriangle className="mr-2 text-blue-600" size={16} />
                        <span className="text-blue-800 text-sm font-medium">
                            現在のフェーズ: {gameData.currentExtraModePhase === 'declaration' ? '宣言' : 'アクション実行'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionSelection;
