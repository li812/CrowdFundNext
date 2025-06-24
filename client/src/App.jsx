import React, { useState } from 'react'
import HomeBase from './pages/Home/HomeBase'
import UserBase from './pages/User/UserBase'
import AdminBase from './pages/Admin/AdminBase'

function App() {
  const [userType, setUserType] = useState(null)

  let RenderComponent
  if (userType === 'admin') {
    RenderComponent = AdminBase
  } else if (userType === 'user') {
    RenderComponent = UserBase
  } else {
    RenderComponent = HomeBase
  }

  return (
    <RenderComponent />
  )
}

export default App


