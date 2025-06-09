import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Form.css';
import api from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // hook para redirecionar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('/user/login', {
        username: username,
        password: senha,
      });

      const data = response.data;
      localStorage.setItem('token', data.token);
      console.log(data.token) // salva token

      setMessage(`Bem-vindo, ${data.name || username}!`);
      setUsername('');
      setSenha('');
      navigate('/home'); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao logar';
      setMessage(`Erro: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <p className="titulo">Inventory Management</p>
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="entrar_sair">Entrar</h2>

        <label htmlFor="username">Nome:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite o nome"
          required
        />

        <label htmlFor="senha">Senha:</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite a senha"
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Login'}
        </button>

        <p className="login_register">
          <Link to="/cadastrar" style={{ color: '#2563eb', cursor: 'pointer' }}>
            Meu primeiro acesso
          </Link>
        </p>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
