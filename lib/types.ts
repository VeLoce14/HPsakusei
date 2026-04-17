export type BusinessType = 'salon' | 'clinic' | 'cafe' | 'coaching' | 'school'
export type StyleType = 'simple' | 'natural' | 'stylish'

export type Template = {
  id: string
  businessType: BusinessType
  style: StyleType
  name: string
  thumbnail: string
}

export type Topping = {
  id: string
  name: string
  description: string
  price: number
  note?: string
}

export type SiteEditorContent = {
  heroTitle: string
  heroBody: string
  ctaText: string
  introTitle: string
  introBody: string
}
