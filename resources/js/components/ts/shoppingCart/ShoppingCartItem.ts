import Article from "../articles/Article";

export default interface ShoppingCartItem {
    id: number;
    ab_shoppingcart_id: number;
    ab_article_id: Article['id'];
    ab_createdate: string;
}

