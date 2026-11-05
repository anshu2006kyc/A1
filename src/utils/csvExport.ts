/**
 * CSV Export utility for AKM Enterprises Admin Console
 * Creates and downloads structured RFC 4180 compliant CSV files with browser download trigger.
 */

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  try {
    const escapeCSV = (val: string | number | null | undefined): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headerLine = headers.map(escapeCSV).join(',');
    const rowLines = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
    const csvContent = `${headerLine}\n${rowLines}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export CSV:', err);
  }
}
