import React, { useState } from 'react';
import api from "../api"
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Form.css';

function AddUser() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // hook de navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('user/create', {
        username: username,
        senha: senha,
      });

      const data = response.data;

      setMessage(`Usuário ${data.name || username} criado com sucesso!`);
      setUsername('');
      setSenha('');
      navigate('/login')
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar usuário';
      setMessage(`Erro: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <p className='titulo'>Inventory Management</p>
      <form className="form" onSubmit={handleSubmit}>
        <h2 className='entrar_sair'>Cadastro</h2>

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
          {isSubmitting ? 'Enviando...' : 'Cadastrar'}
        </button>

        <p className='login_register'>
          <Link to="/login" style={{ color: '#2563eb', cursor: 'pointer' }}>
            Já tenho uma conta
          </Link>
        </p>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default AddUser;
