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
}

export interface CreatePrestationForm {
    name: string;
    description: string;
    delay: number;
    image: string;
    price: number;
    categories: string[];
}
