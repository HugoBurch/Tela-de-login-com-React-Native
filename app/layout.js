import { Stack } from 'expo-router';

// Gerencia o cabeçalho de TODAS as telas do app.
// headerShown: false remove o cabeçalho padrão (nome do arquivo).
export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}