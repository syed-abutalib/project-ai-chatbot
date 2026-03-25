import { fetchLatestNews } from "@/lib/sanity/fetchLatestNews"
import GetStartedBanner from "./sections/GetStartedBanner"
import Hero from "./sections/Hero"
import LatestNews from "./sections/LatestNews"
import Stories from "./sections/Stories"
import TestimonialMarquee from "./sections/TestimonialMarquee"

const Home = async () => {
    const { featuredNews, latestPosts } = await fetchLatestNews();

    return (
        <main className="min-h-screen bg-black">
            <Hero />
            <LatestNews
                featuredNews={featuredNews}
                latestPosts={latestPosts}
            />
            <TestimonialMarquee />
            <GetStartedBanner />
        </main>
    )
}

export default Home