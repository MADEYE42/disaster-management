'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaTimes } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to toggle chat window
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // System instruction for empathetic and supportive responses
  const systemInstruction = {
    parts: [
      {
        text: 'You are a compassionate and supportive chatbot designed to assist mental health survivors. Provide empathetic, non-judgmental, and encouraging responses. Offer practical advice, coping strategies, and resources for mental health support. Avoid giving medical diagnoses or advice that requires a licensed professional. If the user expresses thoughts of self-harm or suicide, gently encourage them to seek immediate help from a professional or a helpline like the National Suicide Prevention Lifeline at 1-800-273-8255.',
      },
    ],
  };

  // Scroll to the bottom of the chat when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle sending a message and getting a response from Gemini 1.5 Flash
  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast.error('Please enter a message.');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          systemInstruction,
          contents: [
            ...messages.map((msg) => ({
              role: msg.role,
              parts: [{ text: msg.content }],
            })),
            { role: 'user', parts: [{ text: input }] },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessageContent = response.data.candidates[0]?.content?.parts[0]?.text || 'I’m sorry, I couldn’t generate a response. Please try again.';
      const assistantMessage: Message = { role: 'assistant', content: assistantMessageContent };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error calling Gemini 1.5 Flash API:', error.response?.data || error.message);
      toast.error('An error occurred while fetching the response. Please try again.');
      const errorMessage: Message = { role: 'assistant', content: 'I’m sorry, I couldn’t process your request. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Icon Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-500 transition-colors duration-200 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaComment className="text-2xl" />
      </motion.button>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-semibold">Mental Health Support</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="px-4 py-2 text-center text-gray-600 text-xs">
              <p>
                <strong>Disclaimer:</strong> I am a supportive chatbot, not a licensed professional. For help, contact a therapist or the National Suicide Prevention Lifeline at 1-800-273-8255.{' '}
                <a
                  href="https://www.nami.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  Visit NAMI.
                </a>
              </p>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-gray-600 text-sm">
                    <p>Welcome! I’m here to support you. Feel free to share anything on your mind.</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        message.role === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-gray-200 text-gray-600 animate-pulse">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className={`p-2 rounded-lg text-white ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-500'
                  } transition-colors duration-200`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;