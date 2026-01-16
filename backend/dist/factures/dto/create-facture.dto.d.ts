export declare class CreateFactureItemDto {
    description: string;
    quantite: number;
    prix_unitaire: number;
}
export declare class CreateFactureDto {
    client_id: string;
    date_emission: string;
    date_echeance?: string;
    taux_tva?: number;
    items: CreateFactureItemDto[];
}
