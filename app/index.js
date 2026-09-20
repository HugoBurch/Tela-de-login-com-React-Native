import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Verifica cada campo e guarda a mensagem de erro de cada um
  function validar() {
    const novosErros = {};

    if (usuario.trim() === '') {
      novosErros.usuario = 'Informe o usuário.';
    }

    if (senha.trim() === '') {
      novosErros.senha = 'Informe a senha.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // Apaga o erro de um campo quando o usuário volta a digitar nele
  function limparErro(campo) {
    setErros({ ...erros, [campo]: '' });
    setErroGeral('');
  }

  async function handleEntrar() {
    setSucesso('');
    setErroGeral('');

    if (!validar()) {
      return;
    }

    try {
      // Busca a lista de usuários cadastrados
      const dados = await AsyncStorage.getItem('usuarios');
      const lista = dados ? JSON.parse(dados) : [];

      // Procura um usuário com o mesmo nome de usuário e a mesma senha
      const encontrado = lista.find(
        (u) =>
          u.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
          u.senha === senha
      );

      if (encontrado) {
        setSucesso(`Login realizado com sucesso! Bem-vindo, ${encontrado.nome}.`);
      } else {
        setErroGeral('Usuário ou senha incorretos.');
      }
    } catch (e) {
      setErroGeral('Erro ao acessar os dados. Tente novamente.');
    }
  }

  return (
    <View style={styles.container}>
      {/* Parte preta com a logo */}
      <View style={styles.topo}>
        <View style={styles.logo}>
          <View style={styles.logoBolinha} />
        </View>
      </View>

      {/* Parte branca com curva */}
      <View style={styles.formulario}>
        <Text style={styles.titulo}>Login</Text>

        <View style={[styles.campo, erros.usuario && styles.campoErro]}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="seu usuário"
            value={usuario}
            onChangeText={(texto) => {
              setUsuario(texto);
              limparErro('usuario');
            }}
            autoCapitalize="none"
          />
          {erros.usuario ? (
            <Text style={styles.erro}>{erros.usuario}</Text>
          ) : null}
        </View>

        <View style={[styles.campo, erros.senha && styles.campoErro]}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              limparErro('senha');
            }}
            secureTextEntry
          />
          {erros.senha ? <Text style={styles.erro}>{erros.senha}</Text> : null}
        </View>

        {erroGeral !== '' && <Text style={styles.erroGeral}>{erroGeral}</Text>}
        {sucesso !== '' && <Text style={styles.sucesso}>{sucesso}</Text>}

        <TouchableOpacity style={styles.botao} onPress={handleEntrar}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.link}>Ainda não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topo: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBolinha: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000',
  },
  formulario: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 28,
  },
  campo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    marginBottom: 14,
    elevation: 3, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  campoErro: {
    borderColor: '#dc2626',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 14,
    paddingVertical: 4,
  },
  botao: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 15,
  },
  link: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
  },
  erro: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  erroGeral: {
    color: '#dc2626',
    marginBottom: 8,
  },
  sucesso: {
    color: '#16a34a',
    marginBottom: 8,
  },
});