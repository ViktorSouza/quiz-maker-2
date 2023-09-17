'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

export function Pagination({
	totalPages,
	currentPage,
	setCurrentPage,
}: {
	totalPages: number
	currentPage: number | string
	setCurrentPage?: (old: number) => void
}) {
	let actualPage = Number(currentPage)
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	return (
		<div className='flex my-10 rounded justify-between items-center'>
			<p className='dark:text-zinc-400'>
				{actualPage} of {Math.max(totalPages - 1, 0)} pages{' '}
			</p>
			<div className='space-x-3'>
				<Button
					variant='outline'
					// className='py-2 px-4 border text-primary dark:border-zinc-900 rounded-md'
					onClick={() => {
						const searchParams1 = new URLSearchParams(searchParams?.toString())
						searchParams1.set('page_number', '' + Math.max(actualPage - 1, 0))
						const url = `${pathname}?${searchParams1}`
						router.replace(url)
					}}>
					Previous
				</Button>
				<Button
					variant='outline'
					// className='py-2 px-4 border text-primary dark:border-zinc-900 rounded-md'
					onClick={() => {
						const searchParams1 = new URLSearchParams(searchParams?.toString())
						searchParams1.set(
							'page_number',
							'' + Math.min(actualPage + 1, totalPages),
						)
						const url = `${pathname}?${searchParams1}`
						router.replace(url)
					}}>
					Next
				</Button>
			</div>
		</div>
	)
}
