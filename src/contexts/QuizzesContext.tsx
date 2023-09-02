import React, { createContext, useContext } from 'react'

export const QuizzesContext = createContext({ quizzes: [] })
export function QuizzesProvider({ children }: { children: React.ReactNode }) {
	return (
		<QuizzesContext.Provider value={{ quizzes: [] }}>
			{children}
		</QuizzesContext.Provider>
	)
}

export const useQuizzes = () => useContext(QuizzesContext)
