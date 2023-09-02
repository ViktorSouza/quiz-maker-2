'use client'
import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { api } from '../lib/utils'

export default function CreateCollection({}) {
	const collectionName = useRef<HTMLInputElement>(null)
	return (
		<>
			<input
				type='text'
				ref={collectionName}
				name='collection-name'
				id='collection-name'
				placeholder='Collection name'
				className='bg-slate-300 rounded-md py-2 px-3'
			/>
			<Button
				onClick={() =>
					api.post('collections', { name: collectionName.current?.value })
				}>
				Create Collection
			</Button>
		</>
	)
}
