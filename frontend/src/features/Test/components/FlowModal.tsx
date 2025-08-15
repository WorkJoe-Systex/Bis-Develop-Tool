import Modal from '../../../components/ui/Modal';
import ProcessContent from './StepFlowWithLogs';

interface FlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FlowModal({ isOpen, onClose }: FlowModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="800px"
      height="90vh"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold">🚀 開始執行流程</h2>
        <ProcessContent />
      </div>
    </Modal>
  );
}
