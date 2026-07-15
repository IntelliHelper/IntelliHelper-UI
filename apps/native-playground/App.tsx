import { Component, type ErrorInfo, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemeProvider } from "@intelli/ui-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PlaygroundScreen } from "./src/playground-screen";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Playground crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorRoot}>
          <ScrollView contentContainerStyle={styles.errorContent}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorMessage}>{this.state.error.message}</Text>
            <Text style={styles.errorStack}>
              {this.state.error.stack ?? "No stack available"}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider theme="mono" followSystem>
          <PlaygroundScreen />
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorRoot: {
    flex: 1,
    backgroundColor: "#111",
  },
  errorContent: {
    padding: 24,
    paddingTop: 64,
  },
  errorTitle: {
    color: "#ff6b6b",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  errorMessage: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 16,
  },
  errorStack: {
    color: "#aaa",
    fontSize: 12,
    fontFamily: "monospace",
  },
});
