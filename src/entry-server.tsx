import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

export function render(url: string, context: any) {
  const helmetContext = {};
  
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url} context={context}>
          <App Router={({ children }: { children: React.ReactNode }) => <>{children}</>} />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  )
  
  // @ts-ignore
  const { helmet } = helmetContext;

  return { html, helmet }
}
