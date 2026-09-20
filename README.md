# Telas de Login e Cadastro

Trabalho prático de desenvolvimento mobile com **React Native** e **Expo Router**. O app tem duas telas, **Login** e **Cadastro**, com formulários controlados, validação por campo, navegação entre rotas e persistência local dos usuários.

## Funcionalidades

### Tela de Login (`/`)
- Campos de **usuário** e **senha** (oculta com `secureTextEntry`)
- Validação por campo, com mensagem de erro abaixo de cada um
- Autenticação contra a lista de usuários cadastrados (AsyncStorage)
- Mensagem de erro geral quando usuário ou senha estão incorretos
- Link **"Ainda não tem conta? Cadastre-se"** para a tela de Cadastro

### Tela de Cadastro (`/cadastro`)
- Campos de **nome completo**, **e-mail**, **usuário**, **senha** e **confirmar senha**
- Validação por campo (veja a tabela abaixo)
- Bloqueio de usuário e e-mail duplicados
- Mensagem de confirmação e retorno automático ao Login após o cadastro
- Link **"Já tem conta? Fazer login"** e seta de voltar no topo

## Regras de validação

| Tela | Campo | Regra |
|---|---|---|
| Login | Usuário | Obrigatório |
| Login | Senha | Obrigatória |
| Cadastro | Nome completo | Obrigatório, com nome e sobrenome |
| Cadastro | E-mail | Obrigatório, com formato válido (regex) e único |
| Cadastro | Usuário | Obrigatório, com pelo menos 3 caracteres e único |
| Cadastro | Senha | Obrigatória, com pelo menos 6 caracteres |
| Cadastro | Confirmar senha | Obrigatória e igual à senha |

Os erros aparecem sem uso de `alert`, direto na tela, e somem quando o usuário volta a digitar no campo.

## Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) e [Expo Router](https://docs.expo.dev/router/introduction/)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

## Estrutura do projeto

Dentro da pasta de rotas (`app/` ou `src/app/`):

```
app/
├── _layout.js    -> gerencia o cabeçalho de todas as telas (oculto)
├── index.js      -> tela de Login (rota "/")
└── cadastro.js   -> tela de Cadastro (rota "/cadastro")
```

## Como executar

**Pré-requisitos:** Node.js instalado e o app **Expo Go** no celular (ou um emulador Android/iOS).

```bash
# 1. Clone o repositório
git clone https://github.com/HugoBurch/Tela-de-login-com-React-Native
cd Meu-primeiro-projeto

# 2. Instale as dependências
npm install

# 3. Instale o AsyncStorage (caso ainda não esteja no projeto)
npx expo install @react-native-async-storage/async-storage

# 4. Inicie o projeto (o -c limpa o cache)
npx expo start -c
```

Depois, escaneie o QR Code com o Expo Go ou abra em um emulador.

## Como testar

1. Na tela de Login, tente entrar com qualquer dado. Deve dar erro, pois ainda não há usuários.
2. Clique em **Cadastre-se** e crie uma conta.
3. Você volta ao Login automaticamente. Entre com o usuário e a senha criados.
4. Tente cadastrar o mesmo usuário ou e-mail de novo para ver o erro de duplicidade.

## Conceitos praticados

- Roteamento por arquivos com Expo Router
- Componentização (uma tela = um componente)
- Formulários controlados com `useState`
- Navegação com `useRouter()`
- Layout global com `_layout.js`
- Persistência local com AsyncStorage
- Funções assíncronas com `async/await` e `try/catch`

## Extensões opcionais implementadas

- [x] `_layout.js` para remover os cabeçalhos padrão
- [x] Validação do formato do e-mail com regex
- [x] Campo de confirmar senha no cadastro
- [x] Usuários guardados no AsyncStorage e login validado contra essa lista

## Observação

As senhas são salvas em texto puro no AsyncStorage, o que é aceitável apenas para fins didáticos. Em um app real, seria necessário usar hash e um backend para autenticação.

## Autor

**Hugo Sérgio Burch Siqueira** — [github.com/seu-usuario](https://github.com/hugoburch)