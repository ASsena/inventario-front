import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import api from "../api";
import { getRelatorio } from "./relatorio";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
};

export default function ProductModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    codigo: "",
    descricao: "",
    precoUnitario: "",
    nome: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
     const token = localStorage.getItem('token')
      await api.post("/produtos/create", {
        codigo: form.codigo,
        descricao: form.descricao,
        precoUnitario: Number(form.precoUnitario),
        nome: form.nome,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
      setForm({ codigo: "", descricao: "", precoUnitario: "", nome: "" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao cadastrar produto.");
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2}>
          Cadastrar Produto
        </Typography>
        <TextField
          fullWidth
          label="Código"
          name="codigo"
          value={form.codigo}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Descrição"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Preço Unitário"
          name="precoUnitario"
          value={form.precoUnitario}
          onChange={handleChange}
          margin="normal"
          required
          type="number"
          inputProps={{ min: "0", step: "0.01" }}
        />
        {error && (
          <Typography color="error" variant="body2" mt={1}>
            {error}
          </Typography>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </Box>
      
    </Modal>
  );
}