import { FlatList, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import MessageItem from './MessageItem'; // Ensure correct path
import { View } from 'react-native';

const MessageList = ({ messages, currentUser, scrollViewRef }) => {
  const [loading, setLoading] = useState(false);

  return (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => index.toString()} // Unique key for each message
      renderItem={({ item }) => (
        <MessageItem message={item} currentUser={currentUser} />
      )}
      ref={scrollViewRef}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          colors={["#ff6347", "#32cd32", "#1e90ff"]}
          tintColor="#ff6347"
          title="Đang tải..."
          titleColor="#ff6347"
        />
      }
    />
  );
};

export default MessageList;
