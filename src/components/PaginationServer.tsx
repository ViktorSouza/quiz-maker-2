import Link from 'next/link'
import React from 'react'
import { cn } from '../lib/utils'
type PaginationServerProps = {
	page: number
	totalPages: number
}
export default function PaginationServer({
	page,
	totalPages,
}: PaginationServerProps) {
	return (
		<div className='flex gap-3 float-right items-center'>
			<span className='text-slate-500'>
				{page + 1} of {totalPages + 1}
			</span>
			<Link
				className={cn(
					'py-2 px-4 border text-primary dark:border-zinc-900 rounded-md',
					{ 'opacity-50': page === totalPages },
				)}
				href={{
					search: `page=${page == 0 ? page : page - 1}`,
				}}>
				Previous
			</Link>
			<Link
				className={cn(
					'py-2 px-4 border text-primary dark:border-zinc-900 rounded-md',
					{ 'opacity-50': page === totalPages },
				)}
				href={{
					search: `page=${page == totalPages ? page : page + 1}`,
				}}>
				Next
			</Link>
		</div>
	)
}
