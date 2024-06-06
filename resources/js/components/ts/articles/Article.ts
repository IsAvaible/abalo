/**
 * Interface for the article object
 */
export default interface Article {
    id: number;
    ab_name: string;
    ab_price: number;
    ab_description: string;
    ab_creator_id: number;
    ab_createdate: Date;
    imagePath: string | null;
}
