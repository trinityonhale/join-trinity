import { Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function ShowQuestDetail() {

  const navigate = useNavigate();

  const close = () => {
    navigate("/quests");
  }

  return (
    <>
      <Modal opened onClose={close} title="Quest" centered>
        {/* Modal content */}
      </Modal>
    </>
  );
}