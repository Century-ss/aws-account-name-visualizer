import 'webextension-polyfill'
import 'construct-style-sheets-polyfill'
import React from 'react'
import { createRoot } from 'react-dom/client'

const contentRoot = document.createElement('div')
contentRoot.id = 'my-extension-root'
contentRoot.style.display = 'contents'
document.body.append(contentRoot)

const shadowRoot = contentRoot.attachShadow({ mode: 'open' })

const shadowWrapper = document.createElement('div')
shadowWrapper.id = 'root'
shadowWrapper.style.display = 'contents'
shadowRoot.appendChild(shadowWrapper)

createRoot(shadowWrapper).render(
  <React.StrictMode>
    <h2>aa</h2>
  </React.StrictMode>,
)
