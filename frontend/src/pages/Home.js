import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options || { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

function CountUp({ end, durationMs }) {
  const [value, setValue] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.4 });

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      setValue(Math.floor(progress * end));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, durationMs]);

  const display = useMemo(() => `${value}${end >= 50 ? '+' : ''}`, [value, end]);

  return (
    <span ref={ref}>{display}</span>
  );
}

const Home = () => {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_30%,white,transparent_35%)]" />
        <div className="relative container mx-auto px-4 py-24 text-center animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Empowering Women Entrepreneurs</h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-95 mb-8">
            Breaking barriers, building businesses - A platform dedicated to women from backward classes to take their business online
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn btn-primary shadow-lg">
              Start Selling
            </Link>
            <Link to="/products" className="btn btn-outline bg-white/10 text-white border-white/40 hover:bg-white/20">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* OUR MISSION SECTION */}
      <section className="py-16 bg-[#f9f9f9]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
            SheLeads is committed to empowering women entrepreneurs from backward classes and underprivileged communities by providing them a digital marketplace to showcase and sell their products. We believe every woman deserves equal opportunities to grow her business, regardless of her background or technical knowledge.
          </p>
        </div>
      </section>

      {/* THE PROBLEM WE SOLVE */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why SheLeads?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{
              icon: '🚫', title: 'Limited Access', text: 'Many talented women artisans lack access to online marketplaces'
            }, {
              icon: '💰', title: 'Financial Barriers', text: 'High costs of setting up e-commerce prevent small businesses'
            }, {
              icon: '📱', title: 'Technical Challenges', text: 'Lack of digital literacy makes online selling difficult'
            }, {
              icon: '🌍', title: 'Limited Reach', text: 'Local businesses struggle to reach wider audiences'
            }].map((c, i) => (
              <div key={i} className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow h-full">
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                <p className="text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Steps to Success</h2>

          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">Start Selling in 4 Easy Steps</h3>
            <div className="grid grid-cols-4 gap-4">
              {[{
                n: 1, icon: '📝', title: 'Register', points: ['Easy registration process', 'No technical knowledge required']
              }, {
                n: 2, icon: '📦', title: 'Add Products', points: ['Upload product images', 'Set your own prices', 'Manage inventory easily']
              }, {
                n: 3, icon: '🔔', title: 'Receive Orders', points: ['Get instant notifications', 'View customer details', 'Track all orders in one place']
              }, {
                n: 4, icon: '📈', title: 'Grow Your Business', points: ['Access to thousands of buyers', 'Analytics to track sales', 'Support at every step']
              }].map((s, i) => (
                <div key={i} className="relative bg-white rounded-xl p-6 border">
                  <div className="absolute -top-3 -left-3 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">{s.n}</div>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <h4 className="font-semibold mb-2">{s.title}</h4>
                  <ul className="text-gray-600 space-y-1 list-disc list-inside">
                    {s.points.map((p, idx) => (<li key={idx}>{p}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-center">Support Women Entrepreneurs</h3>
            <div className="grid grid-cols-3 gap-4">
              {[{
                n: 1, icon: '🛍️', title: 'Browse Products', points: ['Discover unique handmade products', 'Support women entrepreneurs']
              }, {
                n: 2, icon: '🛒', title: 'Place Orders', points: ['Easy checkout process', 'Secure transactions']
              }, {
                n: 3, icon: '📬', title: 'Receive Products', points: ['Direct from makers', 'Support local artisans']
              }].map((s, i) => (
                <div key={i} className="relative bg-white rounded-xl p-6 border">
                  <div className="absolute -top-3 -left-3 bg-rose-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">{s.n}</div>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <h4 className="font-semibold mb-2">{s.title}</h4>
                  <ul className="text-gray-600 space-y-1 list-disc list-inside">
                    {s.points.map((p, idx) => (<li key={idx}>{p}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose SheLeads?</h2>
          <div className="grid grid-cols-3 gap-6">
            {[{
              icon: '✨', title: 'Zero Commission', text: 'No hidden fees for sellers from backward classes'
            }, {
              icon: '🎓', title: 'Free Training', text: 'Tutorials and support in regional languages'
            }, {
              icon: '📱', title: 'Mobile-First', text: 'Easy to use on any device'
            }, {
              icon: '🤝', title: 'Community Support', text: 'Connect with other women entrepreneurs'
            }, {
              icon: '🌐', title: 'Multi-Language', text: 'Support for Hindi and regional languages'
            }, {
              icon: '💪', title: 'Empowerment Focus', text: 'Built specifically for underprivileged women'
            }].map((f, i) => (
              <div key={i} className="border rounded-xl p-6 text-center hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">What You'll Find Here</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '🧵', name: 'Handicrafts & Handlooms' },
              { icon: '👗', name: 'Clothing & Textiles' },
              { icon: '🍯', name: 'Food & Organic Products' },
              { icon: '💄', name: 'Beauty & Personal Care' },
              { icon: '🏠', name: 'Home Décor' },
              { icon: '💍', name: 'Jewelry & Accessories' },
            ].map((cat, i) => (
              <Link key={i} to="/products" className="group border rounded-xl p-6 text-center hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-semibold">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OUR IMPACT */}
      <section className="py-16 bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Our Impact</h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: '💼', label: 'Women Sellers', end: 50 },
              { icon: '🛍️', label: 'Products Listed', end: 200 },
              { icon: '📦', label: 'Orders Delivered', end: 100 },
              { icon: '🌟', label: 'Lives Empowered', end: 50 },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="text-4xl font-extrabold">
                  <CountUp end={s.end} durationMs={1200} />
                </div>
                <div className="opacity-90 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES (Optional) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Stories of Success</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                img: 'https://via.placeholder.com/300x200',
                quote: '"SheLeads helped me take my handicraft business online. Now I receive orders from all over India!"',
                name: 'Sunita Devi', location: 'Bihar', business: 'Handicrafts Seller'
              },
              {
                img: 'https://via.placeholder.com/300x200',
                quote: '"I never thought I could sell my products online. SheLeads made it so simple!"',
                name: 'Rekha Sharma', location: 'Rajasthan', business: 'Textile Seller'
              },
              {
                img: 'https://via.placeholder.com/300x200',
                quote: '"This platform gave me financial independence and confidence to grow my business."',
                name: 'Anita Patel', location: 'Gujarat', business: 'Food Products'
              },
            ].map((t, i) => (
              <div key={i} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <img src={t.img} alt={t.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="italic text-gray-700 mb-3">{t.quote}</p>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.location} • {t.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="max-w-3xl mx-auto text-gray-700 mb-8">
            SheLeads is a student-led initiative created as a mini-project to address real-world challenges faced by women entrepreneurs. We are passionate about using technology to create social impact and bridge the digital divide.
          </p>
          <h3 className="text-xl font-semibold mb-6">Our Core Values</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: '🎯', name: 'Empowerment' },
              { icon: '🤝', name: 'Inclusivity' },
              { icon: '💡', name: 'Innovation' },
              { icon: '❤️', name: 'Support' },
            ].map((v, i) => (
              <div key={i} className="bg-white border rounded-xl p-6">
                <div className="text-3xl mb-2">{v.icon}</div>
                <div className="font-semibold">{v.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-purple-600">
        <div className="container mx-auto px-4 text-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Start Selling?</h3>
              <p className="mb-6 opacity-90">Join hundreds of women entrepreneurs</p>
              <Link to="/register" className="btn btn-primary shadow">
                Start Selling Today
              </Link>
            </div>
            <div className="bg-white/10 rounded-xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl font-bold mb-2">Want to Support?</h3>
              <p className="mb-6 opacity-90">Discover unique products, empower women</p>
              <Link to="/products" className="btn btn-outline bg-white/10 text-white border-white/40 hover:bg-white/20">
                Shop & Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
