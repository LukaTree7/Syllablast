import React from 'react';
import './globals.css'; 

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>
      </head>
      <body>
        <header>
          <h1></h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
