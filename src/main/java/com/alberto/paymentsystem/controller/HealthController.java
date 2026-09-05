package com.alberto.paymentsystem.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
public class HealthController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String healthCheck() {
        return """
               <!DOCTYPE html>
               <html lang="en">
               <head>
                   <meta charset="UTF-8">
                   <title>Auth Service - System Status</title>
                   <style>
                       body {
                           background-color: #121212;
                           color: #00ff00;
                           font-family: 'Courier New', Courier, monospace;
                           padding: 40px;
                           line-height: 1.6;
                       }
                       .container {
                           max-width: 600px;
                           margin: 0 auto;
                           border: 1px solid #333;
                           padding: 20px;
                       }
                       h1 { font-size: 1.2rem; border-bottom: 1px solid #333; padding-bottom: 10px; margin-top: 0; }
                       .status { font-weight: bold; }
                   </style>
               </head>
               <body>
                   <div class="container">
                       <h1>[SYSTEM_INFO] Auth Service</h1>
                       <p>Service Name  : auth-service</p>
                       <p>Status        : <span class="status">ONLINE (UP)</span></p>
                       <p>Timestamp     : %s</p>
                       <p>Protocol      : HTTP/1.1</p>
                   </div>
               </body>
               </html>
               """.formatted(Instant.now().toString());
    }
}
