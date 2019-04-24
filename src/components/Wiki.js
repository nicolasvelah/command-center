import React from 'react'
import '../assets/css/wiki.css'
import ScrollIntoView from 'react-scroll-into-view'

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
      <div id="wiki-container">
        <div id="wiki-indice">
          <div id="indice">
            <ScrollIntoView selector="#operadores">
              <b>Operadores</b>
            </ScrollIntoView>
            <ul>
              <li>
                <ScrollIntoView selector="#url">
                  <b>URL</b>
                </ScrollIntoView>
              </li>
              <li>
                <ScrollIntoView selector="#acceder">
                  <b>Acceder</b>
                </ScrollIntoView>
              </li>
              <li>
                <ScrollIntoView selector="#plantilla">
                  <b>Plantilla</b>
                </ScrollIntoView>
              </li>
              <li>
                <ScrollIntoView selector="#navegacion">
                  <b>Navegación</b>
                </ScrollIntoView>
              </li>
              <li>
                <ScrollIntoView selector="#tablero">
                  <b>Tablero</b>
                </ScrollIntoView>

                <ul>
                  <li>
                    <ScrollIntoView selector="#columnas">
                      <b>Columnas</b>
                    </ScrollIntoView>

                    <ul>
                      <li>
                        <ScrollIntoView selector="#asignados">
                          <b>Asignados</b>
                        </ScrollIntoView>
                      </li>
                      <li>
                        <ScrollIntoView selector="#encurso">
                          <b>En Curso</b>
                        </ScrollIntoView>

                        <ul>
                          <li>
                            <ScrollIntoView selector="#envivo">
                              <b>En vivo</b>
                            </ScrollIntoView>
                          </li>
                          <li>
                            <ScrollIntoView selector="#trabajoenprogreso">
                              <b>Trabajo en progreso</b>
                            </ScrollIntoView>
                          </li>
                          <ul>
                            <li>
                              <ScrollIntoView selector="#going">
                                <b>GOING</b>
                              </ScrollIntoView>
                            </li>
                            <li>
                              <ScrollIntoView selector="#started">
                                <b>STARTED</b>
                              </ScrollIntoView>
                            </li>
                            <li>
                              <ScrollIntoView selector="#finished">
                                <b>FINISHED</b>
                              </ScrollIntoView>
                            </li>
                          </ul>
                          <li>
                            <ScrollIntoView selector="#sinrespuesta">
                              <b>Sin respuesta</b>
                            </ScrollIntoView>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <ScrollIntoView selector="#resueltos">
                          <b>Resueltos</b>
                        </ScrollIntoView>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ScrollIntoView selector="#orden">
                      <b>Orden</b>
                    </ScrollIntoView>
                  </li>
                  <li>
                    <ScrollIntoView selector="#gestiondelaorden">
                      <b>Gestión de la Orden</b>
                    </ScrollIntoView>

                    <ul>
                      <li>
                        <ScrollIntoView selector="#template">
                          <b>Template</b>
                        </ScrollIntoView>
                      </li>
                      <li>
                        <ScrollIntoView selector="#cabecera">
                          <b>Cabecera</b>
                        </ScrollIntoView>
                      </li>
                      <li>
                        <ScrollIntoView selector="#mapa">
                          <b>Mapa</b>
                        </ScrollIntoView>
                      </li>
                      <li>
                        <ScrollIntoView selector="#chats">
                          <b>Chats o zona de contacto</b>
                        </ScrollIntoView>

                        <ul>
                          <li>
                            <ScrollIntoView selector="#guiadecolores">
                              <b>Guía de colores</b>
                            </ScrollIntoView>
                          </li>
                          <li>
                            <ScrollIntoView selector="#chatcliente">
                              <b>Chat Cliente</b>
                            </ScrollIntoView>
                          </li>
                          <li>
                            <ScrollIntoView selector="#chatproveedor">
                              <b>Chat Proveedor</b>
                            </ScrollIntoView>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <ScrollIntoView selector="#notas">
                          <b>Notas</b>
                        </ScrollIntoView>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <ScrollIntoView selector="#buscar">
                  <b>Buscar</b>
                </ScrollIntoView>
              </li>
              <li>
                <ScrollIntoView selector="#creartarea">
                  <b>Crear Tarea</b>
                </ScrollIntoView>
              </li>
              <li>
                <ScrollIntoView selector="#salir">
                  <b>Salir</b>
                </ScrollIntoView>
              </li>
            </ul>
            <ScrollIntoView selector="#supervisores">
              <b>Supervisores</b>
            </ScrollIntoView>
            <ul>
              <li>
                <ScrollIntoView selector="#tablero-supervisor">
                  <b>Tablero</b>
                </ScrollIntoView>
              </li>
              <ul>
                <li>
                  <ScrollIntoView selector="#filtrodeoperadores-supervisor">
                    <b>Filtro de Operadores</b>
                  </ScrollIntoView>
                </li>
                <li>
                  <ScrollIntoView selector="#navegacion-supervisor">
                    <b>Navegación</b>
                  </ScrollIntoView>
                </li>
                <li>
                  <ScrollIntoView selector="#entregas-supervisor">
                    <b>Entregas</b>
                  </ScrollIntoView>
                </li>
                <ul>
                  <li>
                    <ScrollIntoView selector="#filtro-entregas-supervisores">
                      <b>Filtro</b>
                    </ScrollIntoView>
                  </li>
                  <li>
                    <ScrollIntoView selector="#lista-ordenes-supervisores">
                      <b>Lista de órdenes</b>
                    </ScrollIntoView>
                  </li>
                  <ul>
                    <li>
                      <ScrollIntoView selector="#ordenes-supervisores">
                        <b>Órdenes</b>
                      </ScrollIntoView>
                    </li>
                    <li>
                      <ScrollIntoView selector="#acciones-supervisores">
                        <b>Acciones</b>
                      </ScrollIntoView>
                    </li>
                    <ul>
                      <li>
                        <ScrollIntoView selector="#ver-supervisores">
                          <b>Ver</b>
                        </ScrollIntoView>
                      </li>
                      <li>
                        <ScrollIntoView selector="#reabrir-supervisores">
                          <b>Reabrir</b>
                        </ScrollIntoView>
                      </li>
                    </ul>
                  </ul>
                </ul>
                <li>
                  <ScrollIntoView selector="#miequipo-supervisor">
                    <b>Mi equipo</b>
                  </ScrollIntoView>
                </li>
                <ul>
                  <li>
                    <ScrollIntoView selector="#operador-miequipo-supervisor">
                      <b>Operador</b>
                    </ScrollIntoView>
                  </li>
                  <li>
                    <ScrollIntoView selector="#reportesrendimiento-supervisor">
                      <b>Reportes de rendimiento</b>
                    </ScrollIntoView>
                  </li>
                </ul>
              </ul>
            </ul>
          </div>
        </div>
        <div id="wiki-text">
          <div id="wiki-text-operadores">
            <div id="operadores">
              <h2>Operadores</h2>
              <p>
                Este manual es una guía para el correcto uso de la plataforma de
                gestión Multiservicios de ITZAM DEV.
              </p>
            </div>
            <div id="url">
              <h3>1. URL</h3>
              <p>
                Para acceder a la plataforma online, debemos ingresar a la
                pagina <a href="https://cc.itzam.ec">https://cc.itzam.ec</a>
              </p>
              <img
                src={require('../images/wiki/url.png')}
                className="wiki-normal-img"
                alt=""
              />
            </div>
            <div id="acceder">
              <h3>2. Acceder</h3>
              <p>
                Automáticamente nos aparecerá una página de inicio de sesión.
                Aquí pondremos nuestro usuario y contraseña y daremos click en
                el botón Log In
              </p>
              <img
                src={require('../images/wiki/acceder.png')}
                className="wiki-normal-img"
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
                className="wiki-normal-img"
                alt=""
              />
            </div>
            <div id="navegacion">
              <h3>4. Navegación</h3>
              <p>
                Accede aquí a los distintos componentes de la plataforma como:
              </p>
              <div className="wiki-contenedor-componentes">
                <div className="wiki-izquierda">
                  <img
                    src={require('../images/wiki/navegacion.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                </div>
                <div className="wiki-derecha">
                  <p>
                    <b>Buscar: </b>Busca órdenes y sus derivados como clientes,
                    operadores, proveedores.
                  </p>
                  <p>
                    <b>Tablero: </b>Gestiona todas las órdenes asignadas a tu
                    usuario.
                  </p>
                  <p>
                    <b>Crear tarea: </b>Crea órdenes que ingresen vía
                    telefónica.
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
                plataforma. Aquí es donde se da la mayor parte de la gestión de
                órdenes.
              </p>
              <div className="jerarquia-uno">
                <div id="columnas" className="wiki-title">
                  5.1. Columnas
                </div>
                <p>
                  En esta sección gestionaremos las órdenes en base a un tablero
                  Kanban dividido en 3 columnas.
                </p>
                <img
                  src={require('../images/wiki/columnasuno.png')}
                  className="wiki-normal-img"
                  alt=""
                />
                <p>
                  Para gestionar las ordenes solo arrastra y arroja la orden a
                  la columna que desees.
                </p>
                <img
                  src={require('../images/wiki/columnasdos.png')}
                  className="wiki-normal-img"
                  alt=""
                />
                <div className="jerarquia-dos">
                  <div id="asignados" className="wiki-title">
                    I. Asignados
                  </div>
                  <p>
                    En esta columna podrás ver todas las órdenes nuevas
                    asignadas a tu usuario en color blanco.
                  </p>
                  <img
                    src={require('../images/wiki/asignados.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <div id="encurso" className="wiki-title">
                    II. En curso
                  </div>
                  <p>
                    En esta columna debes poner las tareas que te encuentres
                    gestionando. Esta cuenta con 3 subestados:
                  </p>
                  <img
                    src={require('../images/wiki/encurso.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <div className="jerarquia-tres">
                    <div id="envivo" className="wiki-title">
                      1. En vivo
                    </div>
                    <p>
                      Aquí puedes poner las tareas que estés trabajando en vivo,
                      en el momento, con el fin de que puedas organizar tus
                      órdenes de un modo más visual y sencill. Estas tareas
                      estarán en color verde.
                    </p>
                    <img
                      src={require('../images/wiki/envivo.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                    <div id="trabajoenprogreso" className="wiki-title">
                      2. Trabajo en progreso
                    </div>
                    <p>
                      El objetivo de esta columna es que se depositen las
                      órdenes donde el proveedor informe desde su aplicación que
                      ha iniciado el servicio. Toda orden con proveedor asignado
                      mostrará un estado del servicio.
                    </p>
                    <img
                      src={require('../images/wiki/trabajoenprogreso.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                    <div className="jerarquia-cuatro">
                      <div id="going" className="wiki-title">
                        2.1. GOING
                      </div>
                      <p>
                        El estado inicial es{' '}
                        <img src={require('../images/wiki/going.png')} alt="" />{' '}
                        referente a que el proveedor está en camino.
                      </p>
                      <div id="started" className="wiki-title">
                        2.2. STARTED
                      </div>
                      <p>
                        Una vez que el proveedor llega al lugar de atención este
                        informará a través de una acción en la aplicación que a
                        iniciado el servicio en este momento. En este momento
                        <b>
                          dicha orden se moverá automáticamente a la columna
                        </b>
                        WORK IN PROGRESS y el estado del proveedor cambiará a
                        <img
                          src={require('../images/wiki/started.png')}
                          alt=""
                        />
                        .
                      </p>
                      <div id="finished" className="wiki-title">
                        2.3. FINISHED
                      </div>
                      <p>
                        Una vez que el proveedor ha terminado su atención este
                        informará a través de una acción en la aplicación que el
                        servicio concluyó y la orden cambiará su estado a{' '}
                        <img
                          src={require('../images/wiki/finished.png')}
                          alt=""
                        />
                        .
                      </p>
                    </div>
                    <div id="sinrespuesta" className="wiki-title">
                      3. Sin respuesta
                    </div>
                    <p>
                      Esta columna está destinada para aquellas tareas donde se
                      ha tenido inconvenientes para contactar con el cliente
                      reiteradas veces. Dichas tareas no pueden ser cerradas
                      mientras no se verifique que el servicio concluyó por lo
                      que para una mejor organización puedes utilizar esta
                      columna para apartar aquellas órdenes que requieran
                      esperar un poco para atenderlas por cualquier motivo.
                    </p>
                    <img
                      src={require('../images/wiki/sinrespuesta.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                  </div>
                  <div id="resueltos" className="wiki-title">
                    III. Resueltos
                  </div>
                  <p>
                    En esta columna se pondrán todas las órdenes que queremos
                    concluir. Es importante saber que{' '}
                    <b>
                      el operador tiene el control sobre las 2 aplicaciones de
                      los actores de las órdenes
                    </b>
                    , por lo que una vez{' '}
                    <b>
                      la orden pase a estado resuelto las aplicaciones de
                      clientes y proveedores serán liberadas
                    </b>{' '}
                    . Se solicitará al cliente la{' '}
                    <b>calificación del servicio</b> y permitirá el ingreso de
                    una nueva orden tanto para el cliente como para el
                    proveedor.
                  </p>
                  <p>
                    <b>IMPORTANTE:</b> Mientras las órdenes se encuentren en
                    cualquiera de las otras columnas que no sea Resueltos, las
                    aplicaciones no podrán ingresar o recibir nuevas órdenes. La
                    liberación de las mismas está en las manos de los
                    operadores.
                  </p>
                </div>
                <p>
                  Utiliza las columnas para organizar mejor tu trabajo, según
                  tus necesidades. Se libre de mover las órdenes para dar una
                  mejor gestión y servicio al cliente.
                </p>
                <div id="orden" className="wiki-title">
                  5.2. Orden
                </div>
                <p>
                  Las órdenes son bloques de información donde podrás ver datos
                  del cliente y proveedor y accionar para resolver sus
                  problemas. Puedes arrastrarlas a cualquier columna para
                  cambiar su estado.
                </p>
                <p>El contenido de la orden es:</p>
                <img
                  src={require('../images/wiki/ordenuno.png')}
                  className="wiki-normal-img"
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
                        className="wiki-normal-img"
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
                  Al dar click sobre una orden se abrirá una ventana donde
                  podremos gestionar el pedido y contactar con los actores de la
                  orden.
                </p>
                <div id="gestiondelaorden" className="wiki-title">
                  5.3. Gestión de la Orden
                </div>
                <div className="jerarquia-dos">
                  <div id="template" className="wiki-title">
                    5.3.1. Template
                  </div>
                  <p>
                    Al Dar click sobre cualquier orden se abrirá la ventana de
                    gestión:
                  </p>
                  <img
                    src={require('../images/wiki/template.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <div id="cabecera" className="wiki-title">
                    5.3.2. Cabecera
                  </div>
                  <img src={require('../images/wiki/cabecera.png')} alt="" />
                  <div className="wiki-title">Detalle</div>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img
                            src={require('../images/wiki/cerraricon.png')}
                            alt=""
                          />
                        </td>
                        <td>
                          Cierra la orden y regresa al tablero de gestión.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            src={require('../images/wiki/911icon.png')}
                            alt=""
                          />
                        </td>
                        <td>
                          Asigna una orden a un usuario del 911 (Solo disponible
                          para México).
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
                          Nombre del servicio solicitado por el cliente, país y
                          ciudad de la solicitud.
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
                          El estado de la orden referente a la columna en la que
                          se encuentra en el tablero.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div id="mapa" className="wiki-title">
                    5.3.3. Mapa
                  </div>
                  <img
                    src={require('../images/wiki/mapauno.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <p>
                    Haz seguimiento en vivo de los actores de la orden. Una
                    orden puede tener de dos a tres puntos en el mapa que son:
                  </p>
                  <div className="jerarquia-tres">
                    <p>1. La ubicación de la solicitud de la orden.</p>
                    <img src={require('../images/wiki/mapados.png')} alt="" />
                    <p>
                      2. La ubicación del cliente en vivo (El cliente debe tener
                      su aplicación activa para poder hacer seguimiento de su
                      movimiento).
                    </p>
                    <img src={require('../images/wiki/mapatres.png')} alt="" />
                    <p>
                      3. La ubicación del proveedor en vivo (El proveedor debe
                      tener su aplicación activa para poder hacer seguimiento de
                      su movimiento).
                    </p>
                    <img
                      src={require('../images/wiki/mapacuatro.png')}
                      alt=""
                    />
                  </div>
                  <p>
                    Colapsa el mapa con el botón{' '}
                    <img src={require('../images/wiki/chat2icon.png')} alt="" />{' '}
                    si no lo necesitas.
                  </p>
                  <div id="chats" className="wiki-title">
                    5.3.4. Chats o zona de contacto
                  </div>
                  <p>
                    En esta sección puedes acceder o editar la información de
                    los actores así como enviarles mensajes vía chat a la
                    aplicación o ejecutar una llamada a los mismos.
                  </p>
                  <img
                    src={require('../images/wiki/chat1.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <div className="jerarquia-tres">
                    <div id="guiadecolores" className="wiki-title">
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
                      className="wiki-normal-img"
                      alt=""
                    />
                    <div id="chatcliente" className="wiki-title">
                      5.3.4.2. Chat Cliente
                    </div>
                    <p>
                      Sección ubicada al lado izquierdo. El nombre del cliente
                      siempre estará de color{' '}
                      <span style={clienteStyle}>Celeste</span>.
                    </p>
                    <img
                      src={require('../images/wiki/chat3.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                    <div className="jerarquia-cuatro">
                      <p>
                        1. Envía un mensaje al cliente ingresando texto y
                        presionando ENTER o dando click sobre el icono{' '}
                        <img
                          src={require('../images/wiki/chat1icon.png')}
                          alt=""
                        />
                        .
                      </p>
                      <img
                        src={require('../images/wiki/chat4.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                      <p>
                        2. Despliega la sección de información y edición de
                        datos del cliente dando click sobre el ícono{' '}
                        <img
                          src={require('../images/wiki/chat2icon.png')}
                          alt=""
                        />{' '}
                        si hace falta puedes editarla y guardarla.
                      </p>
                      <img
                        src={require('../images/wiki/chat5.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                      <p>3. Ejecuta la llamada dando click sobre el ícono.</p>
                      <img
                        src={require('../images/wiki/chat6.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                    </div>
                    <div id="chatproveedor" className="wiki-title">
                      5.3.4.3. Chat Proveedor
                    </div>
                    <p>
                      Sección ubicada al lado derecho. El nombre del proveedor
                      siempre estará de color{' '}
                      <span style={proveedorStyle}>Naranja</span>.
                    </p>
                    <img
                      src={require('../images/wiki/chatp1.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                    <div className="jerarquia-cuatro">
                      <p>
                        4. Envía un mensaje al proveedor ingresando texto y
                        presionando ENTER o dando click sobre el icono{' '}
                        <img
                          src={require('../images/wiki/chat1icon.png')}
                          alt=""
                        />
                        .
                      </p>
                      <img
                        src={require('../images/wiki/chatp2.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                      <p>
                        5. Despliega la sección de información de datos del
                        proveedor dando click sobre el ícono{' '}
                        <img
                          src={require('../images/wiki/chat2icon.png')}
                          alt=""
                        />
                        .
                      </p>
                      <img
                        src={require('../images/wiki/chatp3.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                      <p>6. Ejecuta la llamada dando click sobre el ícono.</p>
                      <img
                        src={require('../images/wiki/chat6.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                      <p>
                        7. Reasigna la orden a otro Proveedor dando click sobre
                      </p>
                      <img
                        src={require('../images/wiki/chatp1icon.png')}
                        alt=""
                      />
                      <p>y llenando el formulario de reasignación.</p>
                      <img
                        src={require('../images/wiki/chatp4.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                    </div>
                  </div>
                  <div id="notas" className="wiki-title">
                    5.3.5. Notas
                  </div>
                  <p>
                    Añade aquí las notas que consideres necesarias con relación
                    a la orden. A esta información sólo tendrá acceso el
                    operador que añadió la nota y su supervisor.
                  </p>
                  <img
                    src={require('../images/wiki/nota.png')}
                    className="wiki-normal-img"
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
                Al dar click en el botón buscar nos abrirá una nueva ventana
                donde podemos buscar entre órdenes, clientes, proveedores u
                operadores.
              </p>
              <img
                src={require('../images/wiki/buscar.png')}
                className="wiki-normal-img"
                alt=""
              />
            </div>
            <div id="creartarea">
              <h3>
                7. Crear Tarea
                <img src={require('../images/wiki/agregaricon.png')} alt="" />
              </h3>
              <p>
                Podremos crear tareas al dar click en el botón agregar. Las
                tareas creadas desde este formulario serán automáticamente
                asignadas a tu usuario y podrás verlas de inmediato en el
                tablero en la columna de asignados.
              </p>
              <img
                src={require('../images/wiki/agregar.png')}
                className="wiki-normal-img"
                alt=""
              />
            </div>
            <div id="salir">
              <h3>
                8. Salir
                <img src={require('../images/wiki/saliricon.png')} alt="" />
              </h3>
              <p>
                Al dar click en el botón terminaremos la sesión y regresaremos a
                la página de inicio de sesión.
              </p>
            </div>
          </div>
          <div id="wiki-text-supervisores">
            <div id="supervisores">
              <h2>SUPERVISORES</h2>
              <p>
                El User Supervisor cuenta con las mismas funciones que un
                Operador con algunas herramientas adicionales de monitoreo, por
                lo que todo supervisor debe entender el user Operador. En esta
                parte detallaremos todas aquellas funciones que no se trataron
                en Operador.
              </p>
            </div>
            <div id="tablero-supervisor">
              <h3>
                1. Tablero
                <img
                  src={require('../images/wiki/tableroIconSupervisor.png')}
                  alt=""
                />
              </h3>
              <p>
                El tablero de supervisor cuenta con una columna extra en el
                tablero que se llama Backlog y que está destinada para todas
                aquellas órdenes que no logren ser asignadas a un operador en
                este caso se debe hacer una asignación manual, sin embargo
                actualmente el sistema siempre asignará a un operador. Por lo
                que no veremos esta función en esta etapa.
              </p>
              <p>
                Otro diferenciador es que el supervisor verá todas las tareas de
                su equipo de operadores en su tablero para poder tener control
                de todo el equipo.
              </p>
              <img
                src={require('../images/wiki/tableroImgSupervisor.png')}
                alt=""
              />
              <div className="jerarquia-uno">
                <div id="filtrodeoperadores-supervisor" className="wiki-title">
                  1. Filtro de Operadores
                </div>
                <p>
                  En esta pequeña sección, podemos filtrar las tareas de nuestro
                  equipo. Por defecto tendremos todas las órdenes a la vista y
                  si pasamos el mouse sobre cada una de ellas, podremos ver su
                  información respectiva.
                </p>
                <img
                  src={require('../images/wiki/filtrooperadoresImgSupervisor1.png')}
                  className="wiki-normal-img"
                  alt=""
                />
                <p>
                  Si damos click en cualquier operador, filtraremos las órdenes
                  del mismo, se activará su respectivo botón{' '}
                  <img
                    src={require('../images/wiki/filtrooperadoresIconSupervisor1.png')}
                    alt=""
                  />{' '}
                  y aparecerá uno nuevo{' '}
                  <img
                    src={require('../images/wiki/filtrooperadoresIconSupervisor2.png')}
                    alt=""
                  />{' '}
                  donde podremos regresar a ver todas las órdenes.
                </p>
                <img
                  src={require('../images/wiki/filtrooperadoresImgSupervisor2.png')}
                  className="wiki-normal-img"
                  alt=""
                />
                <div id="navegacion-supervisor" className="wiki-title">
                  2. Navegación
                </div>
                <p>Los nuevos componente en la navegación serán:</p>
                <div className="wiki-contenedor-componentes">
                  <div className="wiki-izquierda">
                    <img
                      src={require('../images/wiki/navecacionImgSupervisor.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                  </div>
                  <div className="wiki-derecha">
                    <p>
                      <b>Entregas: </b>Todas las órdenes entregadas.
                    </p>
                    <p>
                      <b>Mi equipo: </b>Monitoreo de órdenes del equipo.
                    </p>
                  </div>
                </div>
                <div id="entregas-supervisor" className="wiki-title">
                  3. Entregas
                  <img
                    src={require('../images/wiki/entregasIconSupervisor.png')}
                    alt=""
                  />
                </div>
                <p>
                  Al dar click en el botón Entregas, tendremos una sección con
                  una lista de todas las órdenes que se han entregado.
                </p>
                <img
                  src={require('../images/wiki/entregasImgSupervisor.png')}
                  className="wiki-normal-img"
                  alt=""
                />
                <p>Tendremos varias funcionalidades como:</p>
                <div className="jerarquia-dos">
                  <div id="filtro-entregas-supervisores" className="wiki-title">
                    I. Filtro
                  </div>
                  <p>
                    En esta sección podremos filtrar órdenes por fechas
                    determinadas, por columnas (Id, Categoría, Servicio,
                    Cliente, Proveedor, Operador, Pais, Ciudad) y por una
                    palabra clave.
                  </p>
                  <img
                    src={require('../images/wiki/filtroImgSupervisor1.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <p>
                    Al dar click en Añadir Filtro, tendremos una nueva lista con
                    un indicador que nos indica que nuestro filtro está activo.
                  </p>
                  <img
                    src={require('../images/wiki/filtroImgSupervisor2.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <p>
                    Tendremos la opción de descargarnos toda esta información en
                    un documento Excel.
                  </p>
                  <img
                    src={require('../images/wiki/filtroImgSupervisor3.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <div id="lista-ordenes-supervisores" className="wiki-title">
                    II. Lista de órdenes
                  </div>
                  <p>
                    Aquí podrás observar todas las órdenes que se han hecho
                    según el filtro que esté activo. Por defecto tendrás una
                    lista con todas las órdenes del mes en curso.
                  </p>
                  <img
                    src={require('../images/wiki/listadeordenesImgSupervisor.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <div className="jerarquia-tres">
                    <div id="ordenes-supervisores" className="wiki-title">
                      A. Órdenes
                    </div>
                    <p>
                      Cada orden de la lista está diseccionada por las
                      siguientes columnas:
                    </p>
                    <ul>
                      <li>Id: Identificador de la orden.</li>
                      <li>Fecha: Fecha de la gestión de la orden.</li>
                      <li>Categoría: Categoría de la orden.</li>
                      <li>Servicio: Servicio solicitado.</li>
                      <li>Cliente: Persona quien ha pedido la orden.</li>
                      <li>Proveedor: Entidad que ha atendido la orden.</li>
                      <li>
                        Operador: Operador de nuestro equipo que ha dado
                        seguimiento a la orden.
                      </li>
                      <li>País: País dónde se ha gestionado la orden.</li>
                      <li>Cuidad: Cuidad donde se ha gestionado la orden.</li>
                      <li>
                        Dirección: Dirección donde se ha gestionado la orden.
                      </li>
                    </ul>
                    <img
                      src={require('../images/wiki/operadorImgSupervisor.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                    <div id="acciones-supervisores" className="wiki-title">
                      B. Acciones
                    </div>
                    <p>
                      Existen dos acciones que puedes realizar en cualquier
                      orden.
                    </p>
                    <img
                      src={require('../images/wiki/accionesImgSupervisor.png')}
                      className="wiki-normal-img"
                      alt=""
                    />
                    <div className="jerarquia-cuatro">
                      <div id="ver-supervisores" className="wiki-title">
                        0.1. Ver
                        <img
                          src={require('../images/wiki/verIconSupervisor.png')}
                          alt=""
                        />
                      </div>
                      <p>
                        Muestra todos los datos gestionados relacionados a la
                        orden seleccionada en este espacio ya no se puede
                        modificar o gestionar la orden, solo es un formato
                        visual.
                      </p>
                      <img
                        src={require('../images/wiki/verImgSupervisor.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                      <div id="reabrir-supervisores" className="wiki-title">
                        0.2. Reabrir
                        <img
                          src={require('../images/wiki/reabrirIconSupervisor.png')}
                          alt=""
                        />
                      </div>
                      <p>
                        Al dar click en Reabrir, podrás asignar la orden
                        nuevamente al Tablero a la columna Asignados para que se
                        pueda gestionar.
                      </p>
                      <img
                        src={require('../images/wiki/reabrirImgSupervisor.png')}
                        className="wiki-normal-img"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div id="miequipo-supervisor" className="wiki-title">
                  4. Mi Equipo
                  <img
                    src={require('../images/wiki/miequipoIconSupervisor.png')}
                    alt=""
                  />
                </div>
                <p>
                  Al dar click en Mi equipo, podrás ver el rendimiento de cada
                  operador que conforma tu equipo, como también su rendimiento
                  global.
                </p>
                <img
                  src={require('../images/wiki/miequipoImgSupervisor.png')}
                  className="wiki-normal-img"
                  alt=""
                />
                <div className="jerarquia-tres">
                  <div id="operador-miequipo-supervisor" className="wiki-title">
                    I. Operador
                  </div>
                  <p>
                    En esta sección se podrá ver la información (email y
                    teléfono) y el rendimiento individual de cada operador en
                    una tabla y en un diagrama.
                  </p>
                  <img
                    src={require('../images/wiki/operadorMiequipoImgSupervisor.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <p>
                    Tendrás una tabla con todas las órdenes identificadas con
                    ese operador. Estas órdenes serán divididas en:
                  </p>
                  <ul>
                    <li>Órdenes Asignadas al operador.</li>
                    <li>Órdenes que se encuentran En Curso.</li>
                    <li>Órdenes que ya están Resueltas.</li>
                    <li>El Total de órdenes a cargo del operador.</li>
                  </ul>
                  <img
                    src={require('../images/wiki/operadorMiequipoImgSupervisor2.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <p>
                    Tendras un Diagrama Circular donde se representa las órdenes
                    en proporción de elementos. Al pasar el mouse por cada
                    sección de este, podemos ver el número de órdenes con su
                    porcentaje.
                  </p>
                  <img
                    src={require('../images/wiki/operadorMiequipoImgSupervisor3.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                  <div
                    id="reportesrendimiento-supervisor"
                    className="wiki-title"
                  >
                    II. Reportes de rendimiento
                  </div>
                  <p>
                    Aquí se mostrarán las estadísticas globales de todo tu
                    equipo, con la misma temática de cada operador, incluyendo
                    su propio Diagrama Circular global.
                  </p>
                  <img
                    src={require('../images/wiki/reportesderendimientoImgSupervisor.png')}
                    className="wiki-normal-img"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
