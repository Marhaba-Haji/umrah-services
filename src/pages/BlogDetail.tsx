
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, FileText, Hotel, Car, Plane, Package } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();

  // Sample blog data - in real app, this would come from an API
  const blog = {
    id: 1,
    title: "Umrah Season 2025-2026: Dates, Visa Guide & Complete Information",
    slug: "umrah-season-2025-2026-dates-visa-guide-marhaba-haji",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=400&fit=crop",
    author: "Marhaba Haji Team",
    date: "2024-12-15",
    readTime: "5 min read",
    category: "Visa Guide",
    content: `
      <p>The Umrah season 2025-2026 is approaching, and millions of Muslims worldwide are preparing for this sacred journey. Understanding the key dates, visa requirements, and preparation steps is crucial for a smooth pilgrimage experience.</p>

      <h2>Important Dates for Umrah 2025-2026</h2>
      <p>The Umrah season runs year-round, but certain periods are more popular among pilgrims. Here are the key dates to consider for your 2025-2026 Umrah journey:</p>
      <ul>
        <li><strong>Peak Season:</strong> November 2025 - January 2026</li>
        <li><strong>Ramadan Umrah:</strong> March 2026 (dates may vary based on moon sighting)</li>
        <li><strong>Off-Peak Season:</strong> June - August 2025</li>
      </ul>

      <div class="cta-section">
        <p><strong>Ready to apply for your Umrah visa?</strong> Our expert team can help you process your visa application quickly and efficiently. <a href="/apply" class="cta-link">Start your visa application today</a> and secure your spot for the upcoming season.</p>
      </div>

      <h2>Visa Requirements and Documentation</h2>
      <p>Obtaining an Umrah visa requires proper documentation and following specific procedures. Here's what you need to know:</p>
      
      <h3>Required Documents:</h3>
      <ul>
        <li>Valid passport with at least 6 months validity</li>
        <li>Completed visa application form</li>
        <li>Recent passport-sized photographs</li>
        <li>Proof of accommodation in Saudi Arabia</li>
        <li>Flight booking confirmation</li>
        <li>Vaccination certificates (if required)</li>
      </ul>

      <div class="cta-section">
        <p>Planning your stay in the holy cities? <a href="/hotel" class="cta-link">Browse our curated selection of hotels</a> near Haram in Makkah and Madinah, with options for every budget and preference.</p>
      </div>

      <h2>Best Time to Perform Umrah</h2>
      <p>While Umrah can be performed year-round, timing your visit can significantly impact your experience:</p>
      
      <h3>Weather Considerations:</h3>
      <ul>
        <li><strong>Winter (November-February):</strong> Pleasant weather, ideal for pilgrimage</li>
        <li><strong>Spring (March-May):</strong> Moderate temperatures, good for elderly pilgrims</li>
        <li><strong>Summer (June-August):</strong> Hot weather but fewer crowds</li>
        <li><strong>Autumn (September-October):</strong> Cooling temperatures, comfortable for rituals</li>
      </ul>

      <div class="cta-section">
        <p>Need reliable transportation during your Umrah journey? <a href="/transport" class="cta-link">Book your airport transfers and intercity transport</a> in advance to ensure comfortable and timely travel between holy sites.</p>
      </div>

      <h2>Preparation Tips for First-Time Pilgrims</h2>
      <p>If this is your first Umrah, proper preparation is key to a meaningful pilgrimage:</p>
      
      <ol>
        <li><strong>Learn the Rituals:</strong> Familiarize yourself with the steps of Umrah</li>
        <li><strong>Physical Preparation:</strong> Build stamina for walking long distances</li>
        <li><strong>Spiritual Preparation:</strong> Increase prayers and recitation</li>
        <li><strong>Practical Preparation:</strong> Pack appropriate clothing and essentials</li>
      </ol>

      <div class="cta-section">
        <p>Consider joining one of our <a href="/group-packages" class="cta-link">group Umrah packages</a> for first-time pilgrims. Our experienced guides will assist you throughout the journey, making your pilgrimage smooth and spiritually fulfilling.</p>
      </div>

      <h2>Health and Safety Guidelines</h2>
      <p>Your health and safety are paramount during the pilgrimage. Here are essential guidelines:</p>
      
      <ul>
        <li>Stay hydrated, especially during summer months</li>
        <li>Wear comfortable walking shoes</li>
        <li>Follow crowd management instructions</li>
        <li>Keep emergency contacts handy</li>
        <li>Maintain personal hygiene</li>
      </ul>

      <div class="cta-section">
        <p>Looking for a comprehensive Umrah experience? Explore our <a href="/custom-packages" class="cta-link">custom Umrah packages</a> that can be tailored to your specific needs, including accommodation, transport, and guided tours.</p>
      </div>

      <h2>Financial Planning for Umrah</h2>
      <p>Budgeting properly for your Umrah journey ensures a stress-free pilgrimage experience. Consider these cost factors:</p>
      
      <ul>
        <li>Visa processing fees</li>
        <li>Flight tickets</li>
        <li>Accommodation costs</li>
        <li>Local transportation</li>
        <li>Food and beverages</li>
        <li>Shopping and souvenirs</li>
        <li>Emergency funds</li>
      </ul>

      <p>We hope this comprehensive guide helps you prepare for your Umrah journey in 2025-2026. May your pilgrimage be blessed and spiritually rewarding.</p>

      <div class="cta-section">
        <p>Ready to embark on your spiritual journey? <a href="/apply" class="cta-link">Apply for your Umrah visa today</a> and let us handle all the details while you focus on your spiritual preparation.</p>
      </div>
    `
  };

  const sidebarServices = [
    {
      title: "Apply for Umrah Visa",
      description: "Get your Umrah visa processed quickly",
      icon: FileText,
      link: "/apply",
      color: "emerald"
    },
    {
      title: "Book Hotel",
      description: "Hotels near Haram",
      icon: Hotel,
      link: "/hotel",
      color: "blue"
    },
    {
      title: "Book Transport",
      description: "Reliable transportation",
      icon: Car,
      link: "/transport",
      color: "purple"
    },
    {
      title: "Umrah Packages",
      description: "Complete packages",
      icon: Package,
      link: "/umrah-packages",
      color: "orange"
    }
  ];

  const relatedBlogs = [
    {
      title: "Best Hotels in Makkah: Your Ultimate Guide",
      slug: "best-hotels-makkah-guide",
      date: "2024-12-10"
    },
    {
      title: "Transportation Guide for Umrah Pilgrims",
      slug: "transportation-guide-umrah",
      date: "2024-12-05"
    },
    {
      title: "Essential Duas for Umrah Journey",
      slug: "essential-duas-umrah",
      date: "2024-11-25"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/blog-post" className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article>
              {/* Hero Image */}
              <div className="relative overflow-hidden rounded-2xl mb-8">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Article Header */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content.replace(/class="cta-section"/g, 'class="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl my-8 border-l-4 border-emerald-500"')
                    .replace(/class="cta-link"/g, 'class="text-emerald-600 font-semibold hover:text-emerald-700 underline transition-colors"')
                }}
              />

              {/* Share Section */}
              <div className="border-t border-gray-200 pt-8">
                <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Start Your Umrah Journey?</h3>
                  <p className="text-emerald-100 mb-6">
                    Let Marhaba Haji guide you through every step of your sacred pilgrimage
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/apply">
                      <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                        Apply for Umrah Visa
                      </Button>
                    </Link>
                    <Link to="/umrah-packages">
                      <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                        View Packages
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Services Cards */}
              <div className="space-y-4">
                {sidebarServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-${service.color}-100`}>
                            <Icon className={`w-5 h-5 text-${service.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                              {service.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {service.description}
                            </p>
                            <Link to={service.link}>
                              <Button size="sm" className="w-full text-xs bg-emerald-600 hover:bg-emerald-700">
                                Get Started
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Related Blogs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedBlogs.map((blog, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <Link to={`/blog-post/${blog.slug}`} className="block hover:text-emerald-600 transition-colors">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{blog.title}</h4>
                        <p className="text-xs text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
