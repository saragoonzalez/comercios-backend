const { WebClient } = require('@slack/web-api')

// Instancia del cliente de Slack
const slackToken = process.env.OAUTH_TOKEN
const slackClient = new WebClient(slackToken)

// Función para manejar errores y enviar el mensaje a Slack
async function handleError(error, customMessage = 'Ha ocurrido un error inesperado') {
  try {
    const errorMessage = `${customMessage}: ${error.message || 'Sin detalles'}`
    
    // Enviar el mensaje a Slack
    await slackClient.chat.postMessage({
      channel: '#general',  // Cambia esto al canal que prefieras
      text: `:warning: *Error en el sistema*: ${errorMessage}\n\`\`\`${error.stack || error}\`\`\``,
    })

    console.error(errorMessage, error) // Registro en la consola
  } catch (slackError) {
    console.error('Error enviando notificación a Slack:', slackError)
  }
}

module.exports = handleError
