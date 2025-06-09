import React, { useState } from "react"
import api from "../api"
import React, { useState } from 'react';
import '../styles/Form.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function AddUser() {
  const [codigo, setCodigo] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setdescricao] = useState('');
  const [nome, setNome] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Aqui você faz a requisição para a API (exemplo genérico)
    try {
      // Exemplo usando fetch, adapte para sua api
      const response = api.post('/produtos/create', {
        codigo: codigo,
        descricao: descricao,
        precoUnitario: preco,
        nome: nome

      })
    
      const data = response.data


      if (!response.ok) throw new Error(data.message || 'Erro ao criar usuário');

      setMessage(`Usuário ${data.name} criado com sucesso!`);
      setUsername('');
      setSenha('');
    } catch (err) {
      setMessage(`Erro: ${err.message}`);
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
