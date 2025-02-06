import React from 'react'
import SidebarFrame from '../../components/SidebarFrame'


const HomePage = () => {
  return (
    <div className="flex">
      <SidebarFrame />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </main>
    </div>
  )
}

export default HomePage
