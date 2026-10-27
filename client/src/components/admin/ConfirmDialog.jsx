import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirming }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Are you sure?'}>
      <p className="text-sm text-muted mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted hover:text-text transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={confirming}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/90 text-white hover:bg-red-500 transition-colors disabled:opacity-60"
        >
          {confirming ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
