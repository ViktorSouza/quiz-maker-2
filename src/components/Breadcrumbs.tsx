import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
export function BreadCrumbs({
	breadCrumbs,
}: {
	breadCrumbs: { name: string; url: string }[]
}) {
	return (
		<div className='flex gap-3'>
			{breadCrumbs.map((breadCrumb, index) => (
				<>
					<div key={breadCrumb.name + breadCrumb.url}>
						<Link
							href={breadCrumb.url}
							className={clsx({
								'font-medium': index === breadCrumbs.length - 1,
								'text-slate-500': index !== breadCrumbs.length - 1,
							})}>
							{breadCrumb.name}
						</Link>
					</div>
					{breadCrumbs.length - 1 !== index && (
						<span className='text-slate-500'>&gt;</span>
					)}
				</>
			))}
		</div>
	)
}
