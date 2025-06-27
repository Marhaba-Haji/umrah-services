import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowRight, Plane, Hotel, Car, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });
      if (error) {
        setError(error.message);
        setBlogs([]);
      } else {
        setBlogs(data || []);
      }
      setLoading(false);
    };
    fetchBlogs();
  }, []);

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

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

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
