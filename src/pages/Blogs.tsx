
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowRight, Plane, Hotel, Car, FileText } from 'lucide-react';

const Blogs = () => {
  const blogs = [
    {
      id: 1,
      title: "Umrah Season 2025-2026: Dates, Visa Guide & Complete Information",
      slug: "umrah-season-2025-2026-dates-visa-guide-marhaba-haji",
      excerpt: "Everything you need to know about the upcoming Umrah season including important dates, visa requirements, and essential preparation tips.",
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=250&fit=crop",
      author: "Marhaba Haji Team",
      date: "2024-12-15",
      readTime: "5 min read",
      category: "Visa Guide"
    },
    {
      id: 2,
      title: "Best Hotels in Makkah: Your Ultimate Accommodation Guide",
      slug: "best-hotels-makkah-accommodation-guide",
      excerpt: "Discover the top-rated hotels in Makkah for your Umrah journey, from luxury stays to budget-friendly options near Haram.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      author: "Travel Expert",
      date: "2024-12-10",
      readTime: "7 min read",
      category: "Hotels"
    },
    {
      id: 3,
      title: "Complete Transportation Guide for Umrah Pilgrims",
      slug: "transportation-guide-umrah-pilgrims",
      excerpt: "Navigate Saudi Arabia with ease. Learn about airport transfers, intercity transport, and local transportation options.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
      author: "Transport Guide",
      date: "2024-12-05",
      readTime: "6 min read",
      category: "Transport"
    },
    {
      id: 4,
      title: "Group Umrah Packages: Benefits and What to Expect",
      slug: "group-umrah-packages-benefits-guide",
      excerpt: "Discover the advantages of choosing group Umrah packages and what makes them perfect for first-time pilgrims.",
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=250&fit=crop",
      author: "Package Expert",
      date: "2024-11-30",
      readTime: "8 min read",
      category: "Packages"
    },
    {
      id: 5,
      title: "Essential Duas and Prayers for Umrah Journey",
      slug: "essential-duas-prayers-umrah-journey",
      excerpt: "A comprehensive collection of important duas and prayers to recite during your blessed Umrah pilgrimage.",
      image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=250&fit=crop",
      author: "Islamic Scholar",
      date: "2024-11-25",
      readTime: "10 min read",
      category: "Spiritual Guide"
    },
    {
      id: 6,
      title: "Umrah Packing Checklist: Everything You Need to Know",
      slug: "umrah-packing-checklist-complete-guide",
      excerpt: "Don't forget anything important! Complete packing checklist for your Umrah journey with essential items and tips.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=250&fit=crop",
      author: "Travel Guide",
      date: "2024-11-20",
      readTime: "5 min read",
      category: "Travel Tips"
    }
  ];

  const sidebarServices = [
    {
      title: "Apply for Umrah Visa",
      description: "Get your Umrah visa processed quickly and hassle-free",
      icon: FileText,
      link: "/apply",
      color: "emerald"
    },
    {
      title: "Book Hotel",
      description: "Find the perfect accommodation near Haram",
      icon: Hotel,
      link: "/hotel",
      color: "blue"
    },
    {
      title: "Book Transport",
      description: "Reliable transportation for your journey",
      icon: Car,
      link: "/transport",
      color: "purple"
    },
    {
      title: "Group Flights",
      description: "Special rates for group bookings",
      icon: Plane,
      link: "/group-flights",
      color: "orange"
    }
  ];

  const featuredBlogs = blogs.slice(0, 3);
  const recentBlogs = blogs.slice(3, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Umrah <span className="text-emerald-600">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your ultimate guide to Umrah pilgrimage with expert tips, guides, and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((blog, index) => (
                <React.Fragment key={blog.id}>
                  <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold group-hover:text-emerald-600 transition-colors line-clamp-2">
                        <Link to={`/blog-post/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                      <div className="flex items-center justifiy-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{blog.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(blog.date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime}</span>
                          </span>
                        </div>
                      </div>
                      <Link to={`/blog-post/${blog.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                          Read More <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Native CTA every 3rd blog */}
                  {(index + 1) % 3 === 0 && (
                    <div className="md:col-span-2">
                      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
                        <CardContent className="p-8 text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Ready to Start Your Umrah Journey?
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Get expert guidance and seamless booking experience with Marhaba Haji
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/apply">
                              <Button className="bg-emerald-600 hover:bg-emerald-700">
                                Apply for Umrah Visa
                              </Button>
                            </Link>
                            <Link to="/umrah-packages">
                              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                                View Umrah Packages
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Services Cards */}
              <div className="grid grid-cols-1 gap-4">
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
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                Learn More
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Featured Blogs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Featured Blogs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredBlogs.map((blog) => (
                    <div key={blog.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <Link to={`/blog-post/${blog.slug}`} className="block hover:text-emerald-600 transition-colors">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{blog.title}</h4>
                        <p className="text-xs text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Blogs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Blogs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <div key={blog.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
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

export default Blogs;
