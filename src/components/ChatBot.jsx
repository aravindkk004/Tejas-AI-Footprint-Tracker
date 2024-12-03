"use client";
import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // To store chat messages
  const [userMessage, setUserMessage] = useState(""); // Input from user

  const toggleChatBox = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!userMessage.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await axios.post("/api/chat-bot/", { userMessage });
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, there was an issue. Please try again." },
      ]);
    }
    setUserMessage("");
  };

  return (
    <>
      {/* Chatbot Icon */}
      <div
        id="chatbot-icon"
        onClick={toggleChatBox}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          cursor: "pointer",
        }}
      >
        <img
          src="https://i.ibb.co/YpZq7ft/aimen.webp"
          alt="Chatbot"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            boxShadow: "0 6px 10px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.3s",
          }}
        />
      </div>

      {/* Chatbot Box */}
      <div
        id="chatbot-box"
        style={{
          display: isOpen ? "block" : "none",
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "350px",
          height: "500px",
          background: "white",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
          zIndex: 1001,
          transition: "all 0.3s ease",
        }}
      >
        {/* Chatbot Header */}
        <div
          style={{
            background: "linear-gradient(45deg, #ff6f61, #ffbc00)",
            color: "white",
            padding: "15px",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            Chat with Us
          </span>
          <button
            id="chatbot-close"
            onClick={toggleChatBox}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        {/* Chatbot Messages */}
        <div
          id="chatbot-messages"
          style={{
            padding: "15px",
            overflowY: "auto",
            height: "calc(100% - 100px)",
            fontSize: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                background:
                  message.role === "user" ? "#007BFF" : "#f1f1f1",
                color: message.role === "user" ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
                maxWidth: "70%",
              }}
            >
              {message.content}
            </div>
          ))}
        </div>

        {/* Chatbot Input Form */}
        <form
          id="chatbot-form"
          style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ddd",
            background: "#f9f9f9",
          }}
          onSubmit={sendMessage}
        >
          <input
            type="text"
            id="chatbot-input"
            placeholder="Type your message..."
            value={userMessage}
            onChange={handleInputChange}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "25px",
              outline: "none",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#007BFF",
              color: "white",
              border: "none",
              padding: "12px 18px",
              marginLeft: "10px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
