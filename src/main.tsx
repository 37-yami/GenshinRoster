import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// 在 file:// 协议下，去除 type="module" 的同步 script 可能在 #root div 解析前执行
// 用 DOMContentLoaded 确保 DOM 就绪后再挂载 React
function mount() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
