import { apiClient } from './apiClient.js';
import { Categoria } from '../models/Categoria.js';

// Servicio de categorías: habla con /categorias del backend.

export const categoriasService = {
  async listar() {
    const data = await apiClient.get('/categorias');
    return Categoria.listFromJson(data.categorias);
  }
};
