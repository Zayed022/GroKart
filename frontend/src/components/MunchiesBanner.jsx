import CategoryHeroBanner from "./CategoryHeroBanner";
import munchies from "../../public/munchies.png"; // your local image or external URL

const MunchiesBanner = () => {
  return (
    <div className="px-4 py-6">
      <CategoryHeroBanner
        title="Pharmacy at your doorstep!"
        subtitle="Cough syrups, pain relief sprays & more"
        ctaText="Order Now"
        ctaLink="/subCategory/Pharmacy"
        bgColor="bg-teal-100"
        image={munchies}
      />
    </div>
  );
};

export default MunchiesBanner;
