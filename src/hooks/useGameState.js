import { useState, useEffect, useCallback, useRef } from 'react';
import {
    doc, updateDoc, serverTimestamp, increment, collection, addDoc, query, onSnapshot, orderBy, limit
} from 'firebase/firestore';
import { db, appId } from '../firebase';

export const useGameState = (userId, setScreen, gameMode, debugMode) => {
    // 基本状態
    const [gameId, setGameId] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [myPlayerState, setMyPlayerState] = useState(null);
    const [mazeToPlayData, setMazeToPlayData] = useState(null);
    const [myCreatedMazeData, setMyCreatedMazeData] = useState(null);
    const [playerSolvingMyMaze, setPlayerSolvingMyMaze] = useState(null);
    const [message, setMessage] = useState("ゲーム開始！");
    const [gameType, setGameType] = useState('standard');
    
    // UI状態
    const [showOpponentWallsDebug, setShowOpponentWallsDebug] = useState(false);
    const [showHelpOverlay, setShowHelpOverlay] = useState(false);
    const [showReviewMode, setShowReviewMode] = useState(false);
    const [showExitConfirmDialog, setShowExitConfirmDialog] = useState(false);
    
    // バトル状態
    const [isBattleModalOpen, setIsBattleModalOpen] = useState(false);
    const [battleOpponentId, setBattleOpponentId] = useState("");
    
    // 移動状態
    const [isMoving, setIsMoving] = useState(false);
    const [hitWalls, setHitWalls] = useState([]);
    
    // モーダル状態
    const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
    
    // デバッグ状態
    const [debugCurrentPlayerId, setDebugCurrentPlayerId] = useState(userId);
    const [debugPlayerStates, setDebugPlayerStates] = useState({});
    const [debugMazeData, setDebugMazeData] = useState({});
    
    // 実際に使用するplayerStateとuserIdを決定
    const effectiveUserId = debugMode ? debugCurrentPlayerId : userId;
    const effectivePlayerState = debugMode ? debugPlayerStates[debugCurrentPlayerId] : myPlayerState;
    
    // 計算されたプロパティ
    const isMyStandardTurn = gameData?.currentTurnPlayerId === effectiveUserId && gameType === 'standard';
    const inStandardBattleBetting = effectivePlayerState?.inBattleWith && gameType === 'standard';
    
    // ゲームデータ読み込み
    useEffect(() => {
        if (!gameId) {
            const savedGameId = localStorage.getItem('labyrinthGameId');
            const savedGameType = localStorage.getItem('labyrinthGameType');
            if (savedGameId && savedGameType) {
                setGameId(savedGameId);
                setGameType(savedGameType);
                return;
            } else {
                setScreen('lobby');
                return;
            }
        }

        const gameDocRef = doc(db, `artifacts/${appId}/public/data/labyrinthGames`, gameId);
        const unsubscribe = onSnapshot(gameDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Game data loaded:", data);
                    setGameData(data);
                    
                    const myState = data.playerStates?.[userId];
                    console.log("My player state:", myState);
                    setMyPlayerState(myState);
                    
                    // デバッグモード時は全プレイヤーの状態を保存
                    if (debugMode && data.playerStates) {
                        setDebugPlayerStates(data.playerStates);
                        console.log("🔧 [DEBUG] All player states updated:", data.playerStates);
                    }
                    
                    if (data.status === 'finished') {
                        setIsGameOverModalOpen(true);
                        return;
                    }
                    
                    // 迷路データの読み込み
                    if (myState?.assignedMazeOwnerId && data.mazes) {
                        const assignedMaze = data.mazes[myState.assignedMazeOwnerId];
                        if (assignedMaze) {
                            setMazeToPlayData(assignedMaze);
                        } else {
                            setMessage(`割り当てられた迷路が見つかりません: ${myState.assignedMazeOwnerId}`);
                        }
                    }
                    
                    // 自分が作成した迷路の読み込み
                    if (data.mazes?.[userId]) {
                        setMyCreatedMazeData(data.mazes[userId]);
                        
                        // 自分の迷路を攻略している相手プレイヤーを探す
                        const challenger = Object.entries(data.playerStates || {})
                            .find(([pid, ps]) => ps.assignedMazeOwnerId === userId && pid !== userId);
                        
                        if (challenger) {
                            setPlayerSolvingMyMaze({ id: challenger[0], ...challenger[1] });
                        } else {
                            setPlayerSolvingMyMaze(null);
                        }
                    }
                } else {
                    console.error("Game document does not exist");
                    setMessage("ゲームが見つかりません。ロビーに戻ります。");
                    setTimeout(() => setScreen('lobby'), 3000);
                }
            },
            (error) => {
                console.error("Error loading game data:", error);
                setMessage("ゲームデータの読み込みに失敗しました。ロビーに戻ります。");
                setTimeout(() => setScreen('lobby'), 3000);
            }
        );
        
        return () => unsubscribe();
    }, [gameId, userId, setScreen, debugMode]);
    
    // デバッグモード時に全プレイヤーの状態を同期
    useEffect(() => {
        if (debugMode && gameData?.playerStates) {
            setDebugPlayerStates(gameData.playerStates);
        }
    }, [debugMode, gameData?.playerStates]);

    // プレイヤー切り替え時に迷路データを更新
    useEffect(() => {
        if (debugMode && gameData?.mazes) {
            setDebugMazeData(gameData.mazes);
        }
    }, [debugMode, gameData?.mazes, debugCurrentPlayerId]);
    
    // システムチャットメッセージ送信
    const sendSystemChatMessage = useCallback(async (text) => {
        if (!gameId) return;
        const chatCollRef = collection(db, `artifacts/${appId}/public/data/labyrinthGames/${gameId}/chatMessages`);
        try {
            await addDoc(chatCollRef, { 
                senderId: "system", 
                senderName: "システム", 
                text: text, 
                timestamp: serverTimestamp() 
            });
        } catch (error) { 
            console.error("Error sending system chat message:", error); 
        }
    }, [gameId]);
    
    // ゲーム解散処理
    const handleGameExit = async () => {
        try {
            const gameDocRef = doc(db, `artifacts/${appId}/public/data/labyrinthGames`, gameId);
            
            const playerName = userId.substring(0, 8) + "...";
            
            await updateDoc(gameDocRef, {
                status: 'disbanded',
                disbandReason: `${playerName}が退出したため`,
                disbandedAt: serverTimestamp(),
                disbandedBy: userId
            });
            
            await sendSystemChatMessage(`${playerName}が抜けたのでこのゲームは解散です。`);
            
            localStorage.removeItem('labyrinthGameId');
            localStorage.removeItem('labyrinthGameType');
            
            setScreen('lobby');
            
        } catch (error) {
            console.error("Error disbanding game:", error);
            setMessage("ゲーム解散処理に失敗しました。");
        }
    };
    
    return {
        // 状態
        gameId, setGameId,
        gameData,
        myPlayerState,
        mazeToPlayData,
        myCreatedMazeData,
        playerSolvingMyMaze,
        message, setMessage,
        gameType, setGameType,
        
        // UI状態
        showOpponentWallsDebug, setShowOpponentWallsDebug,
        showHelpOverlay, setShowHelpOverlay,
        showReviewMode, setShowReviewMode,
        showExitConfirmDialog, setShowExitConfirmDialog,
        
        // バトル状態
        isBattleModalOpen, setIsBattleModalOpen,
        battleOpponentId, setBattleOpponentId,
        
        // 移動状態
        isMoving, setIsMoving,
        hitWalls, setHitWalls,
        
        // モーダル状態
        isGameOverModalOpen, setIsGameOverModalOpen,
        
        // デバッグ状態
        debugCurrentPlayerId, setDebugCurrentPlayerId,
        debugPlayerStates,
        debugMazeData,
        
        // 計算されたプロパティ
        effectiveUserId,
        effectivePlayerState,
        isMyStandardTurn,
        inStandardBattleBetting,
        
        // 関数
        sendSystemChatMessage,
        handleGameExit
    };
};
