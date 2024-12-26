const validateCompressRequest = (data: any) => {
    if (!Array.isArray(data.files) || data.files.length === 0) {
      return 'Invalid input: files must be a non-empty array';
    }
    return null; // 無錯誤
  };
  
  module.exports = {
    validateCompressRequest,
  };
  