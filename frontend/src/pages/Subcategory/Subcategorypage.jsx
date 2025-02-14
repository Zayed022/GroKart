import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Subcategorypage() {
    const {subCategory} = useParams();
    const [products,setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchProducts = async () =>{
            try{
                const response = await fetch(`/api/v1/products/subCategory/${subCategory}`);
                const data = await response.json();

                if(data.message === "Products fetched"){
                    setProducts(data.products);
                }
                else{
                    setProducts([]);
                }

            }catch(error){
                console.log("Error fetching products: ", error);
            }
            finally{
                setLoading(false);
            }
        };
        fetchProducts();
    }, [subCategory])
  return (
    <div>
       <div className="p-8">
            <h2 className="text-2xl font-semibold text-center">Products in {subCategory}</h2>

            {loading ? (
                <p className="text-center text-gray-600 mt-4">Loading products...</p>
            ) : (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="bg-white shadow-md p-4 rounded-lg text-center">
                                {product.image && (
                                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                                )}
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-gray-600">₹{product.price}</p>
                                <button type="submit" className="w-full bg-green-500 text-white p-2 outline-pink-200 text-pink-200  rounded-lg hover:bg-green-600">Add to Cart</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No products found in this subcategory.</p>
                    )}
                </div>
            )}
        </div>
    </div>
  )
}

export default Subcategorypage
