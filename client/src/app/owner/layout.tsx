"use client"

import NavbarOwner from '@/components/owner/NavbarOwner'
import Sidebar from '@/components/owner/Sidebar'
import React, { ReactNode, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useRouter } from 'next/navigation'

const Page = ({children} : {children: ReactNode}) => {

  const isOwner = useAuthStore(state => state.isOwner)
  const router = useRouter();

  useEffect(() => {
    if (isOwner === false) {
      router.push("/")
    }
  }, [isOwner, router])

  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </div>
  )
}

export default Page
