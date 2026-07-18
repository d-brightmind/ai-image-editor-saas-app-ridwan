import React from 'react'
import { AuthGuard } from './settings/auth-guard'

export default function page() {
  return (
    <AuthGuard>
        <div>
          Page
        </div>
    </AuthGuard>
  )
}
