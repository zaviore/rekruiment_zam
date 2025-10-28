import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import { AuthProvider } from '@/contexts/authContext.tsx'
import { JobsProvider } from '@/contexts/jobContext.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <JobsProvider>
        <App />
      </JobsProvider>
    </AuthProvider>,
)
