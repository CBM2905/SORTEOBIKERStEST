export interface Award {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
}

export interface RaffleData {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  progress: number;
  tickets_number: number;
  whatsapp_link: string;
  instagram_link: string;
  awards: Award[];
  bannerImage: string;
}
