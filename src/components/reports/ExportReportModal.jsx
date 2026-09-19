import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Download, Printer, FileSpreadsheet } from 'lucide-react';

export const ExportReportModal = ({ isOpen, onClose, onExportCSV, onPrint }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export & Print Report" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Choose an export format to download or print the current filtered hotel analytics report.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Export CSV Card */}
          <div
            onClick={onExportCSV}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <FileSpreadsheet size={36} style={{ color: 'var(--accent-gold)' }} />
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Export CSV</strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Download data spreadsheet (.csv)
            </span>
          </div>

          {/* Print Report Card */}
          <div
            onClick={onPrint}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Printer size={36} style={{ color: '#0369a1' }} />
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Print Report</strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Open clean browser print layout
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
