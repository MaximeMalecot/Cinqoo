export interface UserData {
    _id: string;
    email: string;
    roles: string[];
    username: string;
}

export interface AccountData {
    _id: string;
    email: string;
    username: string;
    stripeAccountId: string;
    roles: string[];
}

export interface FreelancerData {
    _id: string;
    username: string;
    email: string;
    freelancerProfile: {
        description?: string;
    };
}
