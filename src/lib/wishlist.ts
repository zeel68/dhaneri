import { error } from "console";

export const addToWishList = (product: any) => {
    try {
        localStorage.setItem("wishlistItems", product);
        return true;
    } catch {
        console.log(error);
        return false;
    }

}
export const getWishlist = () => {

}
