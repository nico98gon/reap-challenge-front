import { Metadata } from 'next'

interface OrganizationPageProps {
  params: { id: string }
}

export const generateMetadata = ({ params }: OrganizationPageProps): Metadata => {
  return {
    title: `Organization ${params.id}`,
    description: `Details about Organization ${params.id}`,
  }
}