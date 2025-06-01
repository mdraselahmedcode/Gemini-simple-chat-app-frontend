
// using gifted chat


import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, View, StyleSheet, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import axios from 'axios';

// Ignore specific warnings by message
LogBox.ignoreLogs([
  'Warning: Avatar: Support for defaultProps will be removed from function components in a future major release.',
]);

export default function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Assistant',
        },
      },
    ]);
  }, []);

  const sendMessage = async (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0];

    // const isWeb = Platform.OS === 'web';
    // const baseURL = isWeb
    //   ? 'http://localhost:8000/api/chat/generate'
    //   : 'http://192.168.0.108:8000/api/chat/generate';

    
    // send the user text to the server here
    // place your machine ip address instead of : 192.168.0.101
    const baseURL = 'http://192.168.0.103:8000/api/chat/generate'; 

    try {
      const response = await axios.post( baseURL,{ 
        prompt: userMessage.text
      },

      );

      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: response.data.text,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Assistant',
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botMessage])
      );
    } catch (error) {
      console.error('Error fetching response from backend:', error);
    }
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0084ff',
        },
        left: {
          backgroundColor: '#e5e5ea',
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
        },
        left: {
          color: '#000',
        },
      }}
    />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 1,
        borderTopColor: '#e5e5ea',
        backgroundColor: '#fff',
      }}
      primaryStyle={{ alignItems: 'center' }}
    />
  );

  return (
    <View style={styles.container}>
       <Text style={styles.title}>Gemini AI</Text>
      <StatusBar barStyle="dark-content" backgroundColor="#E2F0F2" />
      <GiftedChat
        messages={messages}
        onSend={(messages) => sendMessage(messages)}
        user={{
          _id: 1,
          name: 'You',
        }}
        placeholder="Type your message..."
        showUserAvatar
        alwaysShowSend
        renderUsernameOnMessage
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 6,
    marginTop: 6,
    fontSize: 20,
    
  }
});




