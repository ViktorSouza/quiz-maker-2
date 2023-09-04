'use client'
import { ArrowLeft, Link } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
export default function GoBack() {
	const router = useRouter()
	return (
		<button
			className='flex gap-3 items-center'
			onClick={router.back}>
			<ArrowLeft size={16} /> Back
		</button>
	)
}
