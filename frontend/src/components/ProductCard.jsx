import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ product, userId }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button onClick={() => addToCart(userId, product._id)}>Add to Cart</button>
        </div>
    );
};

export default ProductCard;
