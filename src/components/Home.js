import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/Tabela.css";
import ModalMovimentacao from "../components/EnviarMovimentacao"; // certifique-se de ter exportado corretamente

function ListaEstoque() {
  const [estoques, setEstoques] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [depositoSelecionado, setDepositoSelecionado] = useState(null);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/estoque/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        const depositosUnicos = Array.from(
          new Map(data.map((item) => [item.depositoDTO.id, item.depositoDTO])).values()
        );

        const produtosUnicos = Array.from(
          new Map(data.map((item) => [item.produtoDTO.id, item.produtoDTO])).values()
        );

        setDepositos(depositosUnicos);
        setProdutos(produtosUnicos);
        setEstoques(data);
        setDepositoSelecionado(depositosUnicos[0]?.id || null);
      } catch (err) {
        setError("Erro ao buscar estoques. " + err.message);
      }
    };

    fetchData();
  }, []);

  const estoquesFiltrados = estoques.filter(
    (item) =>
      item.depositoDTO.id === depositoSelecionado &&
      (item.produtoDTO.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        item.produtoDTO.codigo.includes(filtro))
  );

  return (
    <div className="tabela-container">
      <h2 className="titulo">Inventory Management</h2>

      {error && <p className="status-bar status-error">{error}</p>}

      
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar produto por nome ou código"
          style={{
            padding: "0.5rem 1rem",
            width: "60%",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "1rem",
          }}
        />
      </div>

      <div className="botoes-deposito">
        {depositos.map((dep) => (
          <button
            key={dep.id}
            onClick={() => setDepositoSelecionado(dep.id)}
            className={`botao-deposito ${dep.id === depositoSelecionado ? "ativo" : ""}`}
          >
            {dep.nome}
          </button>
        ))}
      </div>

      <table className="tabela-produtos">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço Unitário</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {estoquesFiltrados.map((item, index) => (
            <tr key={index}>
              <td>{item.produtoDTO.codigo}</td>
              <td>{item.produtoDTO.nome}</td>
              <td>{item.produtoDTO.descricao}</td>
              <td>R$ {item.produtoDTO.precoUnitario.toFixed(2)}</td>
              <td>{item.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => setModalAberto(true)}
          style={{
            backgroundColor: "#0f4d4d",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "9999px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Criar Movimentação
        </button>
      </div>

      {modalAberto && (
        <ModalMovimentacao
          produtosUnicos={produtos}
          estoques={estoques}
          depositos={depositos}
          onClose={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}

export default ListaEstoque;
