'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function FinAI({ gamePath }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Welcome to ${
        gamePath === 'job-saving' ? 'Job Saving' : 
        gamePath === 'business-typhoon' ? 'Business Typhoon' : 
        'Early Retirement'
      }! I'm your financial assistant. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    
    let aiResponse = '';

    if (gamePath === 'job-saving') {
      if (input.toLowerCase().includes('save')) {
        aiResponse = "To save effectively, try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.";
      } else if (input.toLowerCase().includes('emi') || input.toLowerCase().includes('loan')) {
        aiResponse = "Ensure EMIs don’t exceed 40% of your income. Consider prepaying high-interest loans.";
      } else {
        aiResponse = "Focus on building an emergency fund, insurance, and long-term investments.";
      }
    } else if (gamePath === 'business-typhoon') {
      if (input.toLowerCase().includes('employee') || input.toLowerCase().includes('hiring')) {
        aiResponse = "Each employee should generate at least 3x their salary in value for the business.";
      } else if (input.toLowerCase().includes('tax')) {
        aiResponse = "Maintain records and consult a tax professional to optimize deductions.";
      } else {
        aiResponse = "Cash flow is king! Maintain 3-6 months of operating expenses as a reserve.";
      }
    } else {
      if (input.toLowerCase().includes('invest')) {
        aiResponse = "For early retirement, save 40-50% of your income and invest in a diversified portfolio.";
      } else if (input.toLowerCase().includes('risk')) {
        aiResponse = "Reduce risk as you near retirement by shifting to stable, income-focused investments.";
      } else {
        aiResponse = "Early retirement requires financial discipline. Consider the 25x rule for expenses.";
      }
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1000);
    
    setInput('');
  };
  
  return (
    <div className="relative">
      {/* AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      >
        <Image src="/ai-assistant.svg" alt="AI Assistant" width={32} height={32} />
      </button>
      
      {/* Chat Interface */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">Financial Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'ai' ? 'text-left' : 'text-right'}`}>
                <div className={`inline-block p-3 rounded-lg ${msg.sender === 'ai' ? 'bg-blue-100' : 'bg-green-100'} max-w-[80%]`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a financial question..."
                className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
