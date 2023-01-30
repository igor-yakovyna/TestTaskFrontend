export interface User extends Editable {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    dateOfBirth: string;
    phoneNumber: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    town: string;
    postalCode: string;
}

export interface Editable {
    isEdit?: boolean;
}