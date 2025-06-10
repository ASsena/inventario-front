import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/Tabela.css";
import ModalMovimentacao from "../components/EnviarMovimentacao";
import AlertaModal from "./AlertaModal";
import ProductModal from "../components/ProductModalPops"; 
import { getRelatorio } from "./relatorio";

function ListaEstoque() {
  const [estoques, setEstoques] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [depositoSelecionado, setDepositoSelecionado] = useState(null);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false); // controle do modal produto
  const [valorTotal, setValorTotal] = useState(null);
  const [produtosBaixos, setProdutosBaixos] = useState([]);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

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
        const produtosEmBaixa = data.filter(item => item.quantidade < 10);
        setProdutosBaixos(produtosEmBaixa);
        if (produtosEmBaixa.length > 0) {
          setMostrarAlerta(true);
        }

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
      {mostrarAlerta && (
        <AlertaModal
          produtosBaixos={produtosBaixos}
          onClose={() => setMostrarAlerta(false)}
        />
      )}
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

      <div className="botoes-deposito" style={{ textAlign: "center", marginBottom: "1rem" }}>
        {depositos.map((dep) => (
          <button
            key={dep.id}
            onClick={async () => {
              setDepositoSelecionado(dep.id);
              try {
                const token = localStorage.getItem("token");
                const response = await api.get(`estoque/valor-total/${dep.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setValorTotal(response.data);
              } catch (error) {
                console.error("Erro ao buscar valor total:", error);
                setValorTotal("Erro");
              }
            }}
            className={`botao-deposito ${dep.id === depositoSelecionado ? "ativo" : ""}`}
            style={{
              margin: "0.25rem",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "none",
              backgroundColor: dep.id === depositoSelecionado ? "#0f4d4d" : "#e0e0e0",
              color: dep.id === depositoSelecionado ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
          >
            {dep.nome}
          </button>
        ))}

        {valorTotal !== null && typeof valorTotal === "number" && (
          <div
            style={{
              marginTop: "1rem",
              backgroundColor: "#f0f8ff",
              padding: "1rem",
              borderRadius: "10px",
              display: "inline-block",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#0f4d4d",
            }}
          >
            Valor total do depósito selecionado: R$ {valorTotal.toFixed(2)}
          </div>
        )}

        {valorTotal === "Erro" && (
          <p style={{ color: "red", marginTop: "1rem" }}>Erro ao buscar valor total.</p>
        )}
      </div>

      <div style={{ textAlign: "right", margin: "1rem" }}>
        <button
          onClick={() => setMostrarAlerta(true)}
          style={{
            backgroundColor: "#e67e22",
            color: "#fff",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Ver produtos em baixa
        </button>
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

      <div style={{ textAlign: "center", marginBottom: "1rem", display: "flex", justifyContent: "center", gap: 16 }}>
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
        <button
          onClick={() => setModalProdutoAberto(true)}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "9999px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Cadastrar Produto
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

      <ProductModal
        open={modalProdutoAberto}
        onClose={() => setModalProdutoAberto(false)}
        onSuccess={() => {
          // Você pode recarregar os produtos/estoques aqui se quiser atualizar a lista automaticamente
        }}
      />

      <button className="btn" onClick={getRelatorio}>
         Relatório
        </button>
      </div>
    
  );
}

export default ListaEstoque;
