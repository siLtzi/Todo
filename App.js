import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';

const STORAGE_KEY = "TODOS";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Error saving data", e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) {
        setTodos(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Error reading data", e);
    }
  };

  const addTodo = () => {
    if (newTodo.length > 0) {
      const updatedTodos = [...todos, { id: Date.now().toString(), text: newTodo }];
      setTodos(updatedTodos);
      storeData(updatedTodos);
      setNewTodo('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.todoItem}>{item.text}</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a todo..."
        value={newTodo}
        onChangeText={setNewTodo}
        onSubmitEditing={addTodo}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  todoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
    fontSize: 18,
  },
  input: {
    padding: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
    fontSize: 18,
  }
});
