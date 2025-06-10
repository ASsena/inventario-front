import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/ModalMovimentacao.css"; // importando o CSS externo

export default function ModalMovimentacao({
  produtosUnicos,
  depositos,
  onClose,
}) {
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState(0);
  const [origemId, setOrigemId] = useState("");
  const [destinoId, setDestinoId] = useState("");
  const [estoques, setEstoques] = useState([]);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState("");

  useEffect(() => {
    const fetchEstoques = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/estoque/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstoques(res.data);
      } catch (err) {
        alert("Erro ao carregar estoques: " + err.message);
      }
    };

    fetchEstoques();
  }, []);

  const enviarMovimentacao = async () => {
    try {
      const token = localStorage.getItem("token");

      const body = {
        tipo: tipoMovimentacao,
        quantidade: Number(quantidade),
      };

      if (tipoMovimentacao === "TRANSFERENCIA") {
        if (!produtoSelecionado || !origemId || !destinoId) {
          alert("Preencha todos os campos da transferência.");
          return;
        }

        body.produtoId = Number(produtoSelecionado);
        body.origemId = Number(origemId);
        body.destinoId = Number(destinoId);
      } else {
        if (!produtoSelecionado || !estoqueSelecionado) {
          alert("Preencha o produto e o estoque corretamente.");
          return;
        }

        const estoque = estoques.find(
          (e) =>
            e.produtoDTO.id === Number(produtoSelecionado) &&
            e.depositoDTO.id === Number(estoqueSelecionado)
        );

        if (!estoque) {
          alert("Estoque inválido.");
          return;
        }

        body.estoqueId = estoque.depositoDTO.id;
        body.produtoId = estoque.produtoDTO.id;
      }

      await api.post("/movimentacao/cadastrar", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Movimentação realizada com sucesso!");
      onClose();
    } catch (err) {
      alert("Erro ao criar movimentação: " + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Nova Movimentação</h2>

        <div className="form-group">
          <label>Produto:</label>
          <select
            value={produtoSelecionado}
            onChange={(e) => {
              setProdutoSelecionado(e.target.value);
              setEstoqueSelecionado("");
            }}
          >
            <option value="">Selecione</option>
            {produtosUnicos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tipo:</label>
          <select
            value={tipoMovimentacao}
            onChange={(e) => setTipoMovimentacao(e.target.value)}
          >
            <option value="ENTRADA">ENTRADA</option>
            <option value="SAIDA">SAÍDA</option>
            <option value="TRANSFERENCIA">TRANSFERÊNCIA</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantidade:</label>
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        {tipoMovimentacao === "TRANSFERENCIA" ? (
          <>
            <div className="form-group">
              <label>Origem:</label>
              <select
                value={origemId}
                onChange={(e) => setOrigemId(e.target.value)}
              >
                <option value="">Selecione</option>
                {depositos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Destino:</label>
              <select
                value={destinoId}
                onChange={(e) => setDestinoId(e.target.value)}
              >
                <option value="">Selecione</option>
                {depositos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="form-group">
            <label>Depósito (Estoque):</label>
            <select
              value={estoqueSelecionado}
              onChange={(e) => setEstoqueSelecionado(e.target.value)}
            >
              <option value="">Selecione</option>
              {estoques
                .filter((e) => e.produtoDTO.id === Number(produtoSelecionado))
                .map((e) => (
                  <option key={e.depositoDTO.id} value={e.depositoDTO.id}>
                    {e.depositoDTO.nome}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="button-group">
          <button className="btn-confirmar" onClick={enviarMovimentacao}>
            Confirmar
          </button>
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
