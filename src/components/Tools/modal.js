import React from 'react'
import '../../assets/css/modal.css'

const Modal = ({ closeModal, showModal, children }) => {
  return (
    <div className={showModal ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <div className="ModalTools">
          <button onClick={closeModal} className="modalClose">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="40"
              viewBox="0 0 768 768"
            >
              <title />
              <g id="icomoon-ignore" />
              <path
                fill="#333"
                d="M672 352.5v63h-453l114 115.5-45 45-192-192 192-192 45 45-114 115.5h453z"
              />
            </svg>
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default Modal
