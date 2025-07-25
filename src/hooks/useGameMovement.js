/**
 * ゲーム移動処理のカスタムフック
 */

import { useState, useCallback } from 'react';
import { doc, runTransaction, serverTimestamp, increment } from 'firebase/firestore';
import { db, appId } from '../firebase';
import { STANDARD_GRID_SIZE } from '../constants';

export const useGameMovement = (gameId, effectiveUserId, effectivePlayerState, mazeToPlayData) => {
    const [isMoving, setIsMoving] = useState(false);
    const [hitWalls, setHitWalls] = useState([]);

    const handleStandardMove = useCallback(async (direction) => {
        if (isMoving) return;
        
        setIsMoving(true);
        
        try {
            const gameDocRef = doc(db, `artifacts/${appId}/public/data/labyrinthGames`, gameId);
            const { r: currentR, c: currentC } = effectivePlayerState.position;
            
            let newR = currentR;
            let newC = currentC;
            
            switch(direction) {
                case 'up': newR--; break;
                case 'down': newR++; break;
                case 'left': newC--; break;
                case 'right': newC++; break;
                default: 
                    setIsMoving(false);
                    return { success: false, message: "無効な方向です" };
            }
            
            const gridSize = mazeToPlayData?.gridSize || STANDARD_GRID_SIZE;
            
            // 境界チェック
            if (newR < 0 || newR >= gridSize || newC < 0 || newC >= gridSize) {
                setTimeout(() => {
                    setIsMoving(false);
                }, 2000);
                return { success: false, message: "失敗しました... (盤外への移動)" };
            }
            
            // 壁チェック
            const walls = mazeToPlayData?.walls || [];
            let hitWallInfo = null;
            
            const isBlocked = walls.some(wall => {
                if (wall.type === 'horizontal') {
                    if (direction === 'up' && wall.r === currentR && wall.c === currentC) {
                        hitWallInfo = wall;
                        return true;
                    }
                    if (direction === 'down' && wall.r === newR && wall.c === newC) {
                        hitWallInfo = wall;
                        return true;
                    }
                } else if (wall.type === 'vertical') {
                    if (direction === 'left' && wall.r === currentR && wall.c === currentC) {
                        hitWallInfo = wall;
                        return true;
                    }
                    if (direction === 'right' && wall.r === currentR && wall.c === newC) {
                        hitWallInfo = wall;
                        return true;
                    }
                }
                return false;
            });
            
            if (isBlocked && hitWallInfo) {
                // 壁に衝突した場合、その壁を記録
                setHitWalls(prev => {
                    const exists = prev.some(w => 
                        w.r === hitWallInfo.r && 
                        w.c === hitWallInfo.c && 
                        w.type === hitWallInfo.type
                    );
                    return exists ? prev : [...prev, hitWallInfo];
                });
                
                setTimeout(() => {
                    setIsMoving(false);
                }, 2000);
                return { success: false, message: "失敗しました... (壁に衝突)" };
            }
            
            // 移動実行
            await runTransaction(db, async (transaction) => {
                const gameDoc = await transaction.get(gameDocRef);
                if (!gameDoc.exists()) throw new Error('ゲームが見つかりません');
                
                const data = gameDoc.data();
                const currentPlayerState = data.playerStates[effectiveUserId];
                
                const updatedPlayerState = {
                    ...currentPlayerState,
                    position: { r: newR, c: newC },
                    revealedCells: {
                        ...currentPlayerState.revealedCells,
                        [`${newR},${newC}`]: true
                    }
                };
                
                // ゴールチェック
                const goalR = gridSize - 1;
                const goalC = gridSize - 1;
                const isGoal = newR === goalR && newC === goalC;
                
                if (isGoal && !currentPlayerState.goalTime) {
                    updatedPlayerState.goalTime = new Date();
                    updatedPlayerState.score = (updatedPlayerState.score || 0) + 100;
                }
                
                transaction.update(gameDocRef, {
                    [`playerStates.${effectiveUserId}`]: updatedPlayerState,
                    currentTurnPlayerId: data.players.find(pid => pid !== effectiveUserId),
                    turnNumber: (data.turnNumber || 1) + 1,
                    lastUpdated: serverTimestamp()
                });
            });
            
            setTimeout(() => {
                setIsMoving(false);
            }, 2000);
            
            return { success: true, message: "成功しました！" };
            
        } catch (error) {
            console.error("移動エラー:", error);
            setTimeout(() => {
                setIsMoving(false);
            }, 2000);
            return { success: false, message: "失敗しました... (エラー発生)" };
        }
    }, [gameId, effectiveUserId, effectivePlayerState, mazeToPlayData, isMoving]);

    return {
        isMoving,
        hitWalls,
        handleStandardMove
    };
};
