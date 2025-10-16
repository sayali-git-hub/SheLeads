import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '../services/buyerApi';

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getFeaturedProducts();
        if (mounted) setFeatured(res?.data || res || []);
      } catch (e) {
        setError('Failed to load featured products');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_30%,white,transparent_35%)]" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Welcome to SheLeads</h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-95 mb-8">Discover products from women-led businesses. Shop, support, and empower.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/products')} className="btn btn-outline bg-white/10 text-white border-white/40 hover:bg-white/20">Shop Now</button>
            <button onClick={() => navigate('/register')} className="btn btn-primary shadow-lg">Join as Seller</button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-pink-600 hover:text-pink-700">View all</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((p, i) => (
                <motion.div
                  key={p._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="h-40 bg-gray-50 flex items-center justify-center">
                    <img src={p.image || p.images?.[0] || 'https://via.placeholder.com/300x200'} alt={p.name} className="h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold line-clamp-1">{p.name}</div>
                    <div className="text-pink-600 font-bold mt-1">₹{p.price}</div>
                    <Link to={`/products/${p._id}`} className="mt-3 inline-block text-sm text-pink-600 hover:text-pink-700">View details</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Clothing', to: '/products?category=clothing', icon: '👗' },
              { name: 'Handmade', to: '/products?category=handmade', icon: '🧶' },
              { name: 'Beauty', to: '/products?category=beauty', icon: '💄' },
              { name: 'Home', to: '/products?category=home', icon: '🏠' },
            ].map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="bg-white border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition"
              >
                <Link to={c.to} className="block">
                  <div className="text-4xl mb-2">{c.icon}</div>
                  <div className="font-semibold">{c.name}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: 'Beautiful products and smooth experience!', name: 'Aisha' },
              { quote: 'Love supporting women entrepreneurs.', name: 'Meera' },
              { quote: 'Quality items and quick delivery.', name: 'Sara' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="border rounded-xl p-6 bg-white shadow-sm"
              >
                <p className="italic text-gray-700 mb-3">“{t.quote}”</p>
                <div className="font-semibold">{t.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-purple-600">
        <div className="container mx-auto px-4 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to grow your business? Join as a Seller Today.</h3>
          <Link to="/register" className="inline-block mt-4 bg-white text-rose-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">Get Started</Link>
        </div>
      </section>

      {/* Optional: Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700"
        aria-label="Scroll to top"
      >↑</button>
    </div>
  );
};

export default Home;
