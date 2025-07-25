/**
 * 感想戦モードコンポーネント
 * ゲーム終了後の振り返り画面：両者の迷路全体図、通った場所、ミスした場所の確認
 */

import React, { useState } from 'react';
import { ArrowLeft, Eye, Map, MessageSquare, RotateCcw } from 'lucide-react';
import MazeGrid from './MazeGrid';

/**
 * 感想戦モードコンポーネント
 * @param {Object} gameData - ゲームデータ
 * @param {string} userId - 現在のユーザーID
 * @param {Function} onClose - 感想戦モードを終了する関数
 */
const ReviewModeScreen = ({ gameData, userId, onClose }) => {
    const [selectedView, setSelectedView] = useState('both'); // 'both', 'player1', 'player2'
    
    if (!gameData || !gameData.playerStates || !gameData.mazes) {
        return (
            <div className="max-w-7xl mx-auto p-4 bg-gray-100 min-h-screen">
                <div className="text-center">
                    <p className="text-gray-500">データを読み込み中...</p>
                </div>
            </div>
        );
    }

    const players = gameData.players || [];
    const player1 = players[0];
    const player2 = players[1];
    const player1State = gameData.playerStates[player1];
    const player2State = gameData.playerStates[player2];
    const player1Maze = gameData.mazes[player1]; // player1が作った迷路
    const player2Maze = gameData.mazes[player2]; // player2が作った迷路

    return (
        <div className="max-w-7xl mx-auto p-4 bg-gray-100 min-h-screen">
            {/* ヘッダー */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <RotateCcw size={24} className="mr-2 text-blue-600"/>
                        感想戦モード
                    </h1>
                    <button
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-2"/>
                        ホームに戻る
                    </button>
                </div>
                <p className="text-gray-600 mt-2">
                    両者の迷路設計と攻略経路を振り返ることができます。迷路をクリックして詳細を確認しましょう。
                </p>
            </div>

            {/* 表示切り替えタブ */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setSelectedView('both')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            selectedView === 'both' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <Map size={16} className="inline mr-2"/>
                        両方表示
                    </button>
                    <button
                        onClick={() => setSelectedView('player1')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            selectedView === 'player1' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <Eye size={16} className="inline mr-2"/>
                        {player1 === userId ? 'あなたの迷路' : '相手の迷路'} 詳細
                    </button>
                    <button
                        onClick={() => setSelectedView('player2')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            selectedView === 'player2' 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <Eye size={16} className="inline mr-2"/>
                        {player2 === userId ? 'あなたの迷路' : '相手の迷路'} 詳細
                    </button>
                </div>
            </div>

            {/* メインコンテンツ */}
            {selectedView === 'both' ? (
                // 両方表示モード
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Player 1の迷路 */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            🎮 {player1 === userId ? 'あなた' : '相手'}が作成した迷路
                        </h2>
                        <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                            <p><strong>攻略者:</strong> {player2 === userId ? 'あなた' : '相手'}</p>
                            <p><strong>最終位置:</strong> ({player2State?.position?.r || 0}, {player2State?.position?.c || 0})</p>
                            <p><strong>発見セル数:</strong> {Object.keys(player2State?.revealedCells || {}).length}</p>
                            {player2State?.goalTime && (
                                <p className="text-green-600 font-semibold">✅ ゴール達成</p>
                            )}
                        </div>
                        
                        {player1Maze && (
                            <div className="relative">
                                {/* 座標ラベル */}
                                <div className="mb-2">
                                    <div className="flex justify-center">
                                        <div className="grid grid-cols-6 gap-1 w-fit">
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => (
                                                <div key={letter} className="w-8 h-6 flex items-center justify-center text-sm font-semibold text-gray-600">
                                                    {letter}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center">
                                    <div className="flex flex-col mr-2">
                                        {[1, 2, 3, 4, 5, 6].map((number) => (
                                            <div key={number} className="w-6 h-8 flex items-center justify-center text-sm font-semibold text-gray-600">
                                                {number}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <MazeGrid
                                        mazeData={player1Maze}
                                        playerPosition={player2State?.position}
                                        otherPlayers={[]}
                                        revealedCells={player2State?.revealedCells || {}}
                                        revealedPlayerWalls={player2State?.revealedWalls || []}
                                        onCellClick={() => {}}
                                        gridSize={6}
                                        sharedWalls={[]}
                                        highlightPlayer={true}
                                        smallView={false}
                                        showAllWalls={true}
                                        playerColor="blue"
                                        reviewMode={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Player 2の迷路 */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            🎮 {player2 === userId ? 'あなた' : '相手'}が作成した迷路
                        </h2>
                        <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                            <p><strong>攻略者:</strong> {player1 === userId ? 'あなた' : '相手'}</p>
                            <p><strong>最終位置:</strong> ({player1State?.position?.r || 0}, {player1State?.position?.c || 0})</p>
                            <p><strong>発見セル数:</strong> {Object.keys(player1State?.revealedCells || {}).length}</p>
                            {player1State?.goalTime && (
                                <p className="text-green-600 font-semibold">✅ ゴール達成</p>
                            )}
                        </div>
                        
                        {player2Maze && (
                            <div className="relative">
                                {/* 座標ラベル */}
                                <div className="mb-2">
                                    <div className="flex justify-center">
                                        <div className="grid grid-cols-6 gap-1 w-fit">
                                            {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => (
                                                <div key={letter} className="w-8 h-6 flex items-center justify-center text-sm font-semibold text-gray-600">
                                                    {letter}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center">
                                    <div className="flex flex-col mr-2">
                                        {[1, 2, 3, 4, 5, 6].map((number) => (
                                            <div key={number} className="w-6 h-8 flex items-center justify-center text-sm font-semibold text-gray-600">
                                                {number}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <MazeGrid
                                        mazeData={player2Maze}
                                        playerPosition={player1State?.position}
                                        otherPlayers={[]}
                                        revealedCells={player1State?.revealedCells || {}}
                                        revealedPlayerWalls={player1State?.revealedWalls || []}
                                        onCellClick={() => {}}
                                        gridSize={6}
                                        sharedWalls={[]}
                                        highlightPlayer={true}
                                        smallView={false}
                                        showAllWalls={true}
                                        playerColor="purple"
                                        reviewMode={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // 詳細表示モード
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        詳細分析: {selectedView === 'player1' ? (player1 === userId ? 'あなた' : '相手') : (player2 === userId ? 'あなた' : '相手')}の迷路
                    </h2>
                    
                    {/* 統計情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <h3 className="font-semibold text-blue-700">迷路の難易度</h3>
                            <p className="text-2xl font-bold text-blue-800">
                                {selectedView === 'player1' ? 
                                    player1Maze?.walls?.length || 0 : 
                                    player2Maze?.walls?.length || 0
                                } 壁
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <h3 className="font-semibold text-green-700">攻略者の探索率</h3>
                            <p className="text-2xl font-bold text-green-800">
                                {Math.round((Object.keys(
                                    selectedView === 'player1' ? 
                                        player2State?.revealedCells || {} : 
                                        player1State?.revealedCells || {}
                                ).length / 36) * 100)}%
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <h3 className="font-semibold text-yellow-700">結果</h3>
                            <p className="text-lg font-bold text-yellow-800">
                                {(selectedView === 'player1' ? player2State?.goalTime : player1State?.goalTime) ? 
                                    '✅ ゴール達成' : '❌ 未達成'
                                }
                            </p>
                        </div>
                    </div>

                    {/* 大きな迷路表示 */}
                    <div className="flex justify-center">
                        <div className="scale-125 transform-gpu">
                            {((selectedView === 'player1' && player1Maze) || (selectedView === 'player2' && player2Maze)) && (
                                <div className="relative">
                                    {/* 座標ラベル */}
                                    <div className="mb-2">
                                        <div className="flex justify-center">
                                            <div className="grid grid-cols-6 gap-1 w-fit">
                                                {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => (
                                                    <div key={letter} className="w-8 h-6 flex items-center justify-center text-sm font-semibold text-gray-600">
                                                        {letter}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center">
                                        <div className="flex flex-col mr-2">
                                            {[1, 2, 3, 4, 5, 6].map((number) => (
                                                <div key={number} className="w-6 h-8 flex items-center justify-center text-sm font-semibold text-gray-600">
                                                    {number}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <MazeGrid
                                            mazeData={selectedView === 'player1' ? player1Maze : player2Maze}
                                            playerPosition={selectedView === 'player1' ? player2State?.position : player1State?.position}
                                            otherPlayers={[]}
                                            revealedCells={selectedView === 'player1' ? player2State?.revealedCells || {} : player1State?.revealedCells || {}}
                                            revealedPlayerWalls={selectedView === 'player1' ? player2State?.revealedWalls || [] : player1State?.revealedWalls || []}
                                            onCellClick={() => {}}
                                            gridSize={6}
                                            sharedWalls={[]}
                                            highlightPlayer={true}
                                            smallView={false}
                                            showAllWalls={true}
                                            playerColor={selectedView === 'player1' ? 'blue' : 'purple'}
                                            reviewMode={true}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* フィードバックエリア */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <MessageSquare size={18} className="mr-2"/>
                    振り返りメモ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">良かった点</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 迷路設計が効果的だった</li>
                            <li>• 探索戦略が良かった</li>
                            <li>• コミュニケーションが円滑だった</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">改善点</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• より複雑な迷路にできた</li>
                            <li>• 効率的な探索ができた</li>
                            <li>• 戦略的思考を深められた</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModeScreen;
