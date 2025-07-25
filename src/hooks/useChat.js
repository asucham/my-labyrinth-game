/**
 * チャット機能のカスタムフック
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../firebase';

export const useChat = (gameId, userId) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    // チャットメッセージを読み込む
    useEffect(() => {
        if (!gameId || !appId) return;
        
        const chatCollRef = collection(db, `artifacts/${appId}/public/data/labyrinthGames/${gameId}/chatMessages`);
        const chatQuery = query(chatCollRef, orderBy('timestamp', 'asc'), limit(50));
        
        const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChatMessages(messages);
        });
        
        return () => unsubscribe();
    }, [gameId, appId]);

    const handleSendChatMessage = useCallback(async () => {
        if (!chatInput.trim() || !gameId) return;
        
        const chatCollRef = collection(db, `artifacts/${appId}/public/data/labyrinthGames/${gameId}/chatMessages`);
        
        try {
            await addDoc(chatCollRef, {
                senderId: userId,
                senderName: userId.substring(0, 8) + "...",
                text: chatInput,
                timestamp: serverTimestamp()
            });
            setChatInput("");
            return { success: true };
        } catch (error) {
            console.error("Error sending chat message:", error);
            return { success: false, error: "メッセージ送信に失敗しました。" };
        }
    }, [chatInput, gameId, userId]);

    return {
        chatMessages,
        chatInput,
        setChatInput,
        handleSendChatMessage
    };
};
