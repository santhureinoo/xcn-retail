import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/ui/language-selector';

const GuestHomePage: React.FC = () => {
    const { t } = useTranslation();

    // Sample carousel items - replace with your actual content
    const carouselItems = [
        {
            id: 1,
            image: '/images/promotions/special-offer.jpg',
            title: t('guestHome.promotions.items.offer1.title'),
            description: t('guestHome.promotions.items.offer1.description'),
            link: '/register'
        },
        {
            id: 2,
            image: '/images/promotions/account-bundle.jpg',
            title: t('guestHome.promotions.items.offer2.title'),
            description: t('guestHome.promotions.items.offer2.description'),
            link: '/register'
        },
        {
            id: 3,
            image: '/images/promotions/referral.jpg',
            title: t('guestHome.promotions.items.offer3.title'),
            description: t('guestHome.promotions.items.offer3.description'),
            link: '/register'
        }
    ];

    const [activeSlide, setActiveSlide] = React.useState(0);

    // Carousel navigation
    const nextSlide = () => {
        setActiveSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
    };

    // Auto-advance carousel
    React.useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Add a simple header with language selector */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
                <LanguageSelector />
            </div>
        </header>

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="md:w-2/3">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        {t('guestHome.hero.title')}
                    </h1>
                    <p className="mt-6 text-xl text-blue-100 max-w-3xl">
                        {t('guestHome.hero.subtitle')}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 shadow-md transition duration-150"
                        >
                            {t('guestHome.hero.getStarted')}
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 bg-opacity-60 hover:bg-opacity-70 shadow-md transition duration-150"
                        >
                            {t('guestHome.hero.signIn')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative pattern */}
            <div className="hidden lg:block absolute right-0 inset-y-0 w-1/3 transform translate-x-1/4">
                <svg className="h-full w-full text-white opacity-20" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="0,0 100,0 50,100 0,100" />
                </svg>
            </div>
        </div>

        {/* Service Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                {t('guestHome.services.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                {/* Mobile Legends Diamonds Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300">
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500 relative">
                        <img
                            src="/images/services/ml-diamonds.jpg"
                            alt={t('guestHome.services.mlDiamonds.title')}
                            className="w-full h-full object-cover mix-blend-overlay"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('guestHome.services.mlDiamonds.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('guestHome.services.mlDiamonds.description')}
                        </p>
                        <ul className="space-y-2 mb-6 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {t('guestHome.services.mlDiamonds.features.cheaper')}
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {t('guestHome.services.mlDiamonds.features.instant')}
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {t('guestHome.services.mlDiamonds.features.secure')}
                            </li>
                        </ul>
                        <Link
                            to="/register"
                            className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-md hover:from-blue-600 hover:to-cyan-600 transition duration-150"
                        >
                            {t('guestHome.services.mlDiamonds.cta')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Promotional Carousel */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    {t('guestHome.promotions.title')}
                </h2>

                <div className="relative">
                    {/* Carousel container */}
                    <div className="overflow-hidden rounded-xl shadow-xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                        >
                            {carouselItems.map((item) => (
                                <div key={item.id} className="w-full flex-shrink-0">
                                    <div className="relative h-96 md:h-[28rem]">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
                                            <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                                            <p className="text-xl mb-6">{item.description}</p>
                                            <Link
                                                to={item.link}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition duration-150 self-start"
                                            >
                                                {t('guestHome.promotions.claimOffer')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition duration-150"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition duration-150"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Carousel indicators */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {carouselItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${activeSlide === index
                                    ? 'bg-blue-600 dark:bg-blue-400'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                {t('guestHome.testimonials.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl">
                            JD
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium text-gray-900 dark:text-white">John Doe</h3>
                            <div className="flex text-yellow-400">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('guestHome.testimonials.johnDoe')}
                    </p>
                </div>
            </div>
        </div>
    </div>
}

export default GuestHomePage;
