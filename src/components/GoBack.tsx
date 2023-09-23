'use client'
import { ArrowLeft, Link } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
export default function GoBack() {
	const router = useRouter()
	return (
		<Button
			variant='link'
			onClick={router.back}>
			<ArrowLeft size={16} /> Back
		</Button>
	)
}
