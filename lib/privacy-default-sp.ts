import { LUXURY_PRIVACY_STYLES } from './privacy-luxury-styles';

/** Full styled default privacy policy when no custom HTML is stored (Spanish). */
export const DEFAULT_PRIVACY_POLICY_SP = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Política de privacidad - CheckIn Pro</title>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;600;900&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    ${LUXURY_PRIVACY_STYLES}
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">Mamounia Check-In Services</div>
            <div class="last-updated">Última actualización: 1 de abril de 2026</div>
        </div>
    </header>

    <section class="hero">
        <h1>Política de privacidad</h1>
        <p class="hero-subtitle">Nos tomamos su privacidad en serio. Esta política explica cómo recopilamos, usamos y protegemos sus datos personales cuando utiliza nuestro servicio de registro de huéspedes.</p>
    </section>

    <nav class="toc">
        <div class="toc-grid">
            <a href="#who-we-are" class="toc-item">
                <span class="toc-number">01</span>
                <div class="toc-title">Quiénes somos</div>
                <div class="toc-desc">Datos de la empresa y contacto</div>
            </a>
            <a href="#data-collection" class="toc-item">
                <span class="toc-number">02</span>
                <div class="toc-title">Qué recopilamos</div>
                <div class="toc-desc">Datos personales y de reserva</div>
            </a>
            <a href="#why-collect" class="toc-item">
                <span class="toc-number">03</span>
                <div class="toc-title">Por qué lo recopilamos</div>
                <div class="toc-desc">Base legal del tratamiento</div>
            </a>
            <a href="#how-use" class="toc-item">
                <span class="toc-number">04</span>
                <div class="toc-title">Cómo lo usamos</div>
                <div class="toc-desc">Finalidades del tratamiento</div>
            </a>
            <a href="#retention" class="toc-item">
                <span class="toc-number">05</span>
                <div class="toc-title">Conservación</div>
                <div class="toc-desc">Cuánto tiempo guardamos los datos</div>
            </a>
            <a href="#rights" class="toc-item">
                <span class="toc-number">06</span>
                <div class="toc-title">Sus derechos</div>
                <div class="toc-desc">Acceso, supresión, exportación</div>
            </a>
            <a href="#security" class="toc-item">
                <span class="toc-number">07</span>
                <div class="toc-title">Medidas de seguridad</div>
                <div class="toc-desc">Cómo protegemos sus datos</div>
            </a>
            <a href="#contact" class="toc-item">
                <span class="toc-number">08</span>
                <div class="toc-title">Contacto</div>
                <div class="toc-desc">Consultas y reclamaciones</div>
            </a>
        </div>
    </nav>

    <main class="content">
        <section id="who-we-are" class="section">
            <span class="section-number">01</span>
            <h2>Quiénes somos</h2>
            <p>Mamounia Check-In Services es operado por Mamounia, un proveedor independiente de soluciones digitales de registro de huéspedes para anfitriones de alquileres de corta estancia.</p>
            <p><strong>Datos:</strong></p>
            <ul>
                <li>Operador: Mamounia</li>
                <li>Tipo de negocio: Proveedor de servicios independiente</li>
                <li>Ubicación: Casablanca, Marruecos</li>
                <li>Correo: [correo del administrador]</li>
            </ul>
        </section>

        <section id="data-collection" class="section">
            <span class="section-number">02</span>
            <h2>Qué datos recopilamos</h2>
            <p>Recopilamos distintos tipos de información según sea usted anfitrión o huésped:</p>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tipo de dato</th>
                        <th>Ejemplos</th>
                        <th>Origen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Identificación personal</strong></td>
                        <td>Nombre completo, fecha de nacimiento, nacionalidad, domicilio</td>
                        <td>Formulario del huésped</td>
                    </tr>
                    <tr>
                        <td><strong>Datos de contacto</strong></td>
                        <td>Correo electrónico, teléfono, contacto de emergencia</td>
                        <td>Formulario del huésped</td>
                    </tr>
                    <tr>
                        <td><strong>Documentos de viaje</strong></td>
                        <td>Número de pasaporte/DNI, foto del documento, selfie de verificación</td>
                        <td>Carga en el formulario</td>
                    </tr>
                    <tr>
                        <td><strong>Detalles de la reserva</strong></td>
                        <td>Fechas, alojamiento, número de huéspedes, motivo del viaje</td>
                        <td>Sincronización del calendario del anfitrión</td>
                    </tr>
                    <tr>
                        <td><strong>Información adicional</strong></td>
                        <td>Matrícula del vehículo, peticiones especiales, hora de llegada</td>
                        <td>Formulario (opcional)</td>
                    </tr>
                </tbody>
            </table>

            <div class="highlight-box">
                <p><strong>Datos especiales:</strong> Las fotos de pasaporte o documento de identidad pueden revelar datos sensibles. Las tratamos con su consentimiento explícito y medidas de seguridad reforzadas, incluido el cifrado.</p>
            </div>
        </section>

        <section id="why-collect" class="section">
            <span class="section-number">03</span>
            <h2>Por qué los recopilamos (base legal)</h2>
            <p>De conformidad con el RGPD, todo tratamiento debe basarse en una base legal. Nos apoyamos en:</p>
            
            <ul>
                <li><strong>Ejecución del contrato (art. 6(1)(b)):</strong> Necesitamos su nombre, datos de contacto e información de la reserva para prestar el servicio de registro solicitado.</li>
                
                <li><strong>Obligación legal (art. 6(1)(c)):</strong> Muchas jurisdicciones exigen registrar a los huéspedes ante las autoridades. Recopilamos datos de identidad para ayudar a los anfitriones a cumplir la ley.</li>
                
                <li><strong>Interés legítimo (art. 6(1)(f)):</strong> Contactos de emergencia e información del vehículo para la seguridad del alojamiento.</li>
                
                <li><strong>Consentimiento explícito (art. 9(2)(a)):</strong> Para fotos de documentos y selfies (datos sensibles), solicitamos consentimiento que puede retirar en cualquier momento.</li>
            </ul>
        </section>

        <section id="how-use" class="section">
            <span class="section-number">04</span>
            <h2>Cómo usamos sus datos</h2>
            <p>Utilizamos su información para:</p>
            
            <ul>
                <li><strong>Verificación de identidad:</strong> Relacionar huéspedes con reservas y prevenir fraude</li>
                <li><strong>Comunicación con el anfitrión:</strong> Compartir los datos necesarios con el propietario</li>
                <li><strong>Cumplimiento legal:</strong> Generar informes para autoridades cuando la ley lo exija</li>
                <li><strong>Funcionamiento del servicio:</strong> Instrucciones de llegada, Wi‑Fi, normas de la casa</li>
                <li><strong>Atención al cliente:</strong> Responder consultas e incidencias</li>
                <li><strong>Mejora del servicio:</strong> Análisis agregados y anonimizados cuando sea posible</li>
            </ul>

            <div class="highlight-box">
                <p><strong>No hacemos:</strong> vender sus datos a terceros, usarlos para marketing sin consentimiento ni compartirlos más allá de lo descrito aquí.</p>
            </div>
        </section>

        <section id="retention" class="section">
            <span class="section-number">05</span>
            <h2>Conservación de datos</h2>
            <p>Conservamos los datos solo el tiempo necesario:</p>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Plazo</th>
                        <th>Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Datos de reserva activa</td>
                        <td>Hasta el check-out</td>
                        <td>Prestación del servicio</td>
                    </tr>
                    <tr>
                        <td>Registros de entrada</td>
                        <td>90 días después del check-out</td>
                        <td>Reclamaciones, daños</td>
                    </tr>
                    <tr>
                        <td>Registro de huésped (si es obligatorio)</td>
                        <td>5 años</td>
                        <td>Cumplimiento legal</td>
                    </tr>
                    <tr>
                        <td>Fotos de pasaporte / DNI</td>
                        <td>90 días después del check-out</td>
                        <td>Luego borrado permanente</td>
                    </tr>
                    <tr>
                        <td>Cuentas de anfitriones</td>
                        <td>Hasta eliminar la cuenta</td>
                        <td>Prestación del servicio</td>
                    </tr>
                    <tr>
                        <td>Estadísticas anonimizadas</td>
                        <td>Indefinidamente</td>
                        <td>Mejora (sin identificarle)</td>
                    </tr>
                </tbody>
            </table>

            <p>Tras estos plazos, eliminamos sus datos de forma definitiva o los anonimizamos de modo irreversible.</p>
        </section>

        <section id="rights" class="section">
            <span class="section-number">06</span>
            <h2>Sus derechos (RGPD)</h2>
            <p>Usted tiene, entre otros, los siguientes derechos:</p>
            
            <ul>
                <li><strong>Derecho de acceso:</strong> obtener una copia de sus datos</li>
                <li><strong>Derecho de rectificación:</strong> corregir datos inexactos</li>
                <li><strong>Derecho de supresión:</strong> solicitar el borrado cuando proceda</li>
                <li><strong>Derecho de limitación:</strong> restringir ciertos tratamientos</li>
                <li><strong>Derecho de portabilidad:</strong> recibir sus datos en formato estructurado</li>
                <li><strong>Derecho de oposición:</strong> en particular para tratamientos basados en interés legítimo</li>
                <li><strong>Retirada del consentimiento:</strong> para fotos de documentos en cualquier momento (algunas funciones pueden quedar limitadas)</li>
                <li><strong>Reclamación:</strong> ante la autoridad de protección de datos competente</li>
            </ul>

            <div class="highlight-box">
                <p><strong>Cómo ejercer sus derechos:</strong> escriba a privacy@checkinpro.com o use la configuración de su cuenta. Responderemos en un plazo razonable, normalmente 30 días.</p>
            </div>
        </section>

        <section id="security" class="section">
            <span class="section-number">07</span>
            <h2>Seguridad</h2>
            <p>Aplicamos medidas adecuadas:</p>
            
            <ul>
                <li><strong>Cifrado en tránsito:</strong> HTTPS para la comunicación con nuestros servidores</li>
                <li><strong>Cifrado en reposo:</strong> fotos y datos sensibles protegidos (p. ej. AES-256)</li>
                <li><strong>Controles de acceso:</strong> cada anfitrión solo ve sus propios registros; MFA para administración</li>
                <li><strong>Registros de auditoría:</strong> trazabilidad de accesos y cambios</li>
                <li><strong>Copias de seguridad:</strong> copias cifradas en ubicaciones separadas</li>
                <li><strong>Pruebas de seguridad:</strong> auditorías periódicas</li>
                <li><strong>Notificación de brechas:</strong> información a interesados y autoridades según el RGPD</li>
            </ul>

            <p><strong>Su responsabilidad:</strong> proteja sus credenciales, no comparta su contraseña y cierre sesión en dispositivos compartidos.</p>
        </section>

        <section id="contact" class="section">
            <span class="section-number">08</span>
            <h2>Contacto</h2>
            <p>Si tiene preguntas sobre esta política o desea ejercer sus derechos:</p>
            
            <ul>
                <li><strong>Correo:</strong> privacy@checkinpro.com</li>
                <li><strong>Delegado de protección de datos:</strong> dpo@checkinpro.com</li>
                <li><strong>Correo postal:</strong> [Nombre de la empresa], [Dirección completa]</li>
                <li><strong>Tiempo de respuesta:</strong> procuramos responder en 5 días laborables</li>
            </ul>

            <p><strong>Reclamaciones:</strong> si no está satisfecho con nuestra respuesta, puede presentar una reclamación ante la autoridad de control competente.</p>
            
            <ul>
                <li>Residentes en la UE: autoridad nacional de protección de datos</li>
                <li>Reino Unido: ICO (ico.org.uk)</li>
                <li>Lista de autoridades: edpb.europa.eu</li>
            </ul>

            <div class="highlight-box">
                <p><strong>Actualizaciones:</strong> podemos modificar esta política; los cambios importantes se comunicarán por correo y actualizaremos la fecha en la parte superior de la página.</p>
            </div>
        </section>
    </main>

</body>
</html>`;
