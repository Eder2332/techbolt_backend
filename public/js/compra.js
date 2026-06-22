document.addEventListener('DOMContentLoaded', async () => {
  await window.TecboltApp.layoutReady;
  const userMount = document.getElementById('headerUserMount');
  const quoteForm = document.getElementById('quoteForm');
  const proposalModal = document.getElementById('proposalModal');
  const modalCloseButton = document.getElementById('proposalModalClose');
  const modalIconButton = document.getElementById('proposalModalIcon');
  const modalText = document.getElementById('proposalModalText');
  const defaultModalMessage = 'Hemos recibido tu interés y pronto podremos compartirte una propuesta comercial.';

  const openProposalModal = () => {
    if (!proposalModal) {
      return;
    }

    proposalModal.classList.remove('hidden');
    proposalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalText) {
      modalText.textContent = defaultModalMessage;
    }
    modalCloseButton?.focus();
  };

  const closeProposalModal = () => {
    if (!proposalModal) {
      return;
    }

    proposalModal.classList.add('hidden');
    proposalModal.setAttribute('aria-hidden', 'true');
    proposalModal.classList.remove('proposal-modal-card-celebrating');
    document.body.style.overflow = '';
  };

  try {
    const user = await window.TecboltApp.getCurrentUser();

    if (user) {
      window.TecboltApp.syncHeaderForUser(user);
      window.TecboltApp.renderUserBox(user, userMount);
    } else {
      window.TecboltApp.syncHeaderForUser(null);
    }
  } catch (error) {
    console.error('No se pudo cargar la sesión actual:', error.message);
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      openProposalModal();
      quoteForm.reset();
    });
  }

  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeProposalModal);
  }

  if (proposalModal) {
    proposalModal.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
        closeProposalModal();
      }
    });
  }

  if (modalIconButton) {
    modalIconButton.addEventListener('click', () => {
      if (!proposalModal || !modalText) {
        return;
      }

      proposalModal.classList.remove('proposal-modal-card-celebrating');
      void proposalModal.offsetWidth;
      proposalModal.classList.add('proposal-modal-card-celebrating');
      modalText.textContent = 'Gracias por tu interés. Al hacer clic en el icono activaste una confirmación especial.';
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && proposalModal && !proposalModal.classList.contains('hidden')) {
      closeProposalModal();
    }
  });
});
