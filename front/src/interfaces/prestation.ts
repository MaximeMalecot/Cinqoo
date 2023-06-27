import { Category } from "./category";

export interface PrestationItemList {
    image: string;
    name: string;
    revisionNb: number;
    price: number;
    description: string;
    delay: number;
    _id: string;
    createdAt: string;
    isActive: boolean;
    owner: string;
    categories?: Category[];
}

export interface CreatePrestationForm {
    name: string;
    description: string;
    revisionNb?: number;
    delay: number;
    price: number;
    categories: string[];
}

export interface PrestationFormInitData extends CreatePrestationForm {
    image?: string;
}

export interface PrestationFilters {
    query?: string | null;
    price_min?: number | null;
    price_max?: number | null;
    categories?: string[] | null;
}
