import api from "../api";

export async function getRelatorio() {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get("relatorio/movimentacao", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob' 
    });

    // Cria uma URL para o Blob PDF
    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

    // Cria um elemento <a> para download
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = "relatorio-movimentacao.pdf"; // Nome do arquivo baixado
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Libera a URL do objeto após o uso
    window.URL.revokeObjectURL(fileURL);
  } catch (error) {
    console.error('Erro ao buscar relatório:', error.response?.data || error.message);
    throw error;
  }
}