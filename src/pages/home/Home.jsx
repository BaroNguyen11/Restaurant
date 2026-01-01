import Header from "../../components/Header"
import BestSellingFood from "./BestSelling";
import About from "./About";
import HeroSection from "./HeroSection";
import Promotion from "./Promotion";
import CustomerReviews from "./CustomerReviews";
import WhyChooseUs from "./WhyChooseUs";
import CTA from "./CTA";


const Home = () => {
    return(
        <>
           <HeroSection />
           <BestSellingFood />
           <About />
           <Promotion />
           <CustomerReviews />
           <WhyChooseUs />
           <CTA />
        </>
    )
}
export default Home;