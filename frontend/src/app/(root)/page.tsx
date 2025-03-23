import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroCarousel from '@/components/Hero';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Featured Deals Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-pink-900 mb-8 text-center">Featured Top Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden relative">
              <Image
                src={`/img${item}.jpg`}
                alt="Hotel"
                width={400}
                height={300}
                quality={90}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Luxury Hotel {item}</h3>
                <p className="text-gray-600 mt-2">Starting from $150/night</p>
                <button className="mt-4 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-pink-900 mb-8 text-center">Featured Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={`/dest${item}.jpg`}
                alt="Destination"
                width={400}
                height={300}
                quality={90}
                className="w-full h-48 object-cover"
              />

              <div
                className="absolute inset-0 flex items-end p-4 bg-black/20 hover:bg-black/40 cursor-pointer transition-all duration-300"
              >
                <h3 className="text-white text-xl font-bold">Destination {item}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-green-900 text-center mb-8">What Our Guests Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Image
                    src={`/user${item}.jpg`}
                    alt="User"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-green-500">User {item}</h3>
                    <p className="text-gray-600">New York, USA</p>
                  </div>
                </div>
                <p className="text-gray-700">"Amazing experience! The rooms were clean and luxurious."</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us? */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-green-900 text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🏨', title: 'Best Prices', description: 'Guaranteed lowest prices for rooms.' },
            { icon: '🛎️', title: '24/7 Support', description: 'We’re here to help, anytime.' },
            { icon: '🔒', title: 'Secure Booking', description: 'Your data is safe with us.' },
            { icon: '🌟', title: 'Luxury Stays', description: 'Experience the best in comfort.' },
          ].map((feature, index) => (
            <div key={index} className="text-center bg-white p-4 rounded-md">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-pink-500 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-5">
            Ready to Book Your Stay?
          </h2>
          <p className="text-lg text-blue-200 mb-8">
            Sign up now and unlock exclusive deals & discounts!
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-100"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;