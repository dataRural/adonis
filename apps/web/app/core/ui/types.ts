import type { Data } from '@generated/data'
import type { PropsWithChildren } from 'react'

export type InertiaProps<T = {}> = PropsWithChildren<Data.SharedProps & T>
