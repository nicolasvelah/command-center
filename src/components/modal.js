import React from 'react'
import '../assets/css/modal.css'

const Modal = ({ closeModal, showModal, children }) => {
  return (
    <div className={showModal ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <button onClick={closeModal} className="modalClose">
          X
        </button>
        {children}
      </section>
    </div>
  )
}

export default Modal
