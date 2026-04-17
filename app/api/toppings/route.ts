import { NextResponse } from 'next/server'
import { TOPPINGS } from '@/data/toppings'

export async function GET() {
  return NextResponse.json({ toppings: TOPPINGS })
}
