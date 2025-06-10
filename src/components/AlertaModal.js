import React from "react";
import "../styles/AlertModal.css"

function AlertaModal({ produtosBaixos, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>⚠️ Produtos em baixa!</h2>
        <ul>
          {produtosBaixos.map((item, index) => (
            <li key={index}>
              {item.produtoDTO.nome} - {item.quantidade} unidades
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default AlertaModal;
