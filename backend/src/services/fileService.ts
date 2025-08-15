import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import iconv from 'iconv-lite';
import { pathExistsSync } from 'fs-extra';

export const mergeCSV = async (files: string[], targetPath: string) => {
	let mergedRows: any[] = [];
	let header: string[] | null = null;

	for (const fileName of files) {
		const filePath = path.join(targetPath, '\\', fileName);
		if (!await pathExistsSync(filePath)) {
			throw new Error(`檔案路徑有誤或檔案不存在：${filePath}`);
		}

		// 讀成 Buffer，不直接用 'utf8'
		const fileBuffer = fs.readFileSync(filePath);

		let csvText = iconv.decode(fileBuffer, 'utf8');
    if (/�/.test(csvText)) {
      csvText = iconv.decode(fileBuffer, 'big5');
    }
		const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

		if (!header) {
			header = parsed.meta.fields || [];
		}
		mergedRows = mergedRows.concat(parsed.data);
	}

	if (!header) {
		throw new Error('No header found in CSV files');
	}

	// 轉成 CSV 字串
	const csvString = Papa.unparse(mergedRows, { columns: header });

	return iconv.encode(csvString, 'big5');
};

/**
 * 生成唯一檔案名稱
 * @param dir 目標目錄
 * @param filename 初始檔案名稱
 * @returns 唯一的檔案名稱
 */
export const getUniqueFileName = async (dir: string, filename: string) => {
  const ext = path.extname(filename); // 檔案副檔名
	const baseName = path.basename(filename, ext); // 檔案名稱（不含副檔名）
	let uniqueName = filename; // 預設為原始檔名
	let counter = 1;

	// 檢查目標名稱是否已存在
	while (true) {
		const filePath = path.join(dir, uniqueName);
		try {
			await fs.promises.access(filePath); // 如果檔案存在，不會拋出例外
			uniqueName = `${baseName} (${counter})${ext}`; // 生成新的名稱
			counter++;
		} catch {
			// 檔案不存在，跳出迴圈
			break;
		}
	}
	return uniqueName;
};
