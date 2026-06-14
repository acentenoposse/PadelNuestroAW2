// Calcula el siguiente id numérico para una colección, manteniendo el
// mismo criterio que usaba la versión con archivos JSON (max id + 1).
// Reemplaza a obtenerSiguienteId de utils/db.js.
export async function obtenerSiguienteId(Model) {
  const ultimo = await Model.findOne().sort({ id: -1 }).lean();
  return ultimo ? ultimo.id + 1 : 1;
}
