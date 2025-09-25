import { generateAPIUrl } from "@/utils/api";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { useState } from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function App() {
  const [input, setInput] = useState("");
  const { messages, error, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/api/chat"),
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  if (error) return <Text>{error.message}</Text>;

  const isReady = status === "ready";

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <View
        style={{
          height: "95%",
          display: "flex",
          flexDirection: "column",
          paddingHorizontal: 8,
        }}
      >
        <FlatList
          style={{ flex: 1 }}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item: m }) => (
            <View style={{ marginVertical: 8 }}>
              <View>
                <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                  }
                })}
              </View>
            </View>
          )}
        />

        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{ backgroundColor: "white", padding: 8 }}
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.nativeEvent.text)}
            autoFocus={true}
          />
          <Button
            title={!isReady ? "Carregando..." : "Enviar"}
            disabled={!isReady}
            color={!isReady ? "#cccccc" : undefined}
            onPress={() => {
              sendMessage({ text: input });
              setInput("");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
