export function getEmailTemplate(text) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificación de Checklist</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: #007BFF;
                color: #ffffff;
                text-align: center;
                padding: 15px;
                font-size: 20px;
                font-weight: bold;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333333;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #777777;
                margin-top: 20px;
                padding: 15px;
                border-top: 1px solid #dddddd;
            }
            .footer a {
                color: #007BFF;
                text-decoration: none;
            }
            .footer p {
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Notificación de Checklist</div>
            <div class="content">
                <p>${text}</p>
            </div>
            <div class="footer">
                <p>Este correo fue enviado por <strong>APPDEN</strong>.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
