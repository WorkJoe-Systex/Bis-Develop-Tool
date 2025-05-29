import { TiTota } from '../types';

const API_URL = 'http://localhost:3000/api/hostMsg/parse-titota-xml';

export const parseTiTotaData = async (TitaData: string, TotaData: string, TotaName: string, TotaHeader: string, MethodCode: string): Promise<TiTota> => {
  const response = await fetch(`${API_URL}?TitaStr=${TitaData}&TotaStr=${TotaData}&TotaName=${TotaName}&TotaHeader=${TotaHeader}&MCode=${MethodCode}`); // API 路徑

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch files');
  }

  const data = await response.json();
  return data;
}