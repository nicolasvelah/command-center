import React from 'react'
import '../assets/css/wiki.css'

const clienteStyle = {
  color: '#58D3F7',
}
const proveedorStyle = {
  color: '#FF8000',
}
const soStyle = {
  color: '#00FFBF',
}
export default class Wiki extends React.Component {
  render() {
    return (
      <div className="container">
        <div id="portada">
          <img
            src={require('../images/wiki/itzam.png')}
            className="normal-img"
            alt=""
          />
          <img
            src={require('../images/wiki/commandcenter.png')}
            className="normal-img"
            alt=""
          />
          <div className="div-center">
            <h2>MANUAL DE USUARIO</h2>
          </div>
        </div>
        <div id="indice">
          <a href="#operadores">Operadores</a>
          <ul>
            <li>
              <a href="#url">URL</a>
            </li>
            <li>
              <a href="#acceder">Acceder</a>
            </li>
            <li>
              <a href="#plantilla">Plantilla</a>
            </li>
            <li>
              <a href="#navegacion">Navegación</a>
            </li>
            <li>
              <a href="#tablero">Tablero</a>
              <ul>
                <li>
                  <a href="#columnas">Columnas</a>
                  <ul>
                    <li>
                      <a href="#asignados">Asignados</a>
                    </li>
                    <li>
                      <a href="#encurso">En Curso</a>
                      <ul>
                        <li>
                          <a href="#envivo">En vivo</a>
                        </li>
                        <li>
                          <a href="#trabajoenprogreso">Trabajo en progreso</a>
                        </li>
                        <li>
                          <a href="#going">GOING</a>
                        </li>
                        <li>
                          <a href="#started">STARTED</a>
                        </li>
                        <li>
                          <a href="#finished">FINISHED</a>
                        </li>
                        <li>
                          <a href="#sinrespuesta">Sin respuesta</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#resueltos">Resueltos</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#orden">Orden</a>
                </li>
                <li>
                  <a href="#gestiondelaorden">Gestión de la Orden</a>
                  <ul>
                    <li>
                      <a href="#template">Template</a>
                    </li>
                    <li>
                      <a href="#cabecera">Cabecera</a>
                    </li>
                    <li>
                      <a href="#mapa">Mapa</a>
                    </li>
                    <li>
                      <a href="#chats">Chats o zona de contacto</a>
                      <ul>
                        <li>
                          <a href="#guiadecolores">Guía de colores</a>
                        </li>
                        <li>
                          <a href="#chatcliente">Chat Cliente</a>
                        </li>
                        <li>
                          <a href="#chatproveedor">Chat Proveedor</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#notas">Notas</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="#buscar">Buscar</a>
            </li>
            <li>
              <a href="#creartarea">Crear Tarea</a>
            </li>
            <li>
              <a href="#salir">Salir</a>
            </li>
          </ul>
        </div>
        <div id="operadores">
          <h2 id="operadores">Operadores</h2>
          <p>
            Este manual es una guía para el correcto uso de la plataforma de
            gestión Multiservicios de ITZAM DEV.
          </p>
        </div>
        <div id="url">
          <h3>1. URL</h3>
          <p>
            Para acceder a la plataforma online, debemos ingresar a la pagina{' '}
            <a href="https://cc.itzam.ec">https://cc.itzam.ec</a>
          </p>
          <img
            src={require('../images/wiki/url.png')}
            className="normal-img"
            alt=""
          />
        </div>
        <div id="acceder">
          <h3>2. Acceder</h3>
          <p>
            Automáticamente nos aparecerá una página de inicio de sesión. Aquí
            pondremos nuestro usuario y contraseña y daremos click en el botón
            Log In
          </p>
          <img
            src={require('../images/wiki/acceder.png')}
            className="normal-img"
            alt=""
          />
        </div>
        <div id="plantilla">
          <h3>3. Plantilla</h3>
          <p>
            Al ingresar podremos ver que la plataforma se divide en dos
            secciones:
          </p>
          <ol type="a">
            <li>NAVEGACIÓN</li>
            <li>CONTENIDO</li>
          </ol>
          <img
            src={require('../images/wiki/plantilla.png')}
            className="normal-img"
            alt=""
          />
        </div>
        <div id="navegacion">
          <h3>4. Navegación</h3>
          <p>Accede aquí a los distintos componentes de la plataforma como:</p>
          <div className="contenedor-componentes">
            <div className="izquierda">
              <img
                src={require('../images/wiki/navegacion.png')}
                className="normal-img"
                alt=""
              />
            </div>
            <div className="derecha">
              <p>
                <b>Buscar: </b>Busca órdenes y sus derivados como clientes,
                operadores, proveedores.
              </p>
              <p>
                <b>Tablero: </b>Gestiona todas las órdenes asignadas a tu
                usuario.
              </p>
              <p>
                <b>Crear tarea: </b>Crea órdenes que ingresen vía telefónica.
              </p>
              <p>
                <b>Salir: </b>Termina la sesión activa con tu usuario.
              </p>
            </div>
          </div>
        </div>
        <div id="tablero">
          <h3>
            5. Tablero
            <img src={require('../images/wiki/tableroicon.png')} alt="" />
          </h3>
          <p>
            El tablero es la primera pantalla que verás al ingresar en la
            plataforma, aquí es donde se da la mayor parte de la gestión de
            órdenes.
          </p>
          <div className="jerarquia-uno">
            <div id="columnas" className="title">
              5.1. Columnas
            </div>
            <p>
              En esta sección gestionaremos las órdenes en base a un tablero
              Kanban dividido en 3 columnas.
            </p>
            <img
              src={require('../images/wiki/columnasuno.png')}
              className="normal-img"
              alt=""
            />
            <p>
              Para gestionar las ordenes solo arrastra y arroja la orden a la
              columna que desees.
            </p>
            <img
              src={require('../images/wiki/columnasdos.png')}
              className="normal-img"
              alt=""
            />
            <div className="jerarquia-dos">
              <div id="asignados" className="title">
                I. Asignados
              </div>
              <p>
                En esta columna podrás ver todas las órdenes nuevas asignadas a
                tu usuario en color blanco.
              </p>
              <img
                src={require('../images/wiki/asignados.png')}
                className="normal-img"
                alt=""
              />
              <div id="encurso" className="title">
                II. En curso
              </div>
              <p>
                En esta columna podrás ver todas las órdenes nuevas asignadas a
                tu usuario en color blanco.
              </p>
              <img
                src={require('../images/wiki/encurso.png')}
                className="normal-img"
                alt=""
              />
              <div className="jerarquia-tres">
                <div id="envivo" className="title">
                  1. En vivo
                </div>
                <p>
                  Aquí puedes poner las tareas que estés trabajando en vivo, en
                  el momento, con el fin de que puedas organizar tus órdenes de
                  un modo más visual y sencillo estas tareas estarán en color
                  verde.
                </p>
                <img
                  src={require('../images/wiki/envivo.png')}
                  className="normal-img"
                  alt=""
                />
                <div id="trabajoenprogreso" className="title">
                  2. Trabajo en progreso
                </div>
                <p>
                  El objetivo de esta columna es que se depositen las órdenes
                  donde el proveedor informe desde su aplicación que ha iniciado
                  el servicio, toda orden con proveedor asignada mostrará un
                  estado de acuerdo a estados de la aplicación del proveedor.
                </p>
                <img
                  src={require('../images/wiki/trabajoenprogreso.png')}
                  className="normal-img"
                  alt=""
                />
                <div className="jerarquia-cuatro">
                  <div id="going" className="title">
                    2.1. GOING
                  </div>
                  <p>
                    El estado inicial es{' '}
                    <img src={require('../images/wiki/going.png')} alt="" />{' '}
                    referente a que el proveedor está en camino.
                  </p>
                  <div id="started" className="title">
                    2.2. STARTED
                  </div>
                  <p>
                    Una vez que el proveedor llega al lugar de atención este
                    informará a través de una acción en la aplicación que a
                    iniciado el servicio en este momento
                    <b>dicha orden se moverá automáticamente a la columna</b>
                    WORK IN PROGRESS y el estado del proveedor cambiará a
                    <img src={require('../images/wiki/started.png')} alt="" />.
                  </p>
                  <div id="finished" className="title">
                    2.3. FINISHED
                  </div>
                  <p>
                    Una vez que el proveedor ha terminado su atención este
                    informará a través de una acción en la aplicación que el
                    servicio concluyó y la orden cambiará su estado a{' '}
                    <img src={require('../images/wiki/finished.png')} alt="" />.
                  </p>
                </div>
                <div id="sinrespuesta" className="title">
                  3. Sin respuesta
                </div>
                <p>
                  Esta columna está destinada para aquellas tareas donde se ha
                  tenido inconvenientes para contactar con el cliente reiteradas
                  veces, dichas tareas no pueden ser cerradas mientras no se
                  verifique que el servicio concluyó por lo que para una mejor
                  organización puedes utilizar esta columna para apartar
                  aquellas órdenes que requieran esperar un poco para atenderlas
                  por cualquier motivo.
                </p>
                <img
                  src={require('../images/wiki/sinrespuesta.png')}
                  className="normal-img"
                  alt=""
                />
              </div>
              <div id="resueltos" className="title">
                III. Resueltos
              </div>
              <p>
                En esta columna se pondrán todas las órdenes que queremos
                concluir. Es importante saber que{' '}
                <b>
                  el operador tiene el control sobre las 2 aplicaciones de los
                  actores de las órdenes
                </b>
                , por lo que una vez{' '}
                <b>
                  la orden pase a estado resuelto las aplicaciones de clientes y
                  proveedores serán liberadas
                </b>{' '}
                y se solicitará al cliente el <b>rate del servicio</b> y
                permitirá el ingreso de una nueva orden de ese cliente, así como
                el proveedor podrá recibir una nueva orden.
              </p>
              <p>
                <b>IMPORTANTE:</b> Mientras las órdenes se encuentren en
                cualquiera de las otras columnas que no sea Resueltos las
                aplicaciones no podrán ingresar o recibir nuevas órdenes. Por lo
                que la liberación de las mismas está en las manos de los
                operadores.
              </p>
            </div>
            <p>
              Utiliza las columnas para organizar mejor tu trabajo, según tus
              necesidades. Se libre de mover las órdenes para dar una mejor
              gestión y servicio al cliente.
            </p>
            <div id="orden" className="title">
              5.2. Orden
            </div>
            <p>
              Las órdenes son bloques de información donde podrás ver datos del
              cliente y proveedor y accionar para resolver sus problemas. Puedes
              arrastrarlas a cualquier columna para cambiar su estado.
            </p>
            <p>El contenido de la orden es:</p>
            <img
              src={require('../images/wiki/ordenuno.png')}
              className="normal-img"
              alt=""
            />
            <ol type="a">
              <li>
                Tipo de servicio solicitado. <img src="" alt="" />
              </li>
              <li>Nombre del cliente.</li>
              <li>Nombre del proveedor.</li>
              <li>Fecha y hora del servicio solicitado.</li>
              <li>Ciudad y país de la solicitud.</li>
              <li>
                Estado del servicio solicitado.
                <div>
                  <img
                    src={require('../images/wiki/ordendos.png')}
                    className="normal-img"
                    alt=""
                  />
                </div>
              </li>
              <li>
                Notificaciones de mensajes no leídos.{' '}
                <img src={require('../images/wiki/ordenicon.png')} alt="" />
              </li>
            </ol>
            <p>
              Al dar click sobre una orden se abrirá una ventana donde podremos
              gestionar el pedido y contactar con los actores de la orden.
            </p>
            <div id="gestiondelaorden" className="title">
              5.3. Gestión de la Orden
            </div>
            <div className="jerarquia-dos">
              <div id="template" className="title">
                5.3.1. Template
              </div>
              <p>
                Al Dar click sobre cualquier orden se abrirá la ventana de
                gestión:
              </p>
              <img
                src={require('../images/wiki/template.png')}
                className="normal-img"
                alt=""
              />
              <div id="cabecera" className="title">
                5.3.2. Cabecera
              </div>
              <img src={require('../images/wiki/cabecera.png')} alt="" />
              <div className="title">Detalle</div>
              <table>
                <tr>
                  <td>
                    <img
                      src={require('../images/wiki/cerraricon.png')}
                      alt=""
                    />
                  </td>
                  <td>Cierra la orden y regresa al tablero de gestión.</td>
                </tr>
                <tr>
                  <td>
                    <img src={require('../images/wiki/911icon.png')} alt="" />
                  </td>
                  <td>
                    Asigna una orden a un usuario del 911 (Solo disponible para
                    México).
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src={require('../images/wiki/pasodecorrienteicon.png')}
                      alt=""
                    />
                  </td>
                  <td>
                    Nombre del servicio solicitado por el cliente, país y ciudad
                    de la solicitud.
                  </td>
                </tr>
                <tr>
                  <td>
                    <img
                      src={require('../images/wiki/estadoicon.png')}
                      alt=""
                    />
                  </td>
                  <td>
                    El estado de la orden referente a la columna en la que se
                    encuentra en el tablero.
                  </td>
                </tr>
              </table>
              <div id="mapa" className="title">
                5.3.3. Mapa
              </div>
              <img
                src={require('../images/wiki/mapauno.png')}
                className="normal-img"
                alt=""
              />
              <p>
                Haz seguimiento en vivo de los actores de la orden. Una orden
                puede tener de dos a tres puntos en el mapa que son:
              </p>
              <div className="jerarquia-tres">
                <p>1. La ubicación de la solicitud de la orden.</p>
                <img src={require('../images/wiki/mapados.png')} alt="" />
                <p>
                  2. La ubicación del cliente en vivo (El cliente debe tener su
                  aplicación activa para poder hacer seguimiento de su
                  movimiento).
                </p>
                <img src={require('../images/wiki/mapatres.png')} alt="" />
                <p>
                  3. La ubicación del proveedor en vivo (El proveedor debe tener
                  su aplicación activa para poder hacer seguimiento de su
                  movimiento).
                </p>
                <img src={require('../images/wiki/mapacuatro.png')} alt="" />
              </div>
              <p>
                Colapsa el mapa con el botón{' '}
                <img src={require('../images/wiki/chat2icon.png')} alt="" /> si
                no lo necesitas.
              </p>
              <div id="chats" className="title">
                5.3.4. Chats o zona de contacto
              </div>
              <p>
                En esta sección puedes acceder o editar la información de los
                actores así como enviarles mensajes vía chat a la aplicación o
                ejecutar una llamada a los mismos.
              </p>
              <img
                src={require('../images/wiki/chat1.png')}
                className="normal-img"
                alt=""
              />
              <div className="jerarquia-tres">
                <div id="guiadecolores" className="title">
                  5.3.4.1. Guía de colores
                </div>
                <br />
                <span style={clienteStyle}>Cliente</span>
                <br />
                <span style={proveedorStyle}>Proveedor</span>
                <br />
                <span style={soStyle}>Supervisor - Operador</span>
                <br />
                <img
                  src={require('../images/wiki/chat2.png')}
                  className="normal-img"
                  alt=""
                />
                <div id="chatcliente" className="title">
                  5.3.4.2. Chat Cliente
                </div>
                <p>
                  Sección ubicada al lado izquierdo. El nombre del cliente
                  siempre estará de color{' '}
                  <span style={clienteStyle}>Celeste</span>.
                </p>
                <img
                  src={require('../images/wiki/chat3.png')}
                  className="normal-img"
                  alt=""
                />
                <div className="jerarquia-cuatro">
                  <p>
                    1. Envía un mensaje al cliente ingresando texto y
                    presionando ENTER o dando click sobre el icono{' '}
                    <img src={require('../images/wiki/chat1icon.png')} alt="" />
                    .
                  </p>
                  <img
                    src={require('../images/wiki/chat4.png')}
                    className="normal-img"
                    alt=""
                  />
                  <p>
                    2. Despliega la sección de información y edición de datos
                    del cliente dando click sobre el ícono{' '}
                    <img src={require('../images/wiki/chat2icon.png')} alt="" />{' '}
                    si hace falta puedes editarla y guardarla.
                  </p>
                  <img
                    src={require('../images/wiki/chat5.png')}
                    className="normal-img"
                    alt=""
                  />
                  <p>3. Ejecuta la llamada dando click sobre el ícono.</p>
                  <img
                    src={require('../images/wiki/chat6.png')}
                    className="normal-img"
                    alt=""
                  />
                </div>
                <div id="chatproveedor" className="title">
                  5.3.4.3. Chat Proveedor
                </div>
                <p>
                  Sección ubicada al lado derecho. El nombre del proveedor
                  siempre estará de color{' '}
                  <span style={proveedorStyle}>Naranja</span>.
                </p>
                <img
                  src={require('../images/wiki/chatp1.png')}
                  className="normal-img"
                  alt=""
                />
                <div className="jerarquia-cuatro">
                  <p>
                    4. Envía un mensaje al proveedor ingresando texto y
                    presionando ENTER o dando click sobre el icono{' '}
                    <img src={require('../images/wiki/chat1icon.png')} alt="" />
                    .
                  </p>
                  <img
                    src={require('../images/wiki/chatp2.png')}
                    className="normal-img"
                    alt=""
                  />
                  <p>
                    5. Despliega la sección de información de datos del
                    proveedor dando click sobre el ícono{' '}
                    <img src={require('../images/wiki/chat2icon.png')} alt="" />
                    .
                  </p>
                  <img
                    src={require('../images/wiki/chatp3.png')}
                    className="normal-img"
                    alt=""
                  />
                  <p>6. Ejecuta la llamada dando click sobre el ícono.</p>
                  <img
                    src={require('../images/wiki/chat6.png')}
                    className="normal-img"
                    alt=""
                  />
                  <p>7. Reasigna la orden a otro Proveedor dando click sobre</p>
                  <img src={require('../images/wiki/chatp1icon.png')} alt="" />
                  <p>y llenando el formulario de reasignación.</p>
                  <img
                    src={require('../images/wiki/chatp4.png')}
                    className="normal-img"
                    alt=""
                  />
                </div>
              </div>
              <div id="notas" className="title">
                5.3.5. Notas
              </div>
              <p>
                Añade aquí las notas que consideres necesarias con relación a la
                orden. A esta información sólo tendrá acceso el operador que
                añadió la nota y su supervisor.
              </p>
              <img
                src={require('../images/wiki/nota.png')}
                className="normal-img"
                alt=""
              />
            </div>
          </div>
        </div>
        <div id="buscar">
          <h3>
            6. Buscar
            <img src={require('../images/wiki/buscaricon.png')} alt="" />
          </h3>
          <p>
            Al dar click en el botón buscar nos abrirá una nueva ventana donde
            podemos buscar entre órdenes, clientes, proveedores u operadores.
          </p>
          <img
            src={require('../images/wiki/buscar.png')}
            className="normal-img"
            alt=""
          />
        </div>
        <div id="creartarea">
          <h3>
            7. Crear Tarea
            <img src={require('../images/wiki/agregaricon.png')} alt="" />
          </h3>
          <p>
            Podremos crear tareas al dar click en el botón agregar. Las tareas
            creadas desde este formulario serán automáticamente asignadas a tu
            usuario y podrás verlas de inmediato en el tablero en la columna de
            asignados.
          </p>
          <img
            src={require('../images/wiki/agregar.png')}
            className="normal-img"
            alt=""
          />
        </div>
        <div id="salir">
          <h3>
            8. Salir
            <img src={require('../images/wiki/saliricon.png')} alt="" />
          </h3>
          <p>
            Al dar click en el botón terminaremos la sesión y regresaremos a la
            página de inicio de sesión.
          </p>
        </div>
      </div>
    )
  }
}
