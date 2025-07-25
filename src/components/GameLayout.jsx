/**
 * ゲームレイアウト管理コンポーネント
 */

import React from 'react';
import { Home, HelpCircle, Settings, RotateCcw } from 'lucide-react';

const GameLayout = ({ 
    children, 
    gameType, 
    onExitClick, 
    onHelpClick,
    onReviewModeClick,
    showExitConfirmDialog,
    onExitConfirm,
    onExitCancel,
    showReviewMode = false
}) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* ヘッダー */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold text-gray-800">
                                迷路ゲーム {gameType === 'extra' ? '- エクストラモード' : '- スタンダードモード'}
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {/* ヘルプボタン */}
                            <button
                                onClick={onHelpClick}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="ヘルプ"
                            >
                                <HelpCircle size={20} />
                            </button>
                            
                            {/* 感想戦モードボタン */}
                            {gameType === 'standard' && (
                                <button
                                    onClick={onReviewModeClick}
                                    className={`p-2 rounded-lg transition-colors ${
                                        showReviewMode 
                                            ? 'text-purple-600 bg-purple-100' 
                                            : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                                    }`}
                                    title="感想戦モード"
                                >
                                    <RotateCcw size={20} />
                                </button>
                            )}
                            
                            {/* ホームボタン */}
                            <button
                                onClick={onExitClick}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="ホームに戻る"
                            >
                                <Home size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="max-w-7xl mx-auto p-4">
                {children}
            </div>

            {/* 退出確認ダイアログ */}
            {showExitConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <Home className="mr-3 text-red-500" size={24} />
                            <h2 className="text-lg font-semibold">ゲームを終了しますか？</h2>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            ゲームを途中で抜けると、他のプレイヤーとのゲームが解散されます。
                            本当に終了しますか？
                        </p>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={onExitCancel}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={onExitConfirm}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                ゲームを終了
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameLayout;
