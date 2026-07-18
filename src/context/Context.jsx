import React, { createContext, useState } from 'react'

export const MyContext = createContext()

const Context = ({ children }) => {
  const [num, setNum] = useState(0)
  return (
    <MyContext.Provider value={{ num, setNum }}>
      {children}
    </MyContext.Provider>
  )
}

export default Context