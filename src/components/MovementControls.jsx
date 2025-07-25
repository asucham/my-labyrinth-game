/**
 * 移動操作コンポーネント
 */

import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, User, Move, Loader } from 'lucide-react';

const MovementControls = ({ 
    gameType = 'standard',
    isMyTurn,
    isMoving,
    message,
    onMove,
    disabled = false,
    canMove = true,
    inBattle = false
}) => {
    const getStatusDisplay = () => {
        if (isMoving) {
            return (
                <div className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2 text-blue-500" size={20} />
                    <p className="text-blue-600 font-semibold">移動中...</p>
                </div>
            );
        }
        
        if (message) {
            let statusClass = "text-gray-600";
            let icon = "";
            
            if (message.includes('成功') || message.includes('移動！')) {
                statusClass = "text-green-600";
                icon = "✅ ";
            } else if (message.includes('失敗') || message.includes('阻まれて') || message.includes('できません')) {
                statusClass = "text-red-600";
                icon = "❌ ";
            } else if (message.includes('移動中')) {
                statusClass = "text-blue-600";
                icon = "⏳ ";
            }
            
            return <p className={`${statusClass} font-semibold`}>{icon}{message}</p>;
        }
        
        if (isMyTurn && !inBattle) {
            return <p className="text-green-600 font-semibold">🟢 あなたのターン</p>;
        } else if (inBattle) {
            return <p className="text-orange-600 font-semibold">⚔️ バトル中</p>;
        }
        
        return <p className="text-gray-600 font-semibold">⏳ 相手のターン</p>;
    };

    const canActuallyMove = canMove && isMyTurn && !isMoving && !disabled && !inBattle;

    // エクストラモード用の表示
    if (gameType === 'extra') {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Move className="mr-2" size={20} />
                    移動選択
                </h4>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                    {getStatusDisplay()}
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                    <p>エクストラモードでは、アクション選択で「移動」を選んでから、移動先のセルをクリックして選択してください。</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
                <Move className="mr-2" size={20} />
                移動操作
            </h4>
            
            {/* 移動状態表示 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                {getStatusDisplay()}
            </div>
            
            {canActuallyMove ? (
                <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                    <div></div>
                    <button 
                        onClick={() => onMove('up')}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors shadow-md"
                        title="上に移動 (W キー)"
                    >
                        <ArrowUp size={20}/>
                    </button>
                    <div></div>
                    
                    <button 
                        onClick={() => onMove('left')}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors shadow-md"
                        title="左に移動 (A キー)"
                    >
                        <ArrowLeft size={20}/>
                    </button>
                    <div className="bg-gray-200 rounded-lg p-3 flex items-center justify-center">
                        <User size={20} className="text-gray-500"/>
                    </div>
                    <button 
                        onClick={() => onMove('right')}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors shadow-md"
                        title="右に移動 (D キー)"
                    >
                        <ArrowRight size={20}/>
                    </button>
                    
                    <div></div>
                    <button 
                        onClick={() => onMove('down')}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors shadow-md"
                        title="下に移動 (S キー)"
                    >
                        <ArrowDown size={20}/>
                    </button>
                    <div></div>
                </div>
            ) : (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">
                        {inBattle ? 'バトル中は移動できません' : 
                         !isMyTurn ? '相手のターンです' :
                         disabled ? '移動が無効です' :
                         '移動できません'}
                    </p>
                </div>
            )}
            
            {/* 操作説明 */}
            <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
                <p>• キーボード操作: WASD / 矢印キー</p>
                <p>• 迷路をクリック: 隣接セルに移動</p>
            </div>
        </div>
    );
};

export default MovementControls;
