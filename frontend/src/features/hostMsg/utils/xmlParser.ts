export const parseXML = (xml: string): string[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const items = Array.from(xmlDoc.getElementsByTagName('item')).map(
      (node) => node.textContent || ''
    );
    return items;
  };
  
  export const toXML = (data: string[]): string => {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const items = data.map((item) => `<item>${item}</item>`).join('\n');
    return `${xmlHeader}\n<root>\n${items}\n</root>`;
  };
  