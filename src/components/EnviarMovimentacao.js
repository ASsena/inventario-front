import React, { useState } from "react";
import api from "../api";

export default function ModalMovimentacao({
  produtosUnicos,
  estoques,
  depositos,
  onClose,
}) {
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [tipoMovimentacao, setTipoMovimentacao] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState(0);
  const [origemId, setOrigemId] = useState("");
  const [destinoId, setDestinoId] = useState("");
  const [estoqueId, setEstoqueId] = useState("");

  const enviarMovimentacao = async () => {
  try {
    const token = localStorage.getItem("token");

    const body = {
      tipo: tipoMovimentacao,
      quantidade: Number(quantidade),
    };

    if (tipoMovimentacao === "TRANSFERENCIA") {
      body.produtoId = Number(produtoSelecionado);
      body.origemId = Number(origemId);
      body.destinoId = Number(destinoId);
    } else {
      body.estoqueId = Number(estoqueId);

      // Obter o produtoId automaticamente a partir do estoque selecionado
      const estoqueSelecionado = estoques.find(
        (e) => e.id === Number(estoqueId)
      );
      if (!estoqueSelecionado) {
        alert("Estoque inválido selecionado.");
        return;
      }
      body.produtoId = estoqueSelecionado.produtoDTO.id;
    }

    console.log("JSON enviado:", JSON.stringify(body, null, 2));

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-cyan-900 mb-4">Nova Movimentação</h2>

        <div className="space-y-3">
          <div>
            <label className="block font-medium">Produto:</label>
            <select
              className="w-full border rounded p-2"
              value={produtoSelecionado}
              onChange={(e) => setProdutoSelecionado(e.target.value)}
            >
              <option value="">Selecione</option>
              {produtosUnicos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Tipo:</label>
            <select
              className="w-full border rounded p-2"
              value={tipoMovimentacao}
              onChange={(e) => setTipoMovimentacao(e.target.value)}
            >
              <option value="ENTRADA">ENTRADA</option>
              <option value="SAIDA">SAÍDA</option>
              <option value="TRANSFERENCIA">TRANSFERÊNCIA</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Quantidade:</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded p-2"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>

          {tipoMovimentacao === "TRANSFERENCIA" && (
            <>
              <div>
                <label className="block font-medium">Origem:</label>
                <select
                  className="w-full border rounded p-2"
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

              <div>
                <label className="block font-medium">Destino:</label>
                <select
                  className="w-full border rounded p-2"
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
          )}

          {tipoMovimentacao !== "TRANSFERENCIA" && (
            <div>
              <label className="block font-medium">Estoque:</label>
              <select
                className="w-full border rounded p-2"
                value={estoqueId}
                onChange={(e) => setEstoqueId(e.target.value)}
              >
                <option value="">Selecione</option>
                {estoques
                .filter((e) => e.produtoDTO.id === Number(produtoSelecionado))
                .map((e) => (
                    <option key={e.id} value={e.id}>
                    {e.depositoDTO.nome}
                    </option>
                ))}

              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-cyan-800 hover:bg-cyan-900 text-white px-4 py-2 rounded"
            onClick={enviarMovimentacao}
          >
            Confirmar
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
