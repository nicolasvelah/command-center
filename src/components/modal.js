import React from 'react'
import '../assets/css/modal.css'

const Modal = ({ setModal, showModal, children }) => {
  return (
    <div className={showModal ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        {children}
        <button onClick={setModal}>close</button>
      </section>
    </div>
  )
}

export default Modal
