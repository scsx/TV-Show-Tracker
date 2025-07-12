// Basic styles for backend pages, when accessed directly.

export function getStatusPageHtml(statusMessage: string, subMessage?: string): string {
  // Same colors as frontend.
  const colors = {
    background: '#2c3440',
    text: '#FFFFFF',
    primary: '#ffff71',
    secondary: '#99aabb'
  }

  return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: ${colors.background};
                color: ${colors.text};
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                text-align: center;
            }
            .main-message {
                font-size: 2.5em;
                margin-bottom: 0.5em;
            }
            .sub-message {
                font-size: 1.2em;
                color: ${colors.secondary};
            }
            .highlight {
                color: ${colors.primary};
                font-weight: bold;
            }
            .note {
                margin-top: 2em;
                font-size: 0.9em;
                color: ${colors.secondary};
            }
        </style>
    </head>
    <body>
        <div>
            <div class="main-message">${statusMessage}</div>
            ${subMessage ? `<div class="sub-message">${subMessage}</div>` : ''}
            <div class="note">This is a status page for the server.</div>
        </div>
    </body>
    </html>
  `
}
