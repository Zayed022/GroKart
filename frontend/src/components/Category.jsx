import { Link } from "react-router-dom";

function Categories() {
  const categories = ["Vegetables", "Fruits", "Dairy", "Grocery & Kitchen"];

  return (
    <section className="p-8 text-center">
      <h3 className="text-2xl font-semibold">Shop by Category</h3>
      <div className="flex justify-center gap-6 mt-6">
        {categories.map((category, index) => (
          <Link to={`/category/${encodeURIComponent(category)}`} key={index}>
            <div className="bg-white shadow-md p-4 rounded-lg w-40 cursor-pointer">
              <p className="font-bold">{category}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;
