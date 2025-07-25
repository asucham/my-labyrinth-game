/**
 * チャット機能コンポーネント
 */

import React from 'react';
import { MessageSquare, Send, Swords } from 'lucide-react';

const ChatSection = ({ 
    chatMessages, 
    chatInput, 
    setChatInput, 
    handleSendChatMessage, 
    onShowHelp,
    onShowTemplate, // 発言テンプレート用のハンドラーを追加
    chatLogRef,
    isInBattle = false,
    title = "オープンチャット"
}) => {
    if (isInBattle) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Swords size={20} className="mr-2 text-red-600"/>
                    バトル中 - クローズチャット
                </h4>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-red-600 font-semibold mb-2">⚔️ バトル発生！</p>
                    <p className="text-sm text-red-500">ポイントを賭けてください</p>
                    <p className="text-xs text-gray-500 mt-2">チャットは一時的に利用できません</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-lg font-semibold mb-3 flex items-center">
                <MessageSquare size={20} className="mr-2"/>
                {title}
                <button
                    className="ml-auto text-blue-500 hover:text-blue-700 text-xl focus:outline-none"
                    title="ヘルプ"
                    onClick={onShowHelp}
                >
                    ❓
                </button>
            </h4>
            
            <div 
                ref={chatLogRef} 
                className="bg-gray-50 p-3 rounded-lg h-40 overflow-y-auto text-sm mb-3 border"
            >
                {chatMessages.map(msg => (
                    <div 
                        key={msg.id} 
                        className={`mb-2 ${msg.senderId === 'system' ? 'text-blue-600 font-semibold' : ''}`}
                    >
                        <span className="font-medium">{msg.senderName}:</span> {msg.text}
                    </div>
                ))}
            </div>
            
            <div className="flex space-x-2">
                <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="メッセージを入力..."
                />
                <button 
                    onClick={onShowTemplate || onShowHelp}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg transition-colors"
                    title="発言テンプレート"
                >
                    ❓
                </button>
                <button 
                    onClick={handleSendChatMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    disabled={!chatInput.trim()}
                >
                    <Send size={16}/>
                </button>
            </div>
        </div>
    );
};

export default ChatSection;
