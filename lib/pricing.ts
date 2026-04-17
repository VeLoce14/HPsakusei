import { TOPPINGS } from '@/data/toppings'

export const BASE_PLAN_PRICE = 1480

export function calculateMonthlyTotal(enabledToppingIds: string[]) {
  const toppingTotal = TOPPINGS
    .filter((item) => enabledToppingIds.includes(item.id))
    .reduce((acc, item) => acc + item.price, 0)

  return {
    base: BASE_PLAN_PRICE,
    toppings: toppingTotal,
    total: BASE_PLAN_PRICE + toppingTotal
  }
}

export function formatYen(value: number) {
  return `¥${value.toLocaleString('ja-JP')}`
}
