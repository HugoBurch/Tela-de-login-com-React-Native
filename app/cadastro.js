import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Verifica cada campo e guarda a mensagem de erro de cada um
  function validar() {
    const novosErros = {};

    // Nome: precisa ter pelo menos nome e sobrenome
    const palavras = nome.trim().split(' ').filter((p) => p !== '');
    if (nome.trim() === '') {
      novosErros.nome = 'Informe o nome completo.';
    } else if (palavras.length < 2) {
      novosErros.nome = 'Digite nome e sobrenome.';
    }

    // E-mail: obrigatório e com formato válido
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === '') {
      novosErros.email = 'Informe o e-mail.';
    } else if (!regexEmail.test(email.trim())) {
      novosErros.email = 'E-mail inválido.';
    }

    // Usuário: mínimo de 3 caracteres
    if (usuario.trim() === '') {
      novosErros.usuario = 'Informe o usuário.';
    } else if (usuario.trim().length < 3) {
      novosErros.usuario = 'O usuário deve ter pelo menos 3 caracteres.';
    }

    // Senha: mínimo de 6 caracteres
    if (senha.trim() === '') {
      novosErros.senha = 'Informe a senha.';
    } else if (senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }

    // Confirmar senha: obrigatória e igual à senha
    if (confirmarSenha === '') {
      novosErros.confirmarSenha = 'Confirme a senha.';
    } else if (confirmarSenha !== senha) {
      novosErros.confirmarSenha = 'As senhas não conferem.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // Apaga o erro de um campo quando o usuário volta a digitar nele
  function limparErro(campo) {
    setErros({ ...erros, [campo]: '' });
    setErroGeral('');
  }

  async function handleCadastrar() {
    setSucesso('');
    setErroGeral('');

    if (!validar()) {
      return;
    }

    try {
      // Busca a lista de usuários já cadastrados
      const dados = await AsyncStorage.getItem('usuarios');
      const lista = dados ? JSON.parse(dados) : [];

      // Impede usuário ou e-mail repetido
      const novosErros = {};
      if (
        lista.some(
          (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
        )
      ) {
        novosErros.usuario = 'Este usuário já está em uso.';
      }
      if (
        lista.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      ) {
        novosErros.email = 'Este e-mail já está cadastrado.';
      }
      if (Object.keys(novosErros).length > 0) {
        setErros(novosErros);
        return;
      }

      // Adiciona o novo usuário e salva a lista atualizada
      lista.push({
        nome: nome.trim(),
        email: email.trim(),
        usuario: usuario.trim(),
        senha: senha,
      });
      await AsyncStorage.setItem('usuarios', JSON.stringify(lista));

      setSucesso('Cadastro realizado com sucesso! Redirecionando...');

      // Aguarda 1,5s para o usuário ler a mensagem e volta para o Login
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (e) {
      setErroGeral('Erro ao salvar os dados. Tente novamente.');
    }
  }

  return (
    <View style={styles.container}>
      {/* Parte preta com seta e título */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.seta}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Cadastro</Text>
      </View>

      {/* Parte branca com curva */}
      <ScrollView
        style={styles.formulario}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.campo, erros.nome && styles.campoErro]}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="seu nome"
            value={nome}
            onChangeText={(texto) => {
              setNome(texto);
              limparErro('nome');
            }}
          />
          {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}
        </View>

        <View style={[styles.campo, erros.email && styles.campoErro]}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChangeText={(texto) => {
              setEmail(texto);
              limparErro('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}
        </View>

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

        <View style={[styles.campo, erros.confirmarSenha && styles.campoErro]}>
          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={confirmarSenha}
            onChangeText={(texto) => {
              setConfirmarSenha(texto);
              limparErro('confirmarSenha');
            }}
            secureTextEntry
          />
          {erros.confirmarSenha ? (
            <Text style={styles.erro}>{erros.confirmarSenha}</Text>
          ) : null}
        </View>

        {erroGeral !== '' && <Text style={styles.erroGeral}>{erroGeral}</Text>}
        {sucesso !== '' && <Text style={styles.sucesso}>{sucesso}</Text>}

        <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.link}>Já tem conta? Fazer login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topo: {
    height: 140,
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  seta: {
    color: '#fff',
    fontSize: 26,
    marginRight: 20,
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    flex: 1,
    textAlign: 'center',
    marginRight: 46, // compensa a seta para centralizar o título
  },
  formulario: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  conteudo: {
    padding: 24,
    paddingTop: 36,
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